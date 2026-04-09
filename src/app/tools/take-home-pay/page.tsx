"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ArticleSection } from "@/components/tools/ArticleSection";
import { FaqAccordion } from "@/components/tools/FaqAccordion";
import { RelatedTools } from "@/components/tools/RelatedTools";

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

				<ArticleSection id="intro" title="こんなときに便利です">
					<p className="leading-relaxed">
						「額面30万円なのに手取りは24万円…なぜこんなに引かれるの？」そんな疑問を持ったことはありませんか。
						社会保険料率は毎年更新され、賞与月と通常月で手取りが変わります。扶養家族の有無でも大きく変動します。
					</p>
					<p className="leading-relaxed">
						額面月収または年収を入力するだけで、健康保険・厚生年金・雇用保険・所得税・住民税の内訳つきで手取り額がわかります。
					</p>
				</ArticleSection>

				<ArticleSection id="how-to-use" title="使い方（4ステップ）">
					<ol className="list-decimal list-inside space-y-2 leading-relaxed">
						<li>「月収で入力」か「年収で入力」を選択</li>
						<li>額面金額を入力（例：月収300,000円）</li>
						<li>年齢・扶養人数・都道府県を入力</li>
						<li>「計算する」ボタンを押す → 手取り月収・年収と控除内訳が表示されます</li>
					</ol>
					<div className="bg-secondary/50 border border-border rounded-lg p-4 mt-2">
						<p className="text-xs font-medium text-foreground mb-1">入力例</p>
						<p>月収30万円・30歳・扶養0人・東京都 → 手取り月収約24万円（健保15,000円・年金27,450円・雇保1,800円・所得税7,500円・住民税15,000円）</p>
					</div>
				</ArticleSection>

				<ArticleSection id="background" title="手取り額が決まる仕組み">
					<p className="leading-relaxed">
						給与から引かれるものは大きく「社会保険料」と「税金」の2種類です。社会保険料（健康保険・厚生年金・雇用保険）が先に引かれ、その合計額が所得税・住民税の計算にも影響します。
					</p>
					<p className="font-medium text-foreground mt-2">2025年度の主な保険料率（本人負担分）</p>
					<ul className="list-disc list-inside space-y-1">
						<li>健康保険：月収 × 5.0%（協会けんぽ概算）</li>
						<li>厚生年金：月収 × 9.15%</li>
						<li>雇用保険：月収 × 0.6%（一般の事業）</li>
						<li>所得税：課税所得に対して5%〜45%の超過累進課税（復興特別所得税2.1%を加算）</li>
						<li>住民税：課税所得 × 10%（概算）</li>
					</ul>
					<div className="border-l-4 border-primary bg-secondary/50 p-4 rounded-r-lg mt-4">
						<p className="text-sm font-medium text-foreground mb-1">注意ポイント：住民税の罠</p>
						<p>住民税は「前年の所得」に基づいて課税されます。転職1年目は前職の高い年収をもとに住民税が計算されるため、年収が下がっても住民税だけ高いまま、という現象が起きます。</p>
					</div>
				</ArticleSection>

				<ArticleSection id="use-cases" title="こんなケースで使われています">
					<div className="space-y-4">
						<div>
							<p className="font-medium text-foreground">転職検討者の比較シミュレーション</p>
							<p className="mt-1 leading-relaxed">
								額面年収500万のオファーが来たとき、現職の額面400万と手取りで比較。
								年収アップ分のうち社保・税金でどれだけ引かれるかを確認してから判断できます。
							</p>
						</div>
						<div>
							<p className="font-medium text-foreground">配偶者の扶養調整</p>
							<p className="mt-1 leading-relaxed">
								配偶者が扶養に入る・外れる場合の手取り差額をシミュレーション。
								扶養控除38万円の有無で所得税・住民税がどう変わるかを確認できます。
							</p>
						</div>
						<div>
							<p className="font-medium text-foreground">副業収入の手取り確認</p>
							<p className="mt-1 leading-relaxed">
								本業月収25万 + 副業月収5万の場合、実際の手取りがどう変化するかを把握。
								副業収入が20万円を超えると確定申告が必要になる点も合わせて覚えておきましょう。
							</p>
						</div>
					</div>
				</ArticleSection>

				<ArticleSection id="faq" title="よくある質問">
					<FaqAccordion items={[
						{
							question: "手取りは額面の何割くらいですか？",
							answer: "一般的に75〜85%程度です。年収200〜400万円台は約80〜85%、年収600万円超になると累進課税の影響で75〜78%程度になります。"
						},
						{
							question: "ボーナスの手取りはどう計算しますか？",
							answer: "ボーナスからも社会保険料と所得税が引かれます。ただし住民税はボーナスから天引きされません（月次で特別徴収）。このツールは月給・年収を前提とした概算です。"
						},
						{
							question: "都道府県で手取りは変わりますか？",
							answer: "健康保険料率は都道府県によって異なります（協会けんぽの場合）。本ツールは概算のため全国共通の料率を使用しています。正確な計算は加入の健康保険組合に確認してください。"
						},
						{
							question: "年収いくらから手取りの割合が下がりますか？",
							answer: "累進課税の影響で年収600〜700万円台から所得税率が上がり始め、年収850万円超で給与所得控除の上限（195万円）に達するため手取り率が顕著に下がります。"
						},
						{
							question: "副業の収入も一緒に入れてよいですか？",
							answer: "本ツールは給与所得を前提としています。事業所得（フリーランス・副業）は計算方式が異なります。給与以外の収入がある場合は確定申告での正確な計算をお勧めします。"
						}
					]} />
				</ArticleSection>

				<ArticleSection id="related" title="関連ツール">
					<RelatedTools
						slugs={["106wall", "furusato-tax", "tax-calc"]}
						tip="ふるさと納税の控除上限額も年収から計算できます。手取りを最大化するなら併用がおすすめです。"
					/>
				</ArticleSection>

				<ArticleSection id="cta" title="最後に">
					<p className="leading-relaxed">
						手取り額は社保料率の改定や税制変更で毎年変わります。転職・扶養調整・副業開始など収入が変わるタイミングにぜひ活用してください。
						他にも業務で使える無料計算ツールを揃えています。ぜひ試してみてください。
					</p>
					<p className="text-xs text-muted-foreground mt-2">最終更新：2026年4月</p>
				</ArticleSection>
			</div>
		</ToolLayout>
	);
}
