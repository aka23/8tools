import { NextResponse } from "next/server";
import { Resend } from "resend";

// {{RESEND_API_KEY}} — ResendのAPIキー
// {{CONTACT_EMAIL_TO}} — 受信先メールアドレス

export async function POST(req: Request) {
	const body = await req.json();
	const name = typeof body.name === "string" ? body.name.trim() : "";
	const email = typeof body.email === "string" ? body.email.trim() : "";
	const message = typeof body.message === "string" ? body.message.trim() : "";

	if (!name || !email || !message) {
		return NextResponse.json(
			{ error: "すべての項目を入力してください" },
			{ status: 400 },
		);
	}

	const apiKey = process.env.RESEND_API_KEY;
	const toEmail = process.env.CONTACT_EMAIL_TO;

	if (!apiKey || !toEmail) {
		console.log("[Contact]", { name, email, message });
		return NextResponse.json({ ok: true });
	}

	const resend = new Resend(apiKey);

	const { error } = await resend.emails.send({
		from: "8tools.org <noreply@8tools.org>",
		to: [toEmail],
		replyTo: email,
		subject: `【8tools.org】お仕事依頼: ${name}`,
		text: `名前: ${name}\nメール: ${email}\n\n${message}`,
	});

	if (error) {
		console.error("[Contact] Send error:", error);
		return NextResponse.json(
			{ error: "送信に失敗しました" },
			{ status: 500 },
		);
	}

	return NextResponse.json({ ok: true });
}
