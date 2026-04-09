import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

const notoSansJP = Noto_Sans_JP({
	variable: "--font-noto-sans-jp",
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "8tools.org — 無料Webツール集",
	description: "業務で使える無料の計算・変換ツールを集めたサイトです。",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja" className={cn(inter.variable, notoSansJP.variable)}>
			<body className="min-h-screen flex flex-col bg-background text-foreground font-sans">
				<Header />
				{children}
				<Footer />
			</body>
		</html>
	);
}
