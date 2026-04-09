import Link from "next/link";

export function Footer() {
	return (
		<footer className="border-t border-border mt-auto">
			<div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
				<div className="flex items-center gap-4">
					<Link href="/privacy" className="hover:text-foreground">
						プライバシーポリシー
					</Link>
					<span>|</span>
					<Link href="/terms" className="hover:text-foreground">
						利用規約
					</Link>
				</div>
				<p>&copy; 2026 8tools.org</p>
			</div>
		</footer>
	);
}
