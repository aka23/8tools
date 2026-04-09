"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";

export default function ManDayPage() {
	const [ninzu, setNinzu] = useState("");
	const [nissuu, setNissuu] = useState("");
	const [tanka, setTanka] = useState("");
	const [result, setResult] = useState<{
		ninku: number;
		kingaku: number | null;
	} | null>(null);

	function calculate() {
		const n = parseFloat(ninzu);
		const d = parseFloat(nissuu);
		const t = tanka !== "" ? parseFloat(tanka) : null;

		if (Number.isNaN(n) || Number.isNaN(d) || n <= 0 || d <= 0) return;

		const ninku = n * d;
		const kingaku = t !== null && !Number.isNaN(t) && t > 0 ? ninku * t : null;

		setResult({ ninku, kingaku });
	}

	return (
		<ToolLayout
			title="人工計算ツール"
			description="人数・日数・単価から人工数と概算金額を計算します"
		>
			<div className="space-y-6">
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div>
						<label htmlFor="ninzu" className="block text-sm font-medium mb-1">
							人数（人）
						</label>
						<input
							id="ninzu"
							type="number"
							value={ninzu}
							onChange={(e) => setNinzu(e.target.value)}
							placeholder="例: 5"
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>
					<div>
						<label htmlFor="nissuu" className="block text-sm font-medium mb-1">
							日数（日）
						</label>
						<input
							id="nissuu"
							type="number"
							value={nissuu}
							onChange={(e) => setNissuu(e.target.value)}
							placeholder="例: 10"
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>
					<div>
						<label htmlFor="tanka" className="block text-sm font-medium mb-1">
							人工単価（円/人工）
							<span className="ml-1 text-xs text-muted-foreground">任意</span>
						</label>
						<input
							id="tanka"
							type="number"
							value={tanka}
							onChange={(e) => setTanka(e.target.value)}
							placeholder="例: 25000"
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>
				</div>

				<button
					type="button"
					onClick={calculate}
					className="w-full bg-primary text-primary-foreground py-2 px-4 rounded font-medium hover:opacity-90 transition-colors"
				>
					計算する
				</button>

				{result && (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="bg-secondary border border-border rounded-lg p-6 text-center">
							<p className="text-sm text-muted-foreground mb-1">人工数</p>
							<p className="text-4xl font-bold text-primary">
								{result.ninku.toLocaleString()}
							</p>
							<p className="text-sm text-muted-foreground mt-1">人工</p>
						</div>
						{result.kingaku !== null && (
							<div className="bg-secondary border border-border rounded-lg p-6 text-center">
								<p className="text-sm text-muted-foreground mb-1">概算金額</p>
								<p className="text-4xl font-bold">
									{result.kingaku.toLocaleString()}
								</p>
								<p className="text-sm text-muted-foreground mt-1">円</p>
							</div>
						)}
					</div>
				)}

				<div className="mt-8 space-y-3 text-sm text-muted-foreground">
					<h2 className="text-base font-semibold text-foreground">
						人工（にんく）とは
					</h2>
					<p>
						人工（にんく）とは、作業量を表す単位で「1人が1日（8時間）で行える仕事量」を1人工（1にんく）と表します。建設・土木・製造・IT業界などで広く使われる工数の単位です。
					</p>
					<h3 className="font-semibold text-foreground mt-3">計算式</h3>
					<ul className="list-disc list-inside space-y-1">
						<li>人工数 ＝ 人数 × 日数</li>
						<li>概算金額 ＝ 人工数 × 人工単価</li>
					</ul>
					<p className="text-xs mt-2">
						※「人工」は「にんく」と読みます。「じんこう」と読む場合は別の意味になります。
					</p>
				</div>
			</div>
		</ToolLayout>
	);
}
