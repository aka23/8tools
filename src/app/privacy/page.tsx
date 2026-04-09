import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "プライバシーポリシー — 8tools.org",
	description: "8tools.orgのプライバシーポリシー",
};

export default function PrivacyPage() {
	return (
		<main className="flex-1">
			<div className="max-w-3xl mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold mb-6">プライバシーポリシー</h1>
				<div className="space-y-6 text-sm leading-relaxed">
					<section>
						<h2 className="text-lg font-semibold mb-2">
							個人情報の取り扱いについて
						</h2>
						<p>
							8tools.org（以下「当サイト」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。
						</p>
					</section>
					<section>
						<h2 className="text-lg font-semibold mb-2">収集する情報</h2>
						<p>
							当サイトの計算ツールはすべてブラウザ上で動作し、入力データをサーバーに送信しません。
							ツールリクエスト窓に入力された内容は、ツール開発の参考として保存しますが、
							IPアドレスやユーザーエージェント等の個人を特定できる情報は収集しません。
						</p>
					</section>
					<section>
						<h2 className="text-lg font-semibold mb-2">
							アクセス解析ツールについて
						</h2>
						<p>
							当サイトでは、サービス向上のためにアクセス解析ツールを使用する場合があります。
							これらのツールはCookieを使用してデータを収集しますが、個人を特定する情報は含まれません。
						</p>
					</section>
					<section>
						<h2 className="text-lg font-semibold mb-2">
							プライバシーポリシーの変更
						</h2>
						<p>
							当サイトは、必要に応じて本ポリシーを変更することがあります。変更後のポリシーは当ページに掲載した時点で効力を生じます。
						</p>
					</section>
					<p className="text-muted-foreground">制定日: 2026年4月1日</p>
				</div>
			</div>
		</main>
	);
}
