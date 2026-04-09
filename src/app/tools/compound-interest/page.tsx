"use client";

import { useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { ToolLayout } from "@/components/tools/ToolLayout";

type Frequency = "月複利" | "年複利";

interface YearRow {
	year: number;
	principal: number;
	interest: number;
	total: number;
}

interface CalcResult {
	finalAmount: number;
	profit: number;
	profitRate: number;
	totalContributions: number;
	yearRows: YearRow[];
}

export default function CompoundInterestPage() {
	const [principal, setPrincipal] = useState("");
	const [annualRate, setAnnualRate] = useState("");
	const [years, setYears] = useState("");
	const [monthly, setMonthly] = useState("");
	const [frequency, setFrequency] = useState<Frequency>("年複利");
	const [result, setResult] = useState<CalcResult | null>(null);

	function calculate() {
		const P = Number(principal) * 10000;
		const r = Number(annualRate) / 100;
		const t = Number(years);
		const m = monthly === "" ? 0 : Number(monthly) * 10000;

		if (Number.isNaN(P) || P < 0) return;
		if (Number.isNaN(r) || r < 0) return;
		if (Number.isNaN(t) || t <= 0) return;

		const yearRows: YearRow[] = [];
		let totalContributions = P;

		if (frequency === "年複利") {
			for (let y = 1; y <= t; y++) {
				const annualContrib = m * 12;
				totalContributions = P + annualContrib * y;
				let A = P * (1 + r) ** y;
				if (r > 0) {
					A += m * 12 * (((1 + r) ** y - 1) / r);
				} else {
					A += m * 12 * y;
				}
				const principalCumulative = P + annualContrib * y;
				const interestCumulative = A - principalCumulative;
				yearRows.push({
					year: y,
					principal: Math.round(principalCumulative),
					interest: Math.round(interestCumulative),
					total: Math.round(A),
				});
			}
		} else {
			const mr = r / 12;
			const n = t * 12;
			for (let y = 1; y <= t; y++) {
				const months = y * 12;
				const principalCumulative = P + m * months;
				let A: number;
				if (mr > 0) {
					A = P * (1 + mr) ** months + m * (((1 + mr) ** months - 1) / mr);
				} else {
					A = P + m * months;
				}
				const interestCumulative = A - principalCumulative;
				yearRows.push({
					year: y,
					principal: Math.round(principalCumulative),
					interest: Math.round(interestCumulative),
					total: Math.round(A),
				});
			}
			totalContributions = P + m * n;
		}

		const finalRow = yearRows[yearRows.length - 1];
		const finalAmount = finalRow.total;
		const profit = finalAmount - totalContributions;
		const profitRate =
			totalContributions > 0 ? (profit / totalContributions) * 100 : 0;

		setResult({
			finalAmount,
			profit,
			profitRate,
			totalContributions,
			yearRows,
		});
	}

	const chartData = result?.yearRows.map((row) => ({
		year: `${row.year}年`,
		元本累計: Math.round(row.principal / 10000),
		利息累計: Math.round(row.interest / 10000),
	}));

	return (
		<ToolLayout
			title="複利計算シミュレーター"
			description="元本・利率・期間から複利運用の最終金額を計算します"
		>
			<div className="space-y-6">
				<div className="space-y-4">
					<div>
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="principal"
						>
							元本（万円）
						</label>
						<input
							id="principal"
							type="number"
							min="0"
							value={principal}
							onChange={(e) => setPrincipal(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="例: 100"
						/>
					</div>

					<div>
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="annualRate"
						>
							年利率（%）
						</label>
						<input
							id="annualRate"
							type="number"
							min="0"
							step="0.1"
							value={annualRate}
							onChange={(e) => setAnnualRate(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="例: 5"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="years">
							運用期間（年）
						</label>
						<input
							id="years"
							type="number"
							min="1"
							max="50"
							value={years}
							onChange={(e) => setYears(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="例: 20"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="monthly">
							毎月積立額（万円）
						</label>
						<input
							id="monthly"
							type="number"
							min="0"
							step="0.1"
							value={monthly}
							onChange={(e) => setMonthly(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="任意。例: 3"
						/>
					</div>

					<div>
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="frequency"
						>
							複利頻度
						</label>
						<select
							id="frequency"
							value={frequency}
							onChange={(e) => setFrequency(e.target.value as Frequency)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
						>
							<option value="年複利">年複利</option>
							<option value="月複利">月複利</option>
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
					<div className="space-y-4">
						<div className="space-y-3 border border-border rounded p-4 bg-secondary">
							<div className="flex justify-between items-center">
								<span className="text-sm text-muted-foreground">最終金額</span>
								<span className="text-2xl font-bold text-primary">
									{Math.round(result.finalAmount / 10000).toLocaleString()}万円
								</span>
							</div>
							<div className="flex justify-between items-center border-t pt-3">
								<span className="text-sm text-muted-foreground">利益額</span>
								<span className="text-2xl font-bold">
									{Math.round(result.profit / 10000).toLocaleString()}万円
								</span>
							</div>
							<div className="flex justify-between items-center border-t pt-3">
								<span className="text-sm text-muted-foreground">利益率</span>
								<span className="text-xl font-bold">
									{result.profitRate.toFixed(1)}%
								</span>
							</div>
							<div className="flex justify-between items-center border-t pt-3">
								<span className="text-sm text-muted-foreground">総投資額</span>
								<span className="text-lg font-semibold">
									{Math.round(
										result.totalContributions / 10000,
									).toLocaleString()}
									万円
								</span>
							</div>
						</div>

						<div className="border border-border rounded p-4">
							<h3 className="text-sm font-medium mb-3">
								資産推移グラフ（万円）
							</h3>
							<ResponsiveContainer width="100%" height={300}>
								<BarChart
									data={chartData}
									margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="year" tick={{ fontSize: 12 }} />
									<YAxis tick={{ fontSize: 12 }} />
									<Tooltip
										formatter={(value) => [
											`${Number(value).toLocaleString()}万円`,
										]}
									/>
									<Legend />
									<Bar dataKey="元本累計" stackId="a" fill="#9E9E9E" />
									<Bar dataKey="利息累計" stackId="a" fill="#D32F2F" />
								</BarChart>
							</ResponsiveContainer>
						</div>

						<div className="border border-border rounded overflow-hidden">
							<div className="overflow-x-auto max-h-64">
								<table className="w-full text-sm">
									<thead className="bg-secondary sticky top-0">
										<tr>
											<th className="text-left px-3 py-2 text-muted-foreground font-medium">
												年
											</th>
											<th className="text-right px-3 py-2 text-muted-foreground font-medium">
												元本累計
											</th>
											<th className="text-right px-3 py-2 text-muted-foreground font-medium">
												利息累計
											</th>
											<th className="text-right px-3 py-2 text-muted-foreground font-medium">
												合計
											</th>
										</tr>
									</thead>
									<tbody>
										{result.yearRows.map((row) => (
											<tr key={row.year} className="border-t border-border">
												<td className="px-3 py-2">{row.year}年目</td>
												<td className="text-right px-3 py-2">
													{Math.round(row.principal / 10000).toLocaleString()}
													万円
												</td>
												<td className="text-right px-3 py-2">
													{Math.round(row.interest / 10000).toLocaleString()}
													万円
												</td>
												<td className="text-right px-3 py-2 font-medium">
													{Math.round(row.total / 10000).toLocaleString()}万円
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				)}

				<div className="mt-8 space-y-3 text-sm text-muted-foreground">
					<h2 className="text-base font-semibold text-foreground">
						計算式について
					</h2>
					<p>
						<strong>複利計算の基本式</strong>：A = P(1 + r/n)^(nt)
					</p>
					<p>P = 元本、r = 年利率、n = 年間複利回数、t = 運用期間（年）</p>
					<p>
						<strong>単利との比較</strong>
						：単利は元本にのみ利息がつきますが、複利は利息にも利息がつくため、長期運用ほど差が大きくなります。
					</p>
					<p>
						<strong>72の法則</strong>：72 ÷ 年利率 ≒
						元本が2倍になる年数。例：年利6%なら72÷6=12年で約2倍。
					</p>
					<p>
						※
						本ツールの計算結果は参考値です。実際の運用成果を保証するものではありません。
					</p>
				</div>
			</div>
		</ToolLayout>
	);
}
