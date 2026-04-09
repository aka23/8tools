"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";

type Structure = "木造" | "RC造" | "S造";

const USEFUL_LIFE: Record<Structure, number> = {
	木造: 22,
	RC造: 47,
	S造: 34,
};

export default function DepreciationPage() {
	const [completionYear, setCompletionYear] = useState("");
	const [completionMonth, setCompletionMonth] = useState("1");
	const [structure, setStructure] = useState<Structure>("木造");
	const [result, setResult] = useState<{
		age: number;
		usefulLife: number;
		remainingLife: number;
		depreciationRate: number;
	} | null>(null);

	function calculate() {
		const year = parseInt(completionYear, 10);
		const month = parseInt(completionMonth, 10);
		if (!year || year <= 0) return;

		const currentYear = 2026;
		const currentMonth = 4;

		const usefulLife = USEFUL_LIFE[structure];

		// 築年数: 竣工月が現在月より後なら1年引く（まだ満年数に達していない）
		let age = currentYear - year;
		if (month > currentMonth) {
			age -= 1;
		}
		if (age < 0) age = 0;

		let remainingLife: number;
		if (age < usefulLife) {
			remainingLife = usefulLife - age;
		} else {
			remainingLife = Math.ceil(usefulLife * 0.2);
		}

		const depreciationRate = Math.round((1 / remainingLife) * 1000) / 1000;

		setResult({ age, usefulLife, remainingLife, depreciationRate });
	}

	return (
		<ToolLayout
			title="減価償却早見ツール"
			description="竣工年月・構造から築年数・耐用年数・償却率を計算します"
		>
			<div className="space-y-6">
				<div className="space-y-4">
					<div>
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="completionYear"
						>
							竣工年（西暦）
						</label>
						<input
							id="completionYear"
							type="number"
							min="1900"
							max="2026"
							value={completionYear}
							onChange={(e) => setCompletionYear(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="例: 2005"
						/>
					</div>
					<div>
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="completionMonth"
						>
							竣工月
						</label>
						<select
							id="completionMonth"
							value={completionMonth}
							onChange={(e) => setCompletionMonth(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
						>
							{Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
								<option key={m} value={String(m)}>
									{m}月
								</option>
							))}
						</select>
					</div>
					<div>
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="structure"
						>
							構造
						</label>
						<select
							id="structure"
							value={structure}
							onChange={(e) => setStructure(e.target.value as Structure)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
						>
							<option value="木造">木造</option>
							<option value="RC造">RC造（鉄筋コンクリート造）</option>
							<option value="S造">S造（鉄骨造）</option>
						</select>
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
					<div className="space-y-3 border border-border rounded p-4 bg-secondary">
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">築年数</span>
							<span className="text-2xl font-bold">{result.age}年</span>
						</div>
						<div className="flex justify-between items-center border-t pt-3">
							<span className="text-sm text-muted-foreground">
								法定耐用年数
							</span>
							<span className="text-2xl font-bold">{result.usefulLife}年</span>
						</div>
						<div className="flex justify-between items-center border-t pt-3">
							<span className="text-sm text-muted-foreground">
								残存耐用年数
							</span>
							<span className="text-2xl font-bold text-primary">
								{result.remainingLife}年
							</span>
						</div>
						<div className="flex justify-between items-center border-t pt-3">
							<span className="text-sm text-muted-foreground">
								償却率（定額法）
							</span>
							<span className="text-2xl font-bold">
								{result.depreciationRate.toFixed(3)}
							</span>
						</div>
					</div>
				)}

				<div className="mt-8 space-y-3 text-sm text-muted-foreground">
					<h2 className="text-base font-semibold text-foreground">
						計算式について
					</h2>
					<p>
						建物の減価償却は、構造によって定められた
						<strong>法定耐用年数</strong>をもとに計算します。
					</p>
					<p>
						<strong>法定耐用年数（居住用建物の場合）</strong>
					</p>
					<ul className="list-disc list-inside space-y-1 ml-2">
						<li>木造：22年</li>
						<li>RC造（鉄筋コンクリート造）：47年</li>
						<li>S造（鉄骨造）：34年</li>
					</ul>
					<p>
						<strong>残存耐用年数</strong>の計算は以下の通りです：
					</p>
					<p>
						築年数 &lt; 法定耐用年数 の場合：残存耐用年数 = 法定耐用年数 −
						築年数
					</p>
					<p>
						築年数 ≥ 法定耐用年数 の場合：残存耐用年数 = 法定耐用年数 ×
						20%（最低2年）
					</p>
					<p>
						<strong>償却率（定額法）</strong> = 1 ÷
						残存耐用年数（小数点以下3桁）
					</p>
					<p>
						※
						本ツールは不動産取得時の減価償却費の目安を算出するものです。実際の税務申告には税理士等の専門家にご相談ください。
					</p>
				</div>
			</div>
		</ToolLayout>
	);
}
