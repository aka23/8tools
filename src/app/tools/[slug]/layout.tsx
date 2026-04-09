import type { ReactNode } from "react";
import type { Metadata } from "next";
import toolsData from "@/data/tools.json";

type Props = {
	params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const tool = toolsData.find((t) => t.slug === slug);

	if (!tool) {
		return {
			title: "8TOOLS — 無料Webツール集",
			description: "業務で使える無料の計算・変換ツールを集めたサイトです。",
		};
	}

	return {
		title: tool.seoTitle ?? `${tool.name} — 8TOOLS`,
		description: tool.seoDescription ?? tool.description,
	};
}

export default function ToolSlugLayout({ children }: { children: ReactNode }) {
	return <>{children}</>;
}
