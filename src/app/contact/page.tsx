"use client";

import { useState } from "react";

type Step = "form" | "confirm" | "complete";

export default function ContactPage() {
	const [step, setStep] = useState<Step>("form");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [sending, setSending] = useState(false);
	const [error, setError] = useState("");

	function handleConfirm() {
		if (!name.trim() || !email.trim() || !message.trim()) return;
		setStep("confirm");
	}

	async function handleSend() {
		setSending(true);
		setError("");
		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: name.trim(),
					email: email.trim(),
					message: message.trim(),
				}),
			});
			if (!res.ok) {
				setError("送信に失敗しました。時間をおいて再度お試しください。");
				setSending(false);
				return;
			}
			setStep("complete");
		} catch {
			setError("送信に失敗しました。時間をおいて再度お試しください。");
			setSending(false);
		}
	}

	return (
		<main className="flex-1">
			<div className="max-w-xl mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold mb-6">お仕事依頼</h1>

				{step === "form" && (
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleConfirm();
						}}
						className="space-y-4"
					>
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium mb-1"
							>
								名前
							</label>
							<input
								id="name"
								type="text"
								required
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full border border-input rounded-md px-3 py-2 text-sm"
							/>
						</div>
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium mb-1"
							>
								メールアドレス
							</label>
							<input
								id="email"
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full border border-input rounded-md px-3 py-2 text-sm"
							/>
						</div>
						<div>
							<label
								htmlFor="message"
								className="block text-sm font-medium mb-1"
							>
								相談内容
							</label>
							<textarea
								id="message"
								rows={5}
								required
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								className="w-full border border-input rounded-md px-3 py-2 text-sm"
							/>
						</div>
						<button
							type="submit"
							className="bg-primary text-primary-foreground px-6 py-2 rounded-md text-sm font-medium hover:opacity-90"
						>
							確認画面へ
						</button>
					</form>
				)}

				{step === "confirm" && (
					<div className="space-y-6">
						<p className="text-sm text-muted-foreground">
							以下の内容で送信します。よろしいですか？
						</p>
						<div className="border border-border rounded-md p-4 space-y-3 text-sm">
							<div>
								<p className="text-muted-foreground text-xs">名前</p>
								<p className="font-medium">{name}</p>
							</div>
							<div>
								<p className="text-muted-foreground text-xs">メールアドレス</p>
								<p className="font-medium">{email}</p>
							</div>
							<div>
								<p className="text-muted-foreground text-xs">相談内容</p>
								<p className="whitespace-pre-wrap">{message}</p>
							</div>
						</div>
						{error && (
							<p className="text-sm text-destructive">{error}</p>
						)}
						<div className="flex gap-3">
							<button
								type="button"
								onClick={() => setStep("form")}
								className="border border-border px-6 py-2 rounded-md text-sm font-medium hover:bg-secondary"
							>
								戻る
							</button>
							<button
								type="button"
								onClick={handleSend}
								disabled={sending}
								className="bg-primary text-primary-foreground px-6 py-2 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50"
							>
								{sending ? "送信中..." : "送信する"}
							</button>
						</div>
					</div>
				)}

				{step === "complete" && (
					<div className="space-y-4">
						<div className="border border-border rounded-md p-6 text-center">
							<p className="text-lg font-bold mb-2">送信が完了しました</p>
							<p className="text-sm text-muted-foreground">
								内容を確認の上、ご連絡いたします。
							</p>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
