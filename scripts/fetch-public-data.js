// 공공데이터포털에서 새로운 공공서비스 정보 1건을 가져와
// Gemini AI로 가공한 뒤 public/data/local-info.json 에 추가하는 스크립트
// 실행: node scripts/fetch-public-data.js
// 필요한 환경변수: PUBLIC_DATA_API_KEY, GEMINI_API_KEY

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'public', 'data', 'local-info.json');
const PUBLIC_API_URL = 'https://api.odcloud.kr/api/gov24/v3/serviceList';
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent';

// 오늘 날짜를 'YYYY-MM-DD' 형식으로 만들기
function getToday() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// [1단계] 공공데이터포털 API에서 데이터 가져오기
async function fetchPublicData() {
  const apiKey = process.env.PUBLIC_DATA_API_KEY;
  if (!apiKey) throw new Error('환경변수 PUBLIC_DATA_API_KEY 가 없습니다.');

  const params = new URLSearchParams({
    page: '1',
    perPage: '20',
    returnType: 'JSON',
    serviceKey: apiKey,
  });

  const res = await fetch(`${PUBLIC_API_URL}?${params.toString()}`);
  if (!res.ok) throw new Error(`공공데이터 API 요청 실패: ${res.status}`);

  const json = await res.json();
  return Array.isArray(json.data) ? json.data : [];
}

// 지역 키워드로 필터링 (성남 → 경기 → 전체)
function filterByRegion(items) {
  const hasKeyword = (item, keyword) =>
    ['서비스명', '서비스목적요약', '지원대상', '소관기관명'].some((key) =>
      String(item[key] || '').includes(keyword)
    );

  const seongnam = items.filter((item) => hasKeyword(item, '성남'));
  if (seongnam.length > 0) return seongnam;

  const gyeonggi = items.filter((item) => hasKeyword(item, '경기'));
  if (gyeonggi.length > 0) return gyeonggi;

  return items;
}

// 기존 데이터에 들어있는 모든 항목을 하나의 목록으로 모으기
// (배열 형식, 또는 { events: [], benefits: [] } 형식 모두 지원)
function getAllExistingItems(existing) {
  if (Array.isArray(existing)) return existing;
  return [...(existing.events || []), ...(existing.benefits || [])];
}

// [3단계] Gemini AI로 1건 가공
async function processWithGemini(item) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('환경변수 GEMINI_API_KEY 가 없습니다.');

  const prompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL}
category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.
startDate가 없으면 오늘 날짜, endDate가 없으면 '상시'로 넣어.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

오늘 날짜: ${getToday()}
공공데이터:
${JSON.stringify(item, null, 2)}`;

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });
  if (!res.ok) throw new Error(`Gemini API 요청 실패: ${res.status}`);

  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // 마크다운 코드블록(```json ... ```) 제거 후 { ... } 부분만 꺼내기
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Gemini 응답에서 JSON을 찾지 못했습니다.');

  return JSON.parse(cleaned.slice(start, end + 1));
}

async function main() {
  try {
    // 기존 데이터 읽기
    const existing = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const existingItems = getAllExistingItems(existing);
    const existingNames = new Set(existingItems.map((item) => item.name));

    // [1단계] 가져오기 + 지역 필터링
    const rawItems = await fetchPublicData();
    const filtered = filterByRegion(rawItems);

    // [2단계] 이미 있는 항목(name 기준) 제외
    const newItems = filtered.filter((item) => !existingNames.has(item['서비스명']));
    if (newItems.length === 0) {
      console.log('새로운 데이터가 없습니다');
      return;
    }

    // [3단계] 새 항목 1개만 Gemini로 가공
    const processed = await processWithGemini(newItems[0]);

    // id는 사이트 주소(/info/[id])에 쓰이므로 반드시 "글자"여야 함
    // 기존 형식에 맞춰 "event-번호" 또는 "benefit-번호"로 만들고, 겹치지 않을 때까지 번호를 올림
    const prefix = processed.category === '행사' ? 'event' : 'benefit';
    const usedIds = new Set(existingItems.map((item) => String(item.id)));
    let num = 1;
    while (usedIds.has(`${prefix}-${num}`)) num++;
    processed.id = `${prefix}-${num}`;

    // 언제 추가됐는지 기록 (블로그 글 스크립트가 가장 최근 항목을 찾을 때 사용)
    processed.addedAt = new Date().toISOString();

    // [4단계] 기존 데이터에 추가해서 저장
    if (Array.isArray(existing)) {
      existing.push(processed);
    } else {
      const key = processed.category === '행사' ? 'events' : 'benefits';
      if (!Array.isArray(existing[key])) existing[key] = [];
      existing[key].push(processed);
      existing.updatedAt = getToday();
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2) + '\n', 'utf-8');
    console.log(`새 항목 추가 완료: ${processed.name}`);
  } catch (error) {
    // 에러가 나면 파일을 저장하지 않으므로 기존 local-info.json 이 그대로 유지됩니다.
    console.error('에러 발생 (기존 데이터는 유지됩니다):', error.message);
    process.exitCode = 1;
  }
}

main();
