import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const slugs = getAllPostSlugs();
  // 포스트가 없을 때도 정적 빌드가 가능하도록 더미 항목 반환
  if (slugs.length === 0) {
    return [{ slug: "_placeholder" }];
  }
  return slugs;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: "글을 찾을 수 없습니다 | 성남시 생활 정보" };
  }
  return {
    title: `${post.title} | 성남시 생활 정보 블로그`,
    description: post.summary,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF9]">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-30 bg-[#FFFDF9]/90 backdrop-blur-md border-b border-amber-100/80 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center text-lg shadow-sm shadow-orange-200">
              🏡
            </span>
            <span className="text-base font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
              성남시 생활 정보
            </span>
          </Link>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-stone-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/60 transition-colors"
          >
            ← 블로그 목록
          </Link>
        </div>
      </header>

      {/* 본문 */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full">
        {/* 이동 경로 */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <Link href="/" className="hover:text-amber-700">홈</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-amber-700">블로그</Link>
          <span>/</span>
          <span className="text-stone-800 font-medium truncate max-w-[200px] sm:max-w-none">
            {post.title}
          </span>
        </nav>

        <article className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm relative overflow-hidden">
          {/* 상단 포인트 컬러 바 */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 to-orange-500" />

          {/* 카테고리 & 날짜 */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pt-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900">
              {post.category}
            </span>
            {post.date && (
              <time className="text-xs text-stone-400 font-medium">📅 {post.date}</time>
            )}
          </div>

          {/* 제목 */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-snug">
            {post.title}
          </h1>

          {/* 요약 */}
          {post.summary && (
            <p className="mt-3 text-base sm:text-lg text-stone-500 leading-relaxed pb-6 border-b border-stone-100">
              {post.summary}
            </p>
          )}

          {/* 태그 */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] text-stone-500 bg-stone-100 px-2.5 py-1 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* 마크다운 본문 */}
          <div className="mt-8 prose prose-stone prose-sm sm:prose-base max-w-none
            prose-headings:font-bold prose-headings:text-stone-900
            prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline
            prose-code:text-orange-700 prose-code:bg-orange-50 prose-code:px-1 prose-code:rounded
            prose-blockquote:border-amber-400 prose-blockquote:text-stone-600
            prose-li:marker:text-amber-500">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* 유의사항 배너 */}
          <div className="mt-10 p-4 rounded-xl bg-orange-50/70 border border-orange-200/60 text-xs text-orange-900 flex items-start gap-2.5">
            <span className="text-base shrink-0">⚠️</span>
            <p className="leading-relaxed">
              본 글은 공공데이터포털(data.go.kr)의 공개 자료를 기반으로 AI가 자동 작성한 콘텐츠입니다. 세부 사항은 주최 측 사정에 따라 변경될 수 있으므로, 신청 전 공식 사이트에서 반드시 확인해 주세요.
            </p>
          </div>

          {/* 쿠팡 파트너스 배너 (향후 실제 배너로 교체) */}
          <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white text-center">
            <p className="text-xs font-medium opacity-80 mb-1">이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</p>
            <p className="text-base font-bold">🛒 관련 생활용품 쿠팡에서 확인하기 →</p>
          </div>

          {/* 하단 버튼 */}
          <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
            <Link
              href="/blog"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              ← 블로그 목록으로
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors border border-amber-200/60"
            >
              🏡 홈으로 돌아가기
            </Link>
          </div>
        </article>
      </main>

      {/* 하단 푸터 */}
      <footer className="mt-16 bg-stone-100 border-t border-stone-200 text-stone-600 text-xs py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-bold text-stone-800">성남시 생활 정보 알리미</p>
            <p className="text-stone-500 text-[11px] mt-0.5">공공데이터 및 AI 자동 생성 생활 가이드</p>
          </div>
          <p className="text-stone-400 text-[11px]">© 2026 우리 동네 생활 정보. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
