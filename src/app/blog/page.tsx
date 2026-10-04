import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "생활 정보 블로그 | 성남시 우리 동네 생활 정보",
  description: "성남시의 최신 축제 소식과 놓치기 쉬운 생활 지원금 정보를 알기 쉽게 정리해 드립니다.",
};

export default function BlogListPage() {
  const posts = getAllPosts();

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF9]">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-30 bg-[#FFFDF9]/90 backdrop-blur-md border-b border-amber-100/80 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center text-xl shadow-sm shadow-orange-200">
              🏡
            </span>
            <div>
              <span className="text-lg font-bold text-stone-900 group-hover:text-orange-600 transition-colors block leading-none">
                성남시 생활 정보
              </span>
              <span className="text-[11px] font-medium text-amber-700/80">
                우리 동네 맞춤 알림터
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-stone-700 hover:text-amber-700 hover:bg-amber-100/60 transition-colors"
            >
              ← 홈으로
            </Link>
            <Link
              href="/blog"
              className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-orange-700 bg-orange-100/80 transition-colors"
            >
              📝 생활 블로그
            </Link>
          </nav>
        </div>
      </header>

      {/* 블로그 헤더 타이틀 */}
      <section className="bg-gradient-to-b from-amber-100/60 via-orange-50/40 to-[#FFFDF9] py-10 px-4 sm:px-6 border-b border-amber-100/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 bg-amber-200/60 text-amber-900 px-3.5 py-1 rounded-full text-xs font-semibold mb-3">
            <span>📚</span>
            <span>AI 맞춤 생활 가이드</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            우리 동네 <span className="text-orange-600">생활 정보 블로그</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-stone-600 max-w-xl mx-auto">
            매일 업데이트되는 성남시의 알짜배기 행사와 복지 혜택을 알기 쉽게 풀어 설명해 드립니다.
          </p>
        </div>
      </section>

      {/* 블로그 글 목록 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full">
        {posts.length === 0 ? (
          <div className="text-center py-20 px-4 bg-white rounded-3xl border border-stone-200/80 p-8 shadow-xs">
            <span className="text-5xl block mb-4">✍️</span>
            <h2 className="text-xl font-bold text-stone-800">
              아직 등록된 블로그 글이 없습니다
            </h2>
            <p className="mt-2 text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
              매일 아침 AI가 성남시의 새로운 축제와 지원금 정보를 분석하여 유익한 생활 가이드 글을 자동으로 발행할 예정입니다.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow-xs transition-colors"
              >
                메인 화면으로 돌아가기 →
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200/60">
              <span className="text-sm font-bold text-stone-800">
                전체 포스트 ({posts.length}개)
              </span>
              <span className="text-xs text-stone-500">최신순 정렬</span>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="group bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* 상단 카테고리 & 날짜 */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900">
                        {post.category}
                      </span>
                      {post.date && (
                        <time className="text-xs text-stone-400 font-medium">
                          📅 {post.date}
                        </time>
                      )}
                    </div>

                    {/* 글 제목 */}
                    <h2 className="text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    {/* 요약 미리보기 (summary 필드 사용) */}
                    <p className="mt-3 text-stone-600 text-sm leading-relaxed line-clamp-2">
                      {post.summary}
                    </p>

                    {/* 태그 목록 */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 하단 읽기 버튼 */}
                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-amber-700 font-medium">
                      자세히 읽기
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-50 group-hover:bg-amber-500 group-hover:text-white text-amber-700 transition-colors"
                    >
                      →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 하단 푸터 */}
      <footer className="mt-16 bg-stone-100 border-t border-stone-200 text-stone-600 text-xs py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-bold text-stone-800">성남시 생활 정보 알리미</p>
            <p className="text-stone-500 text-[11px] mt-0.5">
              공공데이터 및 AI 자동 생성 생활 가이드
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
