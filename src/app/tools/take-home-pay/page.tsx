"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";

type InputMode = "monthly" | "annual";

type Result = {
	monthlyGross: number;
	annualGross: number;
	healthInsurance: number;
	pension: number;
	employmentInsurance: number;
	totalSocialInsurance: number;
	incomeTax: number;
	residentTax: number;
	monthlyIncomeTax: number;
	monthlyResidentTax: number;
	monthlyTakeHome: number;
	annualTakeHome: number;
};

function calcIncomeTax(taxableIncome: number): number {
	if (taxableIncome <= 0) return 0;
	if (taxableIncome <= 1950000) return taxableIncome * 0.05;
	if (taxableIncome <= 3300000) return taxableIncome * 0.1 - 97500;
	if (taxableIncome <= 6950000) return taxableIncome * 0.2 - 427500;
	if (taxableIncome <= 9000000) return taxableIncome * 0.23 - 636000;
	if (taxableIncome <= 18000000) return taxableIncome * 0.33 - 1536000;
	if (taxableIncome <= 40000000) return taxableIncome * 0.4 - 2796000;
	return taxableIncome * 0.45 - 4796000;
}

function calcSalaryDeduction(annualGross: number): number {
	if (annualGross <= 1625000) return 550000;
	if (annualGross <= 1800000) return Math.floor(annualGross * 0.4 - 100000);
	if (annualGross <= 3600000) return Math.floor(annualGross * 0.3 + 80000);
	if (annualGross <= 6600000) return Math.floor(annualGross * 0.2 + 440000);
	if (annualGross <= 8500000) return Math.floor(annualGross * 0.1 + 1100000);
	return 1950000;
}

const PREFECTURES = [
	"北海道",
	"青森県",
	"岩手県",
	"宮城県",
	"秋田県",
	"山形県",
	"福島県",
	"茨城県",
	"栃木県",
	"群馬県",
	"埼玉県",
	"千葉県",
	"東京都",
	"神奈川県",
	"新潟県",
	"富山県",
	"石川県",
	"福井県",
	"山梨県",
	"長野県",
	"岐阜県",
	"静岡県",
	"愛知県",
	"三重県",
	"滋賀県",
	"京都府",
	"大阪府",
	"兵庫県",
	"奈良県",
	"和歌山県",
	"鳥取県",
	"島根県",
	"岡山県",
	"広島県",
	"山口県",
	"徳島県",
	"香川県",
	"愛媛県",
	"高知県",
	"福岡県",
	"佐賀県",
	"長崎県",
	"熊本県",
	"大分県",
	"宮崎県",
	"鹿児島県",
	"沖縄県",
];

export default function TakeHomePayPage() {
	const [inputMode, setInputMode] = useState<InputMode>("monthly");
	const [monthlyInput, setMonthlyInput] = useState("");
	const [annualInput, setAnnualInput] = useState("");
	const [age, setAge] = useState("");
	const [dependents, setDependents] = useState("0");
	const [prefecture, setPrefecture] = useState("東京都");
	const [result, setResult] = useState<Result | null>(null);

	function calculate() {
		const monthlyGross =
			inputMode === "monthly" ? Number(monthlyInput) : Number(annualInput) / 12;

		if (Number.isNaN(monthlyGross) || monthlyGross <= 0) return;

		const annualGross = monthlyGross * 12;

		const healthInsurance = Math.floor(monthlyGross * 0.05);
		const pension = Math.floor(monthlyGross * 0.0915);
		const employmentInsurance = Math.floor(monthlyGross * 0.006);
		const totalSocialInsurance =
			healthInsurance + pension + employmentInsurance;
		const annualSocialInsurance = totalSocialInsurance * 12;

		const salaryDeduction = calcSalaryDeduction(annualGross);
		const basicDeduction = 480000;
		const dependentDeduction = Number(dependents) * 380000;

		const taxableIncome = Math.max(
			0,
			annualGross -
				salaryDeduction -
				annualSocialInsurance -
				basicDeduction -
				dependentDeduction,
		);

		const annualIncomeTax = Math.floor(calcIncomeTax(taxableIncome) * 1.021); // 復興特別所得税
		const annualResidentTax = Math.floor(taxableIncome * 0.1);

		const monthlyIncomeTax = Math.floor(annualIncomeTax / 12);
		const monthlyResidentTax = Math.floor(annualResidentTax / 12);

		const monthlyTakeHome =
			monthlyGross -
			totalSocialInsurance -
			monthlyIncomeTax -
			monthlyResidentTax;
		const annualTakeHome = monthlyTakeHome * 12;

		setResult({
			monthlyGross: Math.floor(monthlyGross),
			annualGross: Math.floor(annualGross),
			healthInsurance,
			pension,
			employmentInsurance,
			totalSocialInsurance,
			incomeTax: annualIncomeTax,
			residentTax: annualResidentTax,
			monthlyIncomeTax,
			monthlyResidentTax,
			monthlyTakeHome: Math.floor(monthlyTakeHome),
			annualTakeHome: Math.floor(annualTakeHome),
		});
	}

	return (
		<ToolLayout
			title="手取り計算シミュレーター"
			description="額面給与から手取り額・控除内訳を計算します"
		>
			<div className="space-y-6">
				{/* 入力モード切替 */}
				<div>
					<p className="text-sm font-medium mb-2">入力方式</p>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={() => setInputMode("monthly")}
							className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
								inputMode === "monthly"
									? "bg-primary text-primary-foreground"
									: "bg-secondary text-foreground"
							}`}
						>
							月収で入力
						</button>
						<button
							type="button"
							onClick={() => setInputMode("annual")}
							className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
								inputMode === "annual"
									? "bg-primary text-primary-foreground"
									: "bg-secondary text-foreground"
							}`}
						>
							年収で入力
						</button>
					</div>
				</div>

				<div className="space-y-4">
					{inputMode === "monthly" ? (
						<div>
							<label
								className="block text-sm font-medium mb-1"
								htmlFor="monthlyInput"
							>
								額面月収（円）
							</label>
							<input
								id="monthlyInput"
								type="number"
								min="0"
								value={monthlyInput}
								onChange={(e) => setMonthlyInput(e.target.value)}
								className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
								placeholder="例: 300000"
							/>
						</div>
					) : (
						<div>
							<label
								className="block text-sm font-medium mb-1"
								htmlFor="annualInput"
							>
								額面年収（円）
							</label>
							<input
								id="annualInput"
								type="number"
								min="0"
								value={annualInput}
								onChange={(e) => setAnnualInput(e.target.value)}
								className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
								placeholder="例: 4000000"
							/>
						</div>
					)}

					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="age">
							年齢
						</label>
						<input
							id="age"
							type="number"
							min="18"
							max="100"
							value={age}
							onChange={(e) => setAge(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="例: 30"
						/>
					</div>

					<div>
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="dependents"
						>
							扶養人数
						</label>
						<input
							id="dependents"
							type="number"
							min="0"
							value={dependents}
							onChange={(e) => setDependents(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>

					<div>
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="prefecture"
						>
							都道府県
						</label>
						<select
							id="prefecture"
							value={prefecture}
							onChange={(e) => setPrefecture(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
						>
							{PREFECTURES.map((pref) => (
								<option key={pref} value={pref}>
									{pref}
								</option>
							))}
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
						<div className="border border-border rounded p-4 bg-secondary space-y-3">
							<div className="flex justify-between items-center">
								<span className="text-sm text-muted-foreground">
									手取り月収
								</span>
								<span className="text-3xl font-bold text-primary">
									{result.monthlyTakeHome.toLocaleString()}円
								</span>
							</div>
							<div className="flex justify-between items-center border-t border-border pt-3">
								<span className="text-sm text-muted-foreground">
									手取り年収
								</span>
								<span className="text-2xl font-bold">
									{result.annualTakeHome.toLocaleString()}円
								</span>
							</div>
						</div>

						<div className="border border-border rounded p-4 space-y-2">
							<p className="text-sm font-semibold text-foreground mb-3">
								月額控除内訳
							</p>
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">額面月収</span>
								<span>{result.monthlyGross.toLocaleString()}円</span>
							</div>
							<div className="flex justify-between text-sm border-t border-border pt-2">
								<span className="text-muted-foreground">
									健康保険料（概算）
								</span>
								<span>−{result.healthInsurance.toLocaleString()}円</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">厚生年金保険料</span>
								<span>−{result.pension.toLocaleString()}円</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">雇用保険料</span>
								<span>−{result.employmentInsurance.toLocaleString()}円</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">所得税（月額）</span>
								<span>−{result.monthlyIncomeTax.toLocaleString()}円</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">住民税（月額）</span>
								<span>−{result.monthlyResidentTax.toLocaleString()}円</span>
							</div>
							<div className="flex justify-between text-sm font-semibold border-t border-border pt-2">
								<span>手取り月収</span>
								<span>{result.monthlyTakeHome.toLocaleString()}円</span>
							</div>
						</div>

						<p className="text-xs text-muted-foreground border border-border rounded p-3 bg-secondary">
							※
							2025年度の保険料率に基づく概算値です。実際の手取り額は加入している健康保険組合・勤務地・その他控除によって異なります。
						</p>

						<p className="text-xs text-muted-foreground">
							⚠️ 概算値です。正確な手取り額は給与明細や税理士にご確認ください。
						</p>
					</div>
				)}

				<div className="mt-8 space-y-3 text-sm text-muted-foreground">
					<h2 className="text-base font-semibold text-foreground">
						計算式について
					</h2>
					<p>
						<strong>健康保険料</strong>：月収 ×
						5.0%（本人負担分の概算。実際は標準報酬月額・組合により異なる）
					</p>
					<p>
						<strong>厚生年金保険料</strong>：月収 ×
						9.15%（本人負担分。2025年度）
					</p>
					<p>
						<strong>雇用保険料</strong>：月収 ×
						0.6%（一般の事業・本人負担分。2025年度）
					</p>
					<p>
						<strong>給与所得控除</strong>
						：年収に応じて55万円〜195万円の控除（2020年度改正後）
					</p>
					<p>
						<strong>基礎控除</strong>：48万円（2020年度改正後）
					</p>
					<p>
						<strong>扶養控除</strong>：38万円 × 扶養人数（一般扶養控除）
					</p>
					<p>
						<strong>所得税</strong>
						：課税所得に対して5%〜45%の超過累進課税（復興特別所得税2.1%を加算）
					</p>
					<p>
						<strong>住民税</strong>：課税所得 × 10%（概算。均等割は含まず）
					</p>
					<p>
						<strong>課税所得</strong> = 年収 − 給与所得控除 − 社会保険料合計 −
						基礎控除 − 扶養控除
					</p>
				</div>
			</div>
		</ToolLayout>
	);
}
