import type { ReactNode } from "react";

type Props = {
	id: string;
	title: string;
	children: ReactNode;
};

export function ArticleSection({ id, title, children }: Props) {
	return (
		<section
			id={id}
			className="mt-10 space-y-3 text-sm text-muted-foreground border-t border-border pt-8"
		>
			<h2 className="text-lg font-semibold text-foreground">{title}</h2>
			{children}
		</section>
	);
}
