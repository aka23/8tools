import Link from "next/link";

type ToolLayoutProps = {
	title: string;
	description: string;
	children: React.ReactNode;
};

export function ToolLayout({ title, description, children }: ToolLayoutProps) {
	return (
		<main className="flex-1">
			<div className="max-w-3xl mx-auto px-4 py-8">
				<Link
					href="/"
					className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block"
				>
					← ツール一覧
				</Link>
				<h1 className="text-2xl font-bold mb-2">{title}</h1>
				<p className="text-muted-foreground mb-8">{description}</p>
				{children}
				<div className="mt-12 pt-6 border-t border-border text-xs text-muted-foreground">
					※ 本ツールの計算結果は参考値です。正確な数値は専門家にご確認ください。
				</div>
			</div>
		</main>
	);
}
