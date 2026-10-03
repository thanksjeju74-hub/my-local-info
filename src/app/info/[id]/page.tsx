import Link from "next/link";
import { notFound } from "next/navigation";
import localInfoData from "../../../../public/data/local-info.json";

interface InfoItem {
  id: string;
  name: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  summary: string;
  description?: string;
  benefitAmount?: string;
  link: string;
  tag: string;
  status: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

// 정적 배포(output: 'export')를 위한 모든 페이지 ID 사전 생성
export function generateStaticParams() {
  const allItems = [
    ...(localInfoData.events || []),
    ...(localInfoData.benefits || []),
  ];
  return allItems.map((item) => ({
    id: item.id,
  }));
}

// 페이지별 맞춤 메타데이터
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const allItems = [
    ...(localInfoData.events || []),
    ...(localInfoData.benefits || []),
  ] as InfoItem[];
  const item = allItems.find((i) => i.id === id);

  if (!item) {
    return { title: "정보를 찾을 수 없습니다 | 성남시 생활 정보" };
  }

  return {
    title: `${item.name} | 성남시 생활 정보`,
    description: item.summary,
  };
}

export default async function InfoDetailPage({ params }: PageProps) {
  const { id } = await params;
  const allItems = [
    ...(localInfoData.events || []),
    ...(localInfoData.benefits || []),
  ] as InfoItem[];
  const item = allItems.find((i) => i.id === id);

  if (!item) {
    notFound();
  }

  const isBenefit = item.category === "혜택";

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF9]">
      {/* 상단 네비게이션 헤더 */}
      <header className="sticky top-0 z-30 bg-[#FFFDF9]/90 backdrop-blur-md border-b border-amber-100/80 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
          >
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center text-lg shadow-sm shadow-orange-200">
              🏡
            </span>
            <div>
              <span className="text-base font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
                성남시 생활 정보
              </span>
              <span className="text-[10px] block text-stone-400 -mt-0.5">
                ← 홈으로 이동
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-stone-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/60 transition-colors"
          >
            <span>← 목록으로 돌아가기</span>
          </Link>
        </div>
      </header>

      {/* 본문 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full">
        {/* 상단 이동 경로 (Breadcrumb) */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <Link href="/" className="hover:text-amber-700">홈</Link>
          <span>/</span>
          <Link
            href={isBenefit ? "/#benefits" : "/#events"}
            className="hover:text-amber-700"
          >
            {isBenefit ? "지원금 & 혜택" : "행사 & 축제"}
          </Link>
          <span>/</span>
          <span className="text-stone-800 font-medium truncate max-w-[200px] sm:max-w-none">
            {item.name}
          </span>
        </nav>

        {/* 상세 메인 카드 */}
        <article className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm relative overflow-hidden">
          {/* 상단 포인트 컬러 바 */}
          <div
            className={`absolute top-0 left-0 right-0 h-2 ${
              isBenefit
                ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                : "bg-gradient-to-r from-amber-400 to-orange-500"
            }`}
          />

          {/* 태그 & 상태 뱃지 헤더 */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pt-2">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isBenefit
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-900"
                }`}
              >
                {item.tag}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  isBenefit
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-orange-50 text-orange-700 border-orange-200"
                }`}
              >
                {item.status}
              </span>
            </div>

            {item.benefitAmount && (
              <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-2xs">
                💰 {item.benefitAmount}
              </span>
            )}
          </div>

          {/* 행사 / 혜택 이름 (크게) */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-snug">
            {item.name}
          </h1>

          {/* 한 줄 핵심 요약 */}
          <p className="mt-3 text-base sm:text-lg text-stone-600 leading-relaxed pb-6 border-b border-stone-100">
            {item.summary}
          </p>

          {/* 핵심 정보 요약 박스 (기간, 장소, 대상) */}
          <section className="my-8 bg-amber-50/50 rounded-2xl p-5 sm:p-6 border border-amber-100">
            <h2 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-4">
              📌 핵심 정보 안내
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col gap-1 p-3 bg-white/80 rounded-xl border border-amber-100/70">
                <dt className="text-stone-400 text-xs font-medium">📅 진행 및 신청 기간</dt>
                <dd className="font-semibold text-stone-800">
                  {item.startDate} ~ {item.endDate}
                </dd>
              </div>

              <div className="flex flex-col gap-1 p-3 bg-white/80 rounded-xl border border-amber-100/70">
                <dt className="text-stone-400 text-xs font-medium">📍 장소 및 신청처</dt>
                <dd className="font-semibold text-stone-800">
                  {item.location}
                </dd>
              </div>

              <div className="flex flex-col gap-1 p-3 bg-white/80 rounded-xl border border-amber-100/70 sm:col-span-2">
                <dt className="text-stone-400 text-xs font-medium">👥 지원 및 참여 대상</dt>
                <dd className="font-semibold text-stone-800">
                  {item.target}
                </dd>
              </div>
            </dl>
          </section>

          {/* 상세 설명 전문 */}
          <section className="my-8">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
              <span>📝</span>
              <span>상세 안내 내용</span>
            </h2>
            <div className="text-stone-700 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line bg-stone-50/70 p-6 rounded-2xl border border-stone-200/60">
              {item.description || item.summary}
            </div>
          </section>

          {/* 유의사항 배너 */}
          <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200/60 text-xs text-orange-900 mb-8 flex items-start gap-2.5">
            <span className="text-base shrink-0">⚠️</span>
            <p className="leading-relaxed">
              본 정보는 성남시 및 주관 공공기관의 공공데이터를 기반으로 작성되었습니다. 세부 일정 및 지원 자격은 주최 측의 사정이나 예산 상황에 따라 변경될 수 있으므로, 신청 전 반드시 아래 원본 공식 사이트를 확인해 주시기 바랍니다.
            </p>
          </div>

          {/* 하단 액션 버튼 그룹 */}
          <div className="pt-6 border-t border-stone-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>← 목록으로 돌아가기</span>
            </Link>

            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full sm:w-auto px-7 py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] ${
                isBenefit
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                  : "bg-orange-600 hover:bg-orange-700 shadow-orange-200"
              }`}
            >
              <span>자세히 보기</span>
              <span className="text-base">→</span>
            </a>
          </div>
        </article>
      </main>

      {/* 하단 푸터 */}
      <footer className="mt-16 bg-stone-100 border-t border-stone-200 text-stone-600 text-xs py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-bold text-stone-800">성남시 생활 정보 알리미</p>
            <p className="text-stone-500 text-[11px] mt-0.5">
              공공데이터포털(data.go.kr) 오픈 API 연동
            </p>
          </div>
          <p className="text-stone-400 text-[11px]">
            © 2026 우리 동네 생활 정보. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
