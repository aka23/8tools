import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "利用規約｜8TOOLS",
	description: "8TOOLSの利用規約ページです。サービスのご利用にあたっての規約をご確認ください。",
};

export default function TermsPage() {
	return (
		<main className="flex-1">
			<div className="max-w-3xl mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold mb-6">利用規約</h1>
				<div className="space-y-6 text-sm leading-relaxed">
					<section>
						<h2 className="text-lg font-semibold mb-2">第1条（適用）</h2>
						<p>
							本規約は、8TOOLS（以下「当サイト」）が提供するすべてのサービスの利用条件を定めるものです。
							ユーザーは本規約に同意の上、当サイトをご利用ください。
						</p>
					</section>
					<section>
						<h2 className="text-lg font-semibold mb-2">
							第2条（計算結果について）
						</h2>
						<p>
							当サイトで提供する計算ツールの結果は参考値であり、正確性を保証するものではありません。
							重要な意思決定には、必ず専門家にご相談ください。
						</p>
					</section>
					<section>
						<h2 className="text-lg font-semibold mb-2">第3条（免責事項）</h2>
						<p>
							当サイトの利用により生じたいかなる損害についても、当サイト運営者は一切の責任を負いません。
						</p>
					</section>
					<section>
						<h2 className="text-lg font-semibold mb-2">第4条（禁止事項）</h2>
						<p>以下の行為を禁止します。</p>
						<ul className="list-disc list-inside mt-2 space-y-1">
							<li>当サイトのサービスを不正に利用する行為</li>
							<li>当サイトの運営を妨害する行為</li>
							<li>その他、当サイト運営者が不適切と判断する行為</li>
						</ul>
					</section>
					<section>
						<h2 className="text-lg font-semibold mb-2">第5条（規約の変更）</h2>
						<p>
							当サイトは、必要に応じて本規約を変更することがあります。変更後の規約は当ページに掲載した時点で効力を生じます。
						</p>
					</section>
					<p className="text-muted-foreground">制定日: 2026年4月1日</p>
				</div>
			</div>
		</main>
	);
}
