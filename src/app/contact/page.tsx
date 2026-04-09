"use client";

import type { FormEvent } from "react";
import { useState } from "react";

export default function ContactPage() {
	const [submitted, setSubmitted] = useState(false);

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setSubmitted(true);
	}

	return (
		<main className="flex-1">
			<div className="max-w-xl mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold mb-6">お仕事依頼</h1>
				{submitted ? (
					<p className="text-sm">
						送信ありがとうございます。内容を確認の上、ご連絡いたします。
					</p>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label htmlFor="name" className="block text-sm font-medium mb-1">
								名前
							</label>
							<input
								id="name"
								name="name"
								type="text"
								required
								className="w-full border border-input rounded-md px-3 py-2 text-sm"
							/>
						</div>
						<div>
							<label htmlFor="email" className="block text-sm font-medium mb-1">
								メールアドレス
							</label>
							<input
								id="email"
								name="email"
								type="email"
								required
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
								name="message"
								rows={5}
								required
								className="w-full border border-input rounded-md px-3 py-2 text-sm"
							/>
						</div>
						<button
							type="submit"
							className="bg-primary text-primary-foreground px-6 py-2 rounded-md text-sm font-medium hover:opacity-90"
						>
							送信する
						</button>
					</form>
				)}
			</div>
		</main>
	);
}
