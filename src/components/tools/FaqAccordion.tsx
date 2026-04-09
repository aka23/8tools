import type { ReactNode } from "react";

type FaqItem = {
	question: string;
	answer: string | ReactNode;
};

type Props = {
	items: FaqItem[];
};

export function FaqAccordion({ items }: Props) {
	return (
		<div className="space-y-2">
			{items.map((item) => (
				<details key={item.question} className="border border-border rounded-lg">
					<summary className="px-4 py-3 text-sm font-medium text-foreground cursor-pointer hover:bg-secondary/50 list-none flex items-center justify-between">
						{item.question}
						<span className="ml-2 text-muted-foreground text-xs select-none">▼</span>
					</summary>
					<div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
						{item.answer}
					</div>
				</details>
			))}
		</div>
	);
}
