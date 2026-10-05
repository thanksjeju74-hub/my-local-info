// local-info.json 에 새로 추가된 공공서비스 정보로
// Gemini AI가 블로그 글 1개를 자동으로 써서 src/content/posts/ 에 저장하는 스크립트
// 실행: node scripts/generate-blog-post.js
// 필요한 환경변수: GEMINI_API_KEY

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'public', 'data', 'local-info.json');
const POSTS_DIR = path.join(__dirname, '..', 'src', 'content', 'posts');
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

// [1단계] 가장 최근에 추가된 항목 꺼내기
// - 배열 형식이면 배열의 마지막 항목
// - { events: [], benefits: [] } 형식이면, addedAt(추가 시각)이 가장 늦은 항목(= 가장 최근에 추가된 항목)
//   addedAt이 있는 항목이 없으면 benefits → events 순서로 마지막 항목
function getLatestItem(data) {
  if (Array.isArray(data)) return data[data.length - 1];

  const events = data.events || [];
  const benefits = data.benefits || [];
  const all = [...events, ...benefits];

  const withTime = all.filter((item) => item.addedAt);
  if (withTime.length > 0) {
    return withTime.reduce((a, b) => (b.addedAt > a.addedAt ? b : a));
  }
  return benefits[benefits.length - 1] || events[events.length - 1];
}

// 이미 같은 name으로 작성된 글이 있는지 확인
function isAlreadyWritten(name) {
  if (!fs.existsSync(POSTS_DIR)) return false;
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.md'))
    .some((file) => fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8').includes(name));
}

// [2단계] Gemini AI로 블로그 글 생성
async function generateWithGemini(item) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('환경변수 GEMINI_API_KEY 가 없습니다.');

  const prompt = `아래 공공서비스 정보를 바탕으로 블로그 글을 작성해줘.

정보: ${JSON.stringify(item, null, 2)}

아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: (친근하고 흥미로운 제목)
date: (오늘 날짜 YYYY-MM-DD)
summary: (한 줄 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
---

(본문: 800자 이상, 친근한 블로그 톤, 추천 이유 3가지 포함, 신청 방법 안내)

마지막 줄에 FILENAME: YYYY-MM-DD-keyword 형식으로 파일명도 출력해줘. 키워드는 영문으로.

오늘 날짜: ${getToday()}`;

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
  if (!text) throw new Error('Gemini 응답이 비어 있습니다.');
  return text;
}

// Gemini 응답을 "글 내용"과 "파일명"으로 나누기
function parseResponse(text, sourceName) {
  const today = getToday();

  // 혹시 붙어 있을 수 있는 마크다운 코드블록 표시 제거
  let cleaned = text.replace(/```(markdown|md)?/gi, '').trim();

  // FILENAME 줄 찾기
  let fileName = '';
  const fileMatch = cleaned.match(/FILENAME:\s*(.+)\s*$/im);
  if (fileMatch) {
    fileName = fileMatch[1].trim();
    cleaned = cleaned.replace(fileMatch[0], '').trim();
  }

  // 글은 반드시 '---' 로 시작해야 함 (앞에 쓸데없는 말이 있으면 잘라냄)
  const start = cleaned.indexOf('---');
  if (start === -1) throw new Error('Gemini 응답에서 frontmatter(---)를 찾지 못했습니다.');
  let content = cleaned.slice(start);

  // frontmatter 부분 다듬기
  const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!fmMatch) throw new Error('frontmatter 형식이 올바르지 않습니다.');

  const fmLines = fmMatch[1].split('\n').map((line) => {
    // 날짜는 항상 오늘로 고정
    if (/^date:/.test(line)) return `date: ${today}`;
    // 제목/요약에 ':' 같은 특수문자가 있어도 깨지지 않게 따옴표로 감싸기
    const m = line.match(/^(title|summary):\s*(.*)$/);
    if (m) {
      const value = m[2].trim().replace(/^["']|["']$/g, '');
      return `${m[1]}: ${JSON.stringify(value)}`;
    }
    return line;
  });
  // 어떤 공공서비스로 쓴 글인지 기록 (중복 작성 방지용)
  fmLines.push(`sourceName: ${JSON.stringify(sourceName)}`);

  content = content.replace(fmMatch[0], `---\n${fmLines.join('\n')}\n---`);

  // 파일명 정리: 영문 소문자/숫자/하이픈만 남기고, 앞에는 오늘 날짜를 붙임
  let keyword = fileName
    .replace(/\.md$/i, '')
    .replace(/^\d{4}-\d{2}-\d{2}-?/, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  if (!keyword) keyword = 'public-service';

  return { content: content.trim() + '\n', baseName: `${today}-${keyword}` };
}

async function main() {
  try {
    // [1단계] 최신 데이터 확인
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const latest = getLatestItem(data);
    if (!latest || !latest.name) {
      console.log('글을 쓸 데이터가 없습니다');
      return;
    }

    if (isAlreadyWritten(latest.name)) {
      console.log('이미 작성된 글입니다');
      return;
    }

    // [2단계] Gemini로 글 생성
    const text = await generateWithGemini(latest);
    const { content, baseName } = parseResponse(text, latest.name);

    // [3단계] 파일 저장 (같은 이름의 파일이 있으면 덮어쓰지 않고 -2, -3 ... 을 붙임)
    if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });
    let filePath = path.join(POSTS_DIR, `${baseName}.md`);
    let count = 2;
    while (fs.existsSync(filePath)) {
      filePath = path.join(POSTS_DIR, `${baseName}-${count}.md`);
      count++;
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`블로그 글 생성 완료: ${path.basename(filePath)}`);
  } catch (error) {
    // 에러가 나면 아무 파일도 저장하지 않으므로 기존 파일은 그대로 유지됩니다.
    console.error('에러 발생 (기존 파일은 유지됩니다):', error.message);
    process.exitCode = 1;
  }
}

main();
