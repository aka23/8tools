"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";

export default function Wall106Page() {
	const [jikyu, setJikyu] = useState("");
	const [weeks, setWeeks] = useState("");
	const [result, setResult] = useState<{
		nennshu: number;
		gesshu: number;
		taisho: boolean;
		shakaiHoken: number;
		tedoriDiff: number;
	} | null>(null);

	function calculate() {
		const j = parseFloat(jikyu);
		const w = parseFloat(weeks);
		if (Number.isNaN(j) || Number.isNaN(w) || j <= 0 || w <= 0) return;

		const nenshu = j * w * 52;
		const gesshu = nenshu / 12;
		const taisho = gesshu >= 88000 && w >= 20;
		const shakaiHoken = nenshu * 0.15;
		const tedoriDiff = taisho ? -shakaiHoken : 0;

		setResult({ nennshu: nenshu, gesshu, taisho, shakaiHoken, tedoriDiff });
	}

	return (
		<ToolLayout
			title="106万の壁シミュレーター"
			description="時給と週労働時間から社会保険加入対象かを判定します"
		>
			<div className="space-y-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label htmlFor="jikyu" className="block text-sm font-medium mb-1">
							時給（円）
						</label>
						<input
							id="jikyu"
							type="number"
							value={jikyu}
							onChange={(e) => setJikyu(e.target.value)}
							placeholder="例: 1100"
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>
					<div>
						<label htmlFor="weeks" className="block text-sm font-medium mb-1">
							週の労働時間（時間）
						</label>
						<input
							id="weeks"
							type="number"
							value={weeks}
							onChange={(e) => setWeeks(e.target.value)}
							placeholder="例: 20"
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>
				</div>

				<button
					type="button"
					onClick={calculate}
					className="w-full bg-primary text-primary-foreground py-2 px-4 rounded font-medium hover:opacity-90 transition-colors"
				>
					判定する
				</button>

				{result && (
					<div className="space-y-4">
						<div
							className={`p-4 rounded-lg border-2 text-center ${
								result.taisho
									? "border-orange-400 bg-orange-50"
									: "border-green-400 bg-green-50"
							}`}
						>
							<p className="text-sm font-medium mb-1">社会保険加入判定</p>
							<p
								className={`text-3xl font-bold ${
									result.taisho ? "text-orange-600" : "text-green-600"
								}`}
							>
								{result.taisho ? "加入対象" : "加入対象外"}
							</p>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div className="bg-secondary rounded-lg p-4">
								<p className="text-xs text-muted-foreground mb-1">
									年収（概算）
								</p>
								<p className="text-xl font-bold">
									{result.nennshu.toLocaleString()}円
								</p>
							</div>
							<div className="bg-secondary rounded-lg p-4">
								<p className="text-xs text-muted-foreground mb-1">
									月収（概算）
								</p>
								<p className="text-xl font-bold">
									{Math.round(result.gesshu).toLocaleString()}円
								</p>
							</div>
							{result.taisho && (
								<>
									<div className="bg-secondary rounded-lg p-4">
										<p className="text-xs text-muted-foreground mb-1">
											社保料概算（年額・本人負担）
										</p>
										<p className="text-xl font-bold text-orange-600">
											{Math.round(result.shakaiHoken).toLocaleString()}円
										</p>
									</div>
									<div className="bg-secondary rounded-lg p-4">
										<p className="text-xs text-muted-foreground mb-1">
											手取り変化（社保加入による差額）
										</p>
										<p className="text-xl font-bold text-primary">
											{Math.round(result.tedoriDiff).toLocaleString()}円
										</p>
									</div>
								</>
							)}
						</div>
					</div>
				)}

				<div className="mt-8 space-y-3 text-sm text-muted-foreground">
					<h2 className="text-base font-semibold text-foreground">
						106万の壁とは
					</h2>
					<p>
						「106万の壁」とは、パート・アルバイトが社会保険（健康保険・厚生年金）に加入しなければならなくなる収入ラインのことです。
					</p>
					<p>
						以下の条件をすべて満たす場合、社会保険への加入が義務付けられます。
					</p>
					<ul className="list-disc list-inside space-y-1">
						<li>
							月額賃金が{" "}
							<strong className="text-foreground">88,000円以上</strong>
							（年収換算で約106万円）
						</li>
						<li>
							週所定労働時間が{" "}
							<strong className="text-foreground">20時間以上</strong>
						</li>
						<li>雇用期間が2ヶ月超の見込み</li>
						<li>学生でないこと</li>
						<li>従業員数51人以上の企業（2024年10月以降）</li>
					</ul>
					<h3 className="font-semibold text-foreground mt-3">計算式</h3>
					<ul className="list-disc list-inside space-y-1">
						<li>年収 ＝ 時給 × 週労働時間 × 52週</li>
						<li>月収 ＝ 年収 ÷ 12</li>
						<li>社保料概算 ＝ 年収 × 15%</li>
					</ul>
				</div>
			</div>
		</ToolLayout>
	);
}
