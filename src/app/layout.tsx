import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "성남시 우리 동네 생활 정보 | 축제·행사·지원금 소식",
  description: "성남시의 최신 문화 행사, 지역 축제 소식 및 청년·가족 맞춤 지원금 혜택 정보를 한곳에서 확인하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className="min-h-screen bg-[#FFFDF9] text-stone-800 antialiased font-sans flex flex-col">
        {children}
      </body>
    </html>
  );
}
