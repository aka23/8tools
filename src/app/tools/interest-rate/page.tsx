"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";

type RepaymentMethod = "元利均等" | "元金均等";

interface MonthRow {
	month: number;
	payment: number;
	principalPart: number;
	interestPart: number;
	balance: number;
}

interface YearSummary {
	year: number;
	totalPayment: number;
	totalPrincipal: number;
	totalInterest: number;
	endBalance: number;
}

interface CalcResult {
	firstMonthPayment: number;
	totalPayment: number;
	totalInterest: number;
	schedule: MonthRow[];
	yearlySummary: YearSummary[];
}

export default function InterestRatePage() {
	const [loanAmount, setLoanAmount] = useState("");
	const [annualRate, setAnnualRate] = useState("");
	const [repayYears, setRepayYears] = useState("");
	const [method, setMethod] = useState<RepaymentMethod>("元利均等");
	const [result, setResult] = useState<CalcResult | null>(null);

	function calculate() {
		const P = Number(loanAmount) * 10000;
		const rAnnual = Number(annualRate) / 100;
		const t = Number(repayYears);

		if (Number.isNaN(P) || P <= 0) return;
		if (Number.isNaN(rAnnual) || rAnnual < 0) return;
		if (Number.isNaN(t) || t <= 0) return;

		const rm = rAnnual / 12;
		const n = t * 12;
		const schedule: MonthRow[] = [];

		if (method === "元利均等") {
			let monthlyPayment: number;
			if (rm > 0) {
				monthlyPayment = (P * rm * (1 + rm) ** n) / ((1 + rm) ** n - 1);
			} else {
				monthlyPayment = P / n;
			}

			let balance = P;
			for (let i = 1; i <= n; i++) {
				const interestPart = balance * rm;
				const principalPart = monthlyPayment - interestPart;
				balance = balance - principalPart;
				if (balance < 0) balance = 0;
				schedule.push({
					month: i,
					payment: Math.round(monthlyPayment),
					principalPart: Math.round(principalPart),
					interestPart: Math.round(interestPart),
					balance: Math.round(balance),
				});
			}

			const totalPayment = schedule.reduce((s, r) => s + r.payment, 0);
			const totalInterest = totalPayment - P;
			const yearlySummary = buildYearlySummary(schedule, t);

			setResult({
				firstMonthPayment: Math.round(monthlyPayment),
				totalPayment,
				totalInterest,
				schedule,
				yearlySummary,
			});
		} else {
			const principalPerMonth = P / n;
			let balance = P;

			for (let i = 1; i <= n; i++) {
				const interestPart = balance * rm;
				const payment = principalPerMonth + interestPart;
				balance = balance - principalPerMonth;
				if (balance < 0) balance = 0;
				schedule.push({
					month: i,
					payment: Math.round(payment),
					principalPart: Math.round(principalPerMonth),
					interestPart: Math.round(interestPart),
					balance: Math.round(balance),
				});
			}

			const totalPayment = schedule.reduce((s, r) => s + r.payment, 0);
			const totalInterest = totalPayment - P;
			const yearlySummary = buildYearlySummary(schedule, t);

			setResult({
				firstMonthPayment: schedule[0].payment,
				totalPayment,
				totalInterest,
				schedule,
				yearlySummary,
			});
		}
	}

	function buildYearlySummary(
		schedule: MonthRow[],
		totalYears: number,
	): YearSummary[] {
		const summary: YearSummary[] = [];
		for (let y = 1; y <= totalYears; y++) {
			const yearMonths = schedule.slice((y - 1) * 12, y * 12);
			const totalPayment = yearMonths.reduce((s, r) => s + r.payment, 0);
			const totalPrincipal = yearMonths.reduce(
				(s, r) => s + r.principalPart,
				0,
			);
			const totalInterest = yearMonths.reduce((s, r) => s + r.interestPart, 0);
			const endBalance = yearMonths[yearMonths.length - 1]?.balance ?? 0;
			summary.push({
				year: y,
				totalPayment,
				totalPrincipal,
				totalInterest,
				endBalance,
			});
		}
		return summary;
	}

	const first12 = result?.schedule.slice(0, 12) ?? [];

	return (
		<ToolLayout
			title="金利計算ツール"
			description="元本・金利・期間から返済額・利息総額を計算します"
		>
			<div className="space-y-6">
				<div className="space-y-4">
					<div>
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="loanAmount"
						>
							借入額（万円）
						</label>
						<input
							id="loanAmount"
							type="number"
							min="0"
							value={loanAmount}
							onChange={(e) => setLoanAmount(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="例: 3000"
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
							placeholder="例: 1.5"
						/>
					</div>

					<div>
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="repayYears"
						>
							返済期間（年）
						</label>
						<input
							id="repayYears"
							type="number"
							min="1"
							max="50"
							value={repayYears}
							onChange={(e) => setRepayYears(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="例: 35"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="method">
							返済方式
						</label>
						<select
							id="method"
							value={method}
							onChange={(e) => setMethod(e.target.value as RepaymentMethod)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
						>
							<option value="元利均等">元利均等返済</option>
							<option value="元金均等">元金均等返済</option>
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
								<span className="text-sm text-muted-foreground">
									毎月返済額{method === "元金均等" ? "（初回）" : ""}
								</span>
								<span className="text-2xl font-bold text-primary">
									{result.firstMonthPayment.toLocaleString()}円
								</span>
							</div>
							<div className="flex justify-between items-center border-t pt-3">
								<span className="text-sm text-muted-foreground">総返済額</span>
								<span className="text-2xl font-bold">
									{result.totalPayment.toLocaleString()}円
								</span>
							</div>
							<div className="flex justify-between items-center border-t pt-3">
								<span className="text-sm text-muted-foreground">利息総額</span>
								<span className="text-xl font-bold">
									{result.totalInterest.toLocaleString()}円
								</span>
							</div>
						</div>

						<div className="border border-border rounded overflow-hidden">
							<div className="px-3 py-2 bg-secondary border-b border-border">
								<span className="text-sm font-medium">
									返済スケジュール（最初の12ヶ月）
								</span>
							</div>
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<thead>
										<tr className="border-b border-border">
											<th className="text-left px-3 py-2 text-muted-foreground font-medium">
												回
											</th>
											<th className="text-right px-3 py-2 text-muted-foreground font-medium">
												返済額
											</th>
											<th className="text-right px-3 py-2 text-muted-foreground font-medium">
												元金分
											</th>
											<th className="text-right px-3 py-2 text-muted-foreground font-medium">
												利息分
											</th>
											<th className="text-right px-3 py-2 text-muted-foreground font-medium">
												残高
											</th>
										</tr>
									</thead>
									<tbody>
										{first12.map((row) => (
											<tr key={row.month} className="border-b border-border">
												<td className="px-3 py-2">{row.month}回</td>
												<td className="text-right px-3 py-2">
													{row.payment.toLocaleString()}円
												</td>
												<td className="text-right px-3 py-2">
													{row.principalPart.toLocaleString()}円
												</td>
												<td className="text-right px-3 py-2">
													{row.interestPart.toLocaleString()}円
												</td>
												<td className="text-right px-3 py-2">
													{row.balance.toLocaleString()}円
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>

						<div className="border border-border rounded overflow-hidden">
							<div className="px-3 py-2 bg-secondary border-b border-border">
								<span className="text-sm font-medium">年間サマリー</span>
							</div>
							<div className="overflow-x-auto max-h-64">
								<table className="w-full text-sm">
									<thead className="sticky top-0 bg-secondary">
										<tr className="border-b border-border">
											<th className="text-left px-3 py-2 text-muted-foreground font-medium">
												年
											</th>
											<th className="text-right px-3 py-2 text-muted-foreground font-medium">
												年間返済
											</th>
											<th className="text-right px-3 py-2 text-muted-foreground font-medium">
												うち利息
											</th>
											<th className="text-right px-3 py-2 text-muted-foreground font-medium">
												残高
											</th>
										</tr>
									</thead>
									<tbody>
										{result.yearlySummary.map((row) => (
											<tr key={row.year} className="border-b border-border">
												<td className="px-3 py-2">{row.year}年目</td>
												<td className="text-right px-3 py-2">
													{row.totalPayment.toLocaleString()}円
												</td>
												<td className="text-right px-3 py-2">
													{row.totalInterest.toLocaleString()}円
												</td>
												<td className="text-right px-3 py-2">
													{row.endBalance.toLocaleString()}円
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
						<strong>元利均等返済</strong>：毎月の返済額が一定。 毎月返済額 =
						借入額 × 月利 × (1+月利)^返済回数 ÷ ((1+月利)^返済回数 − 1)
					</p>
					<p>
						<strong>元金均等返済</strong>
						：毎月の元金返済額が一定（返済額は徐々に減少）。 毎月元金 = 借入額 ÷
						返済回数。利息分 = 残高 × 月利。
					</p>
					<p>
						元金均等返済は総返済額が少なくなりますが、返済初期の負担が大きくなります。
					</p>
					<p>
						<strong>実質年率</strong>
						：手数料・保険料等を含めた実際の年率。名目年利より高くなることがあります。
					</p>
					<p>
						※
						本ツールの計算結果は参考値です。実際の返済額は金融機関にご確認ください。
					</p>
				</div>
			</div>
		</ToolLayout>
	);
}
