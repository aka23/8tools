"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";

type Tab = "a" | "b" | "c";
type Direction = "increase" | "decrease";

export default function PercentCalcPage() {
	const [activeTab, setActiveTab] = useState<Tab>("a");

	// Tab A: X の Y% はいくつ
	const [tabAX, setTabAX] = useState("");
	const [tabAY, setTabAY] = useState("");
	const [resultA, setResultA] = useState<number | null>(null);

	// Tab B: X は Y の何%
	const [tabBX, setTabBX] = useState("");
	const [tabBY, setTabBY] = useState("");
	const [resultB, setResultB] = useState<number | null>(null);

	// Tab C: X%増し/引き
	const [tabCBase, setTabCBase] = useState("");
	const [tabCPercent, setTabCPercent] = useState("");
	const [direction, setDirection] = useState<Direction>("increase");
	const [resultC, setResultC] = useState<number | null>(null);

	function calculateA() {
		const x = Number(tabAX);
		const y = Number(tabAY);
		if (Number.isNaN(x) || Number.isNaN(y) || tabAX === "" || tabAY === "")
			return;
		setResultA((x * y) / 100);
	}

	function calculateB() {
		const x = Number(tabBX);
		const y = Number(tabBY);
		if (
			Number.isNaN(x) ||
			Number.isNaN(y) ||
			tabBX === "" ||
			tabBY === "" ||
			y === 0
		)
			return;
		setResultB((x / y) * 100);
	}

	function calculateC() {
		const base = Number(tabCBase);
		const pct = Number(tabCPercent);
		if (
			Number.isNaN(base) ||
			Number.isNaN(pct) ||
			tabCBase === "" ||
			tabCPercent === ""
		)
			return;
		if (direction === "increase") {
			setResultC(base * (1 + pct / 100));
		} else {
			setResultC(base * (1 - pct / 100));
		}
	}

	const tabLabels: { key: Tab; label: string }[] = [
		{ key: "a", label: "AのB%は？" },
		{ key: "b", label: "AはBの何%？" },
		{ key: "c", label: "A%増減" },
	];

	return (
		<ToolLayout
			title="パーセント計算ツール"
			description="3つのモードでパーセントの計算ができるツール"
		>
			<div className="space-y-6">
				{/* タブ切替 */}
				<div className="flex gap-2 flex-wrap">
					{tabLabels.map(({ key, label }) => (
						<button
							key={key}
							type="button"
							onClick={() => setActiveTab(key)}
							className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
								activeTab === key
									? "bg-primary text-primary-foreground"
									: "bg-secondary text-foreground"
							}`}
						>
							{label}
						</button>
					))}
				</div>

				{/* Tab A */}
				{activeTab === "a" && (
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium mb-1" htmlFor="tabAX">
								元の数値（A）
							</label>
							<input
								id="tabAX"
								type="number"
								value={tabAX}
								onChange={(e) => setTabAX(e.target.value)}
								className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
								placeholder="例: 1000"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1" htmlFor="tabAY">
								パーセント（B%）
							</label>
							<input
								id="tabAY"
								type="number"
								value={tabAY}
								onChange={(e) => setTabAY(e.target.value)}
								className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
								placeholder="例: 15"
							/>
						</div>
						<button
							type="button"
							onClick={calculateA}
							className="w-full bg-primary text-primary-foreground py-2 px-4 rounded font-medium hover:opacity-90 transition-colors"
						>
							計算する
						</button>
						{resultA !== null && (
							<div className="border border-border rounded p-4 bg-secondary space-y-2">
								<p className="text-sm text-muted-foreground">
									{tabAX} × {tabAY}% =
								</p>
								<p className="text-3xl font-bold text-primary">
									{resultA % 1 === 0
										? resultA.toLocaleString()
										: resultA.toFixed(4).replace(/\.?0+$/, "")}
								</p>
								<p className="text-xs text-muted-foreground">
									計算式：{tabAX} × {tabAY} ÷ 100 ={" "}
									{resultA % 1 === 0
										? resultA
										: resultA.toFixed(4).replace(/\.?0+$/, "")}
								</p>
							</div>
						)}
					</div>
				)}

				{/* Tab B */}
				{activeTab === "b" && (
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium mb-1" htmlFor="tabBX">
								比べる数値（A）
							</label>
							<input
								id="tabBX"
								type="number"
								value={tabBX}
								onChange={(e) => setTabBX(e.target.value)}
								className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
								placeholder="例: 150"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1" htmlFor="tabBY">
								基準の数値（B）
							</label>
							<input
								id="tabBY"
								type="number"
								value={tabBY}
								onChange={(e) => setTabBY(e.target.value)}
								className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
								placeholder="例: 200"
							/>
						</div>
						<button
							type="button"
							onClick={calculateB}
							className="w-full bg-primary text-primary-foreground py-2 px-4 rounded font-medium hover:opacity-90 transition-colors"
						>
							計算する
						</button>
						{resultB !== null && (
							<div className="border border-border rounded p-4 bg-secondary space-y-2">
								<p className="text-sm text-muted-foreground">
									{tabBX} は {tabBY} の
								</p>
								<p className="text-3xl font-bold text-primary">
									{resultB % 1 === 0
										? resultB.toLocaleString()
										: Number(resultB.toFixed(4)).toLocaleString()}
									%
								</p>
								<p className="text-xs text-muted-foreground">
									計算式：{tabBX} ÷ {tabBY} × 100 ={" "}
									{resultB.toFixed(4).replace(/\.?0+$/, "")}%
								</p>
							</div>
						)}
					</div>
				)}

				{/* Tab C */}
				{activeTab === "c" && (
					<div className="space-y-4">
						<div>
							<label
								className="block text-sm font-medium mb-1"
								htmlFor="tabCBase"
							>
								元の数値
							</label>
							<input
								id="tabCBase"
								type="number"
								value={tabCBase}
								onChange={(e) => setTabCBase(e.target.value)}
								className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
								placeholder="例: 1000"
							/>
						</div>
						<div>
							<label
								className="block text-sm font-medium mb-1"
								htmlFor="tabCPercent"
							>
								変化率（%）
							</label>
							<input
								id="tabCPercent"
								type="number"
								min="0"
								value={tabCPercent}
								onChange={(e) => setTabCPercent(e.target.value)}
								className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
								placeholder="例: 10"
							/>
						</div>
						<div>
							<p className="text-sm font-medium mb-2">増減の方向</p>
							<div className="flex gap-2">
								<button
									type="button"
									onClick={() => setDirection("increase")}
									className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
										direction === "increase"
											? "bg-primary text-primary-foreground"
											: "bg-secondary text-foreground"
									}`}
								>
									増し（プラス）
								</button>
								<button
									type="button"
									onClick={() => setDirection("decrease")}
									className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
										direction === "decrease"
											? "bg-primary text-primary-foreground"
											: "bg-secondary text-foreground"
									}`}
								>
									引き（マイナス）
								</button>
							</div>
						</div>
						<button
							type="button"
							onClick={calculateC}
							className="w-full bg-primary text-primary-foreground py-2 px-4 rounded font-medium hover:opacity-90 transition-colors"
						>
							計算する
						</button>
						{resultC !== null && (
							<div className="border border-border rounded p-4 bg-secondary space-y-2">
								<p className="text-sm text-muted-foreground">
									{tabCBase} を {tabCPercent}%
									{direction === "increase" ? "増し" : "引き"}すると
								</p>
								<p className="text-3xl font-bold text-primary">
									{resultC % 1 === 0
										? resultC.toLocaleString()
										: Number(resultC.toFixed(4)).toLocaleString()}
								</p>
								<p className="text-xs text-muted-foreground">
									計算式：{tabCBase} × (1 {direction === "increase" ? "+" : "−"}{" "}
									{tabCPercent} ÷ 100) ={" "}
									{resultC.toFixed(4).replace(/\.?0+$/, "")}
								</p>
							</div>
						)}
					</div>
				)}

				<div className="mt-8 space-y-3 text-sm text-muted-foreground">
					<h2 className="text-base font-semibold text-foreground">
						パーセント計算の基本式
					</h2>
					<p>
						<strong>AのB%はいくつ？</strong>　A × B ÷ 100 = 答え
					</p>
					<p>例：1000の15%は？　→ 1000 × 15 ÷ 100 = 150</p>
					<p>
						<strong>AはBの何%？</strong>　A ÷ B × 100 = 答え（%）
					</p>
					<p>例：150は200の何%？　→ 150 ÷ 200 × 100 = 75%</p>
					<p>
						<strong>X%増し / X%引き</strong>
					</p>
					<p>
						X%増し：元値 × (1 + X ÷ 100)　　例：1000の10%増し = 1000 × 1.1 =
						1100
					</p>
					<p>
						X%引き：元値 × (1 − X ÷ 100)　　例：1000の10%引き = 1000 × 0.9 = 900
					</p>
				</div>
			</div>
		</ToolLayout>
	);
}
