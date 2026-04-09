import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About — 8tools.org",
	description: "8tools.orgについて",
};

export default function AboutPage() {
	return (
		<main className="flex-1">
			<div className="max-w-3xl mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold mb-6">About</h1>
				<div className="space-y-4 text-sm leading-relaxed">
					<p>
						8tools.orgは、業務で使える無料の計算・変換ツールを集めたWebサイトです。
					</p>
					<p>
						建設・土木、人事・労務、物流、経理、不動産など、さまざまな業種で必要になる計算を、
						ブラウザ上で手軽に行えます。
					</p>
					<p>
						ログイン不要・完全無料でご利用いただけます。計算はすべてブラウザ上で行われ、
						入力データがサーバーに送信されることはありません。
					</p>
					<p>
						「こんなツールが欲しい」というリクエストがありましたら、トップページのリクエスト窓からお気軽にお寄せください。
					</p>
				</div>
			</div>
		</main>
	);
}
