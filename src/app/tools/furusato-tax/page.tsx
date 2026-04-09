"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";

type SpouseType = "なし" | "対象" | "対象外";
type MortgageType = "なし" | "あり";

function getSalaryDeduction(income: number): number {
	if (income <= 162.5) return 55;
	if (income <= 180) return income * 0.4 - 10;
	if (income <= 360) return income * 0.3 + 8;
	if (income <= 660) return income * 0.2 + 44;
	if (income <= 850) return income * 0.1 + 110;
	return 195;
}

function getIncomeTaxRate(taxableIncome: number): number {
	if (taxableIncome <= 195) return 0.05;
	if (taxableIncome <= 330) return 0.1;
	if (taxableIncome <= 695) return 0.2;
	if (taxableIncome <= 900) return 0.23;
	if (taxableIncome <= 1800) return 0.33;
	if (taxableIncome <= 4000) return 0.4;
	return 0.45;
}

export default function FurusatoTaxPage() {
	const [income, setIncome] = useState("");
	const [spouse, setSpouse] = useState<SpouseType>("なし");
	const [dependents, setDependents] = useState("0");
	const [socialInsurance, setSocialInsurance] = useState("");
	const [mortgage, setMortgage] = useState<MortgageType>("なし");
	const [result, setResult] = useState<{
		limit: number;
		selfBurden: number;
		taxableIncome: number;
		residentTax: number;
	} | null>(null);

	function calculate() {
		const incomeVal = Number(income);
		if (Number.isNaN(incomeVal) || incomeVal <= 0) return;

		const salaryDeduction = getSalaryDeduction(incomeVal);
		const socialInsuranceVal =
			socialInsurance === "" || Number.isNaN(Number(socialInsurance))
				? incomeVal * 0.15
				: Number(socialInsurance);
		const spouseDeduction = spouse === "対象" ? 38 : 0;
		const dependentDeduction = Number(dependents) * 38;

		const taxableIncome =
			incomeVal -
			salaryDeduction -
			socialInsuranceVal -
			48 -
			spouseDeduction -
			dependentDeduction;

		const taxableIncomeActual = Math.max(0, taxableIncome);
		const residentTax = taxableIncomeActual * 0.1;
		const incomeTaxRate = getIncomeTaxRate(taxableIncomeActual);

		const denominator = 1 - incomeTaxRate * 1.021 - 0.1;
		let limit = denominator > 0 ? (residentTax * 0.2) / denominator + 0.2 : 0;

		if (mortgage === "あり") {
			limit = Math.max(0, limit - 13);
		}

		limit = Math.floor(limit);
		const selfBurden = limit;
		const deductionAmount = Math.max(0, limit - 0.2);

		setResult({
			limit: deductionAmount,
			selfBurden,
			taxableIncome: taxableIncomeActual,
			residentTax,
		});
	}

	return (
		<ToolLayout
			title="ふるさと納税控除額シミュレーター"
			description="年収・家族構成からふるさと納税の控除上限額を計算します"
		>
			<div className="space-y-6">
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="income">
							年収（万円）
						</label>
						<input
							id="income"
							type="number"
							min="0"
							value={income}
							onChange={(e) => setIncome(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="例: 500"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="spouse">
							配偶者の有無
						</label>
						<select
							id="spouse"
							value={spouse}
							onChange={(e) => setSpouse(e.target.value as SpouseType)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
						>
							<option value="なし">なし</option>
							<option value="対象">あり（配偶者控除対象）</option>
							<option value="対象外">あり（配偶者控除対象外）</option>
						</select>
					</div>

					<div>
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="dependents"
						>
							扶養人数（人）
						</label>
						<input
							id="dependents"
							type="number"
							min="0"
							max="5"
							value={dependents}
							onChange={(e) => setDependents(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>

					<div>
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="socialInsurance"
						>
							社会保険料（万円）
						</label>
						<input
							id="socialInsurance"
							type="number"
							min="0"
							value={socialInsurance}
							onChange={(e) => setSocialInsurance(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="空欄の場合は年収×15%で自動計算"
						/>
					</div>

					<div>
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="mortgage"
						>
							住宅ローン控除
						</label>
						<select
							id="mortgage"
							value={mortgage}
							onChange={(e) => setMortgage(e.target.value as MortgageType)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
						>
							<option value="なし">なし</option>
							<option value="あり">あり</option>
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
							<span className="text-sm text-muted-foreground">
								控除上限額（目安）
							</span>
							<span className="text-2xl font-bold text-primary">
								{result.limit.toLocaleString()}万円
							</span>
						</div>
						<div className="flex justify-between items-center border-t pt-3">
							<span className="text-sm text-muted-foreground">
								自己負担2,000円で済む寄付上限額
							</span>
							<span className="text-2xl font-bold">
								{result.selfBurden.toLocaleString()}万円
							</span>
						</div>
						<div className="flex justify-between items-center border-t pt-3">
							<span className="text-sm text-muted-foreground">課税所得</span>
							<span className="text-lg font-semibold">
								{result.taxableIncome.toLocaleString()}万円
							</span>
						</div>
						<div className="flex justify-between items-center border-t pt-3">
							<span className="text-sm text-muted-foreground">
								住民税所得割額
							</span>
							<span className="text-lg font-semibold">
								{result.residentTax.toLocaleString()}万円
							</span>
						</div>
						<p className="text-xs text-muted-foreground border-t pt-3">
							※ 目安です。詳細は税理士・自治体にご確認ください
						</p>
					</div>
				)}

				<div className="mt-8 space-y-3 text-sm text-muted-foreground">
					<h2 className="text-base font-semibold text-foreground">
						計算式について
					</h2>
					<p>
						ふるさと納税の控除上限額は、<strong>住民税所得割額の20%</strong>
						をベースに計算されます。
					</p>
					<p>
						<strong>住民税所得割額</strong> = 課税所得 × 10%
					</p>
					<p>
						<strong>控除上限額</strong> = 住民税所得割額 × 20% ÷ （100% −
						所得税率 × 1.021 − 10%） + 2,000円
					</p>
					<p>
						<strong>課税所得</strong> = 年収 − 給与所得控除 − 社会保険料 −
						基礎控除（48万円） − 配偶者控除（38万円） − 扶養控除（38万円×人数）
					</p>
					<p>
						住宅ローン控除がある場合、所得税が控除されるため、ふるさと納税の上限額が減少します。
					</p>
					<p>
						※
						本ツールは概算計算です。実際の控除額は個人の税務状況によって異なります。
					</p>
				</div>
			</div>
		</ToolLayout>
	);
}
