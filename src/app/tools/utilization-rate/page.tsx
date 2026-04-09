"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";

export default function UtilizationRatePage() {
	const [keikakuJikan, setKeikakuJikan] = useState("");
	const [jissaiJikan, setJissaiJikan] = useState("");
	const [seiansuu, setSeiansuu] = useState("");
	const [furyosu, setFuryosu] = useState("");
	const [result, setResult] = useState<{
		kadoritsu: number;
		furyoritsu: number;
		budomari: number;
	} | null>(null);

	function calculate() {
		const k = parseFloat(keikakuJikan);
		const j = parseFloat(jissaiJikan);
		const s = parseFloat(seiansuu);
		const f = parseFloat(furyosu);

		if (
			Number.isNaN(k) ||
			Number.isNaN(j) ||
			Number.isNaN(s) ||
			Number.isNaN(f)
		)
			return;
		if (k <= 0 || s <= 0) return;

		const kadoritsu = (j / k) * 100;
		const furyoritsu = (f / s) * 100;
		const budomari = ((s - f) / s) * 100;

		setResult({ kadoritsu, furyoritsu, budomari });
	}

	return (
		<ToolLayout
			title="稼働率・不良率計算ツール"
			description="計画時間・実稼働時間・生産数・不良数から各率を計算します"
		>
			<div className="space-y-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label htmlFor="keikaku" className="block text-sm font-medium mb-1">
							計画時間（時間）
						</label>
						<input
							id="keikaku"
							type="number"
							value={keikakuJikan}
							onChange={(e) => setKeikakuJikan(e.target.value)}
							placeholder="例: 480"
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>
					<div>
						<label htmlFor="jissai" className="block text-sm font-medium mb-1">
							実稼働時間（時間）
						</label>
						<input
							id="jissai"
							type="number"
							value={jissaiJikan}
							onChange={(e) => setJissaiJikan(e.target.value)}
							placeholder="例: 420"
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>
					<div>
						<label htmlFor="seisan" className="block text-sm font-medium mb-1">
							生産数（個）
						</label>
						<input
							id="seisan"
							type="number"
							value={seiansuu}
							onChange={(e) => setSeiansuu(e.target.value)}
							placeholder="例: 1000"
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>
					<div>
						<label htmlFor="furyo" className="block text-sm font-medium mb-1">
							不良数（個）
						</label>
						<input
							id="furyo"
							type="number"
							value={furyosu}
							onChange={(e) => setFuryosu(e.target.value)}
							placeholder="例: 30"
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
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div className="bg-secondary border border-border rounded-lg p-4 text-center">
							<p className="text-xs text-muted-foreground mb-1">稼働率</p>
							<p className="text-3xl font-bold text-primary">
								{result.kadoritsu.toFixed(1)}%
							</p>
						</div>
						<div className="bg-secondary border border-border rounded-lg p-4 text-center">
							<p className="text-xs text-muted-foreground mb-1">不良率</p>
							<p className="text-3xl font-bold text-destructive">
								{result.furyoritsu.toFixed(1)}%
							</p>
						</div>
						<div className="bg-secondary border border-border rounded-lg p-4 text-center">
							<p className="text-xs text-muted-foreground mb-1">歩留まり</p>
							<p className="text-3xl font-bold text-green-600">
								{result.budomari.toFixed(1)}%
							</p>
						</div>
					</div>
				)}

				<div className="mt-8 space-y-3 text-sm text-muted-foreground">
					<h2 className="text-base font-semibold text-foreground">
						計算式の説明
					</h2>
					<dl className="space-y-2">
						<div>
							<dt className="font-semibold text-foreground">稼働率</dt>
							<dd className="ml-4">
								稼働率（%）＝ 実稼働時間 ÷ 計画時間 × 100
							</dd>
							<dd className="ml-4 text-xs">
								設備や人員が計画どおりに動いている割合を表します。
							</dd>
						</div>
						<div>
							<dt className="font-semibold text-foreground">不良率</dt>
							<dd className="ml-4">不良率（%）＝ 不良数 ÷ 生産数 × 100</dd>
							<dd className="ml-4 text-xs">
								生産した製品のうち不合格品の割合です。
							</dd>
						</div>
						<div>
							<dt className="font-semibold text-foreground">
								歩留まり（ぶどまり）
							</dt>
							<dd className="ml-4">
								歩留まり（%）＝ （生産数 − 不良数）÷ 生産数 × 100
							</dd>
							<dd className="ml-4 text-xs">
								生産した製品のうち合格品の割合です。不良率と合計すると100%になります。
							</dd>
						</div>
					</dl>
				</div>
			</div>
		</ToolLayout>
	);
}
