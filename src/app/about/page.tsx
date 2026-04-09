import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "About — 8tools.org",
	description: "8tools.orgについて",
};

export default function AboutPage() {
	return (
		<main className="flex-1">
			<div className="max-w-3xl mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold mb-8">About</h1>

				<div className="space-y-8 text-sm leading-relaxed">
					<section>
						<h2 className="text-lg font-bold mb-3">
							DA凡夫（だぼんぷ）
						</h2>
						<p>Web開発者。キャリア20年超。</p>
						<p className="mt-3">
							かつて月間数百万PVの大規模Webサービスを一人で構築・運営していました。企画、設計、実装、SEO、収益化まで、すべて一人で。
						</p>
						<p className="mt-3">
							今はAIを相棒に、さらに加速しています。
						</p>
						<p className="mt-3">
							このサイトに並んでいるツールは、すべて私がAI（Claude
							Code）と一緒に作ったものです。人間がコードを書いた行数はゼロ。私がやっているのは「何を作るか」を決めることだけ。設計と判断が私の仕事で、実装はAIの仕事です。
						</p>
					</section>

					<section>
						<h3 className="text-base font-bold mb-3">
							なぜ8TOOLSを作っているのか
						</h3>
						<p>エンジニアの価値は変わりました。</p>
						<p className="mt-3">
							「React何年」「PHP何年」——そういうラベルで人を測る時代は終わりつつあります。AIがあれば、技術スタックは数時間でキャッチアップできる。本当に差がつくのは、何を作るべきか判断する力と、それを形にする速度です。
						</p>
						<p className="mt-3">
							でも、それを証明する場所がまだない。履歴書にもポートフォリオにも、「何でも速く作れます」と書く欄はありません。
						</p>
						<p className="mt-3">
							だから自分で作りました。このサイトが私のショーケースです。
						</p>
					</section>

					<section>
						<h3 className="text-base font-bold mb-3">お仕事について</h3>
						<p>
							「こういうツールが欲しい」「こういうシステムを作りたい」——そんなご相談があれば、お気軽にどうぞ。技術スタックは問いません。Webに関わることなら、だいたい何でもやれます。
						</p>
						<p className="mt-3">
							大企業のように大きなチームを組んで動くタイプではありません。一人で速く、静かに、確実に仕上げます。
						</p>
						<p className="mt-6">
							<Link
								href="/contact"
								className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md text-sm font-medium hover:opacity-90"
							>
								お仕事依頼はこちら →
							</Link>
						</p>
					</section>
				</div>
			</div>
		</main>
	);
}
