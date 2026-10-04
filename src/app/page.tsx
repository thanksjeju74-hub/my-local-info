import Link from "next/link";
import localInfoData from "../../public/data/local-info.json";

interface EventItem {
  id: string;
  name: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  summary: string;
  link: string;
  tag: string;
  status: string;
}

interface BenefitItem {
  id: string;
  name: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  summary: string;
  benefitAmount?: string;
  link: string;
  tag: string;
  status: string;
}

export default function HomePage() {
  const events = (localInfoData.events || []) as EventItem[];
  const benefits = (localInfoData.benefits || []) as BenefitItem[];
  const updatedAt = localInfoData.updatedAt || "2026-10-04";

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. 상단 글로벌 네비게이션 */}
      <header className="sticky top-0 z-30 bg-[#FFFDF9]/90 backdrop-blur-md border-b border-amber-100/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center text-xl shadow-sm shadow-orange-200">
              🏡
            </span>
            <div>
              <span className="text-lg font-bold text-stone-900 tracking-tight block leading-none">
                성남시 생활 정보
              </span>
              <span className="text-[11px] font-medium text-amber-700/80">
                우리 동네 맞춤 알림터
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            <a
              href="#events"
              className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-stone-700 hover:text-amber-700 hover:bg-amber-100/60 transition-colors"
            >
              🎉 축제·행사
            </a>
            <a
              href="#benefits"
              className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-stone-700 hover:text-amber-700 hover:bg-amber-100/60 transition-colors"
            >
              🎁 지원금·혜택
            </a>
            <Link
              href="/blog"
              className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-orange-700 bg-orange-100/70 hover:bg-orange-200/80 transition-colors"
            >
              📝 블로그
            </Link>
          </nav>
        </div>
      </header>

      {/* 2. 따뜻하고 친근한 히어로 섹션 */}
      <section className="bg-gradient-to-b from-amber-100/70 via-orange-50/50 to-[#FFFDF9] pt-10 pb-12 px-4 sm:px-6 border-b border-amber-100/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 bg-amber-200/60 text-amber-900 px-3.5 py-1 rounded-full text-xs font-semibold mb-4">
            <span>✨</span>
            <span>매일 새로워지는 우리 동네 소식</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
            성남시의 <span className="text-orange-600 underline decoration-amber-300 decoration-wavy decoration-2">즐거운 행사</span>와
            <br />
            <span className="text-amber-700">놓치기 아까운 혜택</span>을 모았어요!
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            공공데이터포털에서 직접 검증된 성남시 축제 일정과 정부·지자체 지원금 정보를 알기 쉽게 정리해 드립니다.
          </p>

          {/* 주요 카테고리 퀵 뱃지 */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-white/80 border border-amber-200/70 text-xs text-stone-700 shadow-2xs">
              🌸 봄맞이 나들이
            </span>
            <span className="px-3 py-1 rounded-lg bg-white/80 border border-amber-200/70 text-xs text-stone-700 shadow-2xs">
              💼 청년 창업 지원
            </span>
            <span className="px-3 py-1 rounded-lg bg-white/80 border border-amber-200/70 text-xs text-stone-700 shadow-2xs">
              🏠 청년 주거 월세
            </span>
            <span className="px-3 py-1 rounded-lg bg-white/80 border border-amber-200/70 text-xs text-stone-700 shadow-2xs">
              👶 아이사랑 출산지원금
            </span>
          </div>
        </div>
      </section>

      {/* 3. 본문 컨텐츠 영역 */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full space-y-16">
        
        {/* 섹션 1: 이번 달 행사 & 축제 */}
        <section id="events" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-amber-200/60 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎉</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                  이번 달 행사 & 축제
                </h2>
              </div>
              <p className="text-stone-500 text-sm mt-1">
                가족, 연인, 친구와 함께 가기 좋은 성남시의 이달의 축제 소식입니다.
              </p>
            </div>
            <span className="text-xs font-semibold text-orange-700 bg-orange-100/80 px-2.5 py-1 rounded-full self-start sm:self-auto">
              총 {events.length}건 진행
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <article
                key={event.id}
                className="group bg-white rounded-3xl p-6 border border-stone-200/70 shadow-xs hover:shadow-md hover:border-amber-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* 상단 뱃지 */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-900">
                      {event.tag}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                      {event.status}
                    </span>
                  </div>

                  {/* 제목 */}
                  <h3 className="text-xl font-bold text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                    <Link href={`/info/${event.id}`}>
                      {event.name}
                    </Link>
                  </h3>

                  {/* 상세 내용 요약 */}
                  <p className="mt-2.5 text-stone-600 text-sm leading-relaxed line-clamp-3">
                    {event.summary}
                  </p>

                  {/* 핵심 세부 정보 목록 */}
                  <dl className="mt-5 pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
                    <div className="flex items-start gap-2">
                      <dt className="text-stone-400 font-medium shrink-0">📅 기간</dt>
                      <dd className="font-medium text-stone-800">
                        {event.startDate} ~ {event.endDate}
                      </dd>
                    </div>
                    <div className="flex items-start gap-2">
                      <dt className="text-stone-400 font-medium shrink-0">📍 장소</dt>
                      <dd className="text-stone-700">{event.location}</dd>
                    </div>
                    <div className="flex items-start gap-2">
                      <dt className="text-stone-400 font-medium shrink-0">👥 대상</dt>
                      <dd className="text-stone-700">{event.target}</dd>
                    </div>
                  </dl>
                </div>

                {/* 카드 하단 액션 버튼 */}
                <div className="mt-6 pt-3">
                  <Link
                    href={`/info/${event.id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-900 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors border border-amber-200/60"
                  >
                    <span>자세히 보기</span>
                    <span className="text-base leading-none">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 안내 배너 (향후 광고 또는 알림 영역) */}
        <aside className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="inline-block bg-white/20 text-xs px-2.5 py-0.5 rounded-full font-medium mb-2 backdrop-blur-xs">
                💡 알림 받기
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">
                우리 동네 새 소식을 가장 먼저 확인하세요!
              </h3>
              <p className="text-amber-100 text-xs sm:text-sm mt-1">
                매일 아침 7시, 인공지능이 성남시의 새로운 복지와 행사 정보를 자동으로 업데이트합니다.
              </p>
            </div>
            <a
              href="#benefits"
              className="shrink-0 px-5 py-2.5 rounded-xl bg-white text-orange-700 font-bold text-xs sm:text-sm shadow-sm hover:bg-amber-50 transition-colors"
            >
              지원금 바로 확인하기
            </a>
          </div>
          {/* 장식용 은은한 원형 효과 */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </aside>

        {/* 섹션 2: 맞춤 지원금 & 복지 혜택 */}
        <section id="benefits" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-amber-200/60 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎁</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                  지원금 & 생활 혜택
                </h2>
              </div>
              <p className="text-stone-500 text-sm mt-1">
                신청 기간을 놓치면 받을 수 없는 성남시민 전용 혜택을 놓치지 마세요.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full self-start sm:self-auto">
              총 {benefits.length}건 안내
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit) => (
              <article
                key={benefit.id}
                className="group bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/70 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                {/* 상단 장식 바 */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500" />

                <div>
                  {/* 상단 뱃지 및 지원 금액 */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                      {benefit.tag}
                    </span>
                    {benefit.benefitAmount && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-600 text-white shadow-2xs">
                        💰 {benefit.benefitAmount}
                      </span>
                    )}
                  </div>

                  {/* 제목 */}
                  <h3 className="text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                    <Link href={`/info/${benefit.id}`}>
                      {benefit.name}
                    </Link>
                  </h3>

                  {/* 상세 내용 요약 */}
                  <p className="mt-3 text-stone-600 text-sm leading-relaxed">
                    {benefit.summary}
                  </p>

                  {/* 혜택 세부 조건 목록 */}
                  <dl className="mt-5 pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
                    <div className="flex items-start gap-2">
                      <dt className="text-stone-400 font-medium shrink-0">👥 지원 대상</dt>
                      <dd className="font-medium text-stone-800">{benefit.target}</dd>
                    </div>
                    <div className="flex items-start gap-2">
                      <dt className="text-stone-400 font-medium shrink-0">📅 신청 기간</dt>
                      <dd className="text-stone-700">
                        {benefit.startDate} ~ {benefit.endDate} ({benefit.status})
                      </dd>
                    </div>
                    <div className="flex items-start gap-2">
                      <dt className="text-stone-400 font-medium shrink-0">🏢 신청 방법</dt>
                      <dd className="text-stone-700">{benefit.location}</dd>
                    </div>
                  </dl>
                </div>

                {/* 카드 하단 액션 버튼 */}
                <div className="mt-6 pt-3">
                  <Link
                    href={`/info/${benefit.id}`}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100/90 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors border border-emerald-200/60"
                  >
                    <span>상세 정보 및 신청 방법 확인</span>
                    <span className="text-base leading-none">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

      </main>

      {/* 4. 하단 푸터 */}
      <footer className="mt-16 bg-stone-100 border-t border-stone-200 text-stone-600 text-xs py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-bold text-stone-800 text-sm">성남시 생활 정보</span>
              <span className="text-[11px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded">
                공공데이터 연동
              </span>
            </div>
            <p className="text-stone-500">
              데이터 출처: 공공데이터포털(data.go.kr) 오픈 API 공식 데이터
            </p>
            <p className="text-stone-400 text-[11px]">
              본 사이트에 게재된 축제 및 지원금 정보는 공공기관 공개 자료를 토대로 제공되며, 주최 측 사정에 따라 변경될 수 있습니다.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1 text-stone-500">
            <div>
              마지막 데이터 업데이트: <span className="font-medium text-stone-700">{updatedAt}</span>
            </div>
            <p className="text-stone-400 text-[11px]">
              © 2026 우리 동네 생활 정보. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
