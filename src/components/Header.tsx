"use client";

import Link from "next/link";
import { useState } from "react";

export function Header() {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<header className="border-b border-border">
			<div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
				<Link href="/" className="text-xl font-bold text-primary">
					8tools.org
				</Link>

				{/* Desktop nav */}
				<nav className="hidden md:flex items-center gap-6">
					<Link href="/about" className="text-sm hover:text-primary">
						About
					</Link>
					<Link href="/contact" className="text-sm hover:text-primary">
						お仕事依頼
					</Link>
				</nav>

				{/* Mobile hamburger */}
				<button
					type="button"
					className="md:hidden p-2"
					onClick={() => setMenuOpen(!menuOpen)}
					aria-label="メニューを開く"
				>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
						role="img"
					>
						<title>メニュー</title>
						{menuOpen ? (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						) : (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						)}
					</svg>
				</button>
			</div>

			{/* Mobile menu */}
			{menuOpen && (
				<nav className="md:hidden border-t border-border px-4 py-3 flex flex-col gap-3">
					<Link
						href="/about"
						className="text-sm hover:text-primary"
						onClick={() => setMenuOpen(false)}
					>
						About
					</Link>
					<Link
						href="/contact"
						className="text-sm hover:text-primary"
						onClick={() => setMenuOpen(false)}
					>
						お仕事依頼
					</Link>
				</nav>
			)}
		</header>
	);
}
