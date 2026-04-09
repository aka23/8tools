"use client";

import Link from "next/link";
import { useState } from "react";
import tools from "@/data/tools.json";

const categories = [
	"建設・土木",
	"人事・労務",
	"制度変更",
	"物流",
	"経理",
	"不動産",
	"飲食・小売",
	"税金・届出",
	"日付・時間",
	"数学・汎用",
	"ショッピング・日常",
	"金融・投資",
	"給与・人事",
] as const;

export default function Home() {
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const filtered = selectedCategory
		? tools.filter((t) => t.category === selectedCategory)
		: tools;

	return (
		<main className="flex-1">
			<div className="max-w-5xl mx-auto px-4 py-8">
				{/* Category Filter */}
				<div className="flex flex-wrap gap-2 mb-6">
					<button
						type="button"
						onClick={() => setSelectedCategory(null)}
						className={`px-3 py-1 rounded-md text-sm border ${
							selectedCategory === null
								? "bg-primary text-primary-foreground border-primary"
								: "border-border hover:border-primary"
						}`}
					>
						すべて
					</button>
					{categories.map((cat) => (
						<button
							key={cat}
							type="button"
							onClick={() =>
								setSelectedCategory(selectedCategory === cat ? null : cat)
							}
							className={`px-3 py-1 rounded-md text-sm border ${
								selectedCategory === cat
									? "bg-primary text-primary-foreground border-primary"
									: "border-border hover:border-primary"
							}`}
						>
							{cat}
						</button>
					))}
				</div>

				{/* Tool Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{filtered.map((tool) => (
						<Link
							key={tool.slug}
							href={`/tools/${tool.slug}`}
							className="border border-border rounded-md p-4 hover:border-primary transition-colors"
						>
							<div className="flex items-center gap-2 mb-2">
								<span className="text-primary text-xs">{tool.shape}</span>
								<span className="text-xs text-muted-foreground">
									{tool.category}
								</span>
							</div>
							<h2 className="font-semibold text-sm mb-1">{tool.name}</h2>
							<p className="text-xs text-muted-foreground">
								{tool.description}
							</p>
						</Link>
					))}
				</div>
			</div>
		</main>
	);
}
