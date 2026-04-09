import { NextResponse } from "next/server";

// {{NEXT_PUBLIC_SUPABASE_URL}} — SupabaseプロジェクトのURL
// {{NEXT_PUBLIC_SUPABASE_ANON_KEY}} — Supabaseの匿名キー

export async function POST(req: Request) {
	const body = await req.json();
	const message = typeof body.message === "string" ? body.message.trim() : "";

	if (!message) {
		return NextResponse.json({ error: "メッセージが空です" }, { status: 400 });
	}

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseKey) {
		// Supabase未設定時はログのみ出力して成功扱い
		console.log("[UGA Request]", message);
		return NextResponse.json({ ok: true });
	}

	const res = await fetch(`${supabaseUrl}/rest/v1/requests`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			apikey: supabaseKey,
			Authorization: `Bearer ${supabaseKey}`,
		},
		body: JSON.stringify({ message }),
	});

	if (!res.ok) {
		return NextResponse.json({ error: "保存に失敗しました" }, { status: 500 });
	}

	return NextResponse.json({ ok: true });
}
