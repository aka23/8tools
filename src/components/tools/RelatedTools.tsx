import Link from "next/link";
import toolsData from "@/data/tools.json";

type Props = {
	slugs: string[];
	tip?: string;
};

export function RelatedTools({ slugs, tip }: Props) {
	const tools = slugs
		.map((slug) => toolsData.find((t) => t.slug === slug))
		.filter((t) => t !== undefined);

	return (
		<div className="space-y-3">
			{tip && <p className="leading-relaxed">{tip}</p>}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{tools.map((tool) => (
					<Link
						key={tool.slug}
						href={`/tools/${tool.slug}`}
						className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
					>
						<span className="text-primary font-bold text-lg leading-none mt-0.5">
							{tool.shape}
						</span>
						<div>
							<p className="text-sm font-medium text-foreground">{tool.name}</p>
							<p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
								{tool.description}
							</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
