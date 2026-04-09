import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "お仕事依頼・お問い合わせ｜8TOOLS",
	description: "8TOOLSへのお仕事依頼・ご質問はこちらから。Webツール開発・業務自動化・AI活用など、お気軽にご相談ください。",
};

export default function ContactLayout({ children }: { children: ReactNode }) {
	return <>{children}</>;
}
