"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ArticleSection } from "@/components/tools/ArticleSection";
import { FaqAccordion } from "@/components/tools/FaqAccordion";
import { RelatedTools } from "@/components/tools/RelatedTools";

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

				<ArticleSection id="intro" title="こんなときに便利です">
					<p className="leading-relaxed">
						2026年4月から社会保険の適用拡大により、週20時間以上働くパート・アルバイトは企業規模を問わず社会保険への加入が義務付けられます。
						月1〜1.5万円の手取り減が見込まれ、パート主婦・大学生・副業サラリーマンにとって「いくら働くと損か」の判断が難しくなっています。
					</p>
					<p className="leading-relaxed">
						時給と週の労働時間を入力するだけで、加入対象かどうか・年収・社保料の概算・手取り変化額が10秒でわかります。
					</p>
				</ArticleSection>

				<ArticleSection id="how-to-use" title="使い方（3ステップ）">
					<ol className="list-decimal list-inside space-y-2 leading-relaxed">
						<li>「時給（円）」に現在の時給を入力（例：1,100円）</li>
						<li>「週の労働時間」に1週間の平均勤務時間を入力（例：20時間）</li>
						<li>「判定する」ボタンを押す → 加入対象/対象外の判定・年収概算・社保料・手取り変化額が表示されます</li>
					</ol>
					<div className="bg-secondary/50 border border-border rounded-lg p-4 mt-2">
						<p className="text-xs font-medium text-foreground mb-1">入力例</p>
						<p>時給1,100円・週20時間の場合 → 年収約114万円、社保加入対象、社保料年約17万円、手取り月約1.4万円減</p>
					</div>
				</ArticleSection>

				<ArticleSection id="background" title="106万の壁の仕組みと注意点">
					<p className="leading-relaxed">
						「106万の壁」は、パート・アルバイトが社会保険（健康保険・厚生年金）に加入しなければならなくなる収入ラインです。
						2024年10月に従業員51人以上の企業へ拡大され、2026年4月からは企業規模を問わず適用されます。
					</p>
					<p className="font-medium text-foreground mt-2">加入の5条件（すべて該当で加入対象）</p>
					<ul className="list-disc list-inside space-y-1">
						<li>月額賃金が88,000円以上（年収換算で約106万円）</li>
						<li>週所定労働時間が20時間以上</li>
						<li>雇用期間が2ヶ月超の見込み</li>
						<li>学生でないこと</li>
						<li>2026年4月以降は企業規模の条件なし</li>
					</ul>
					<div className="border-l-4 border-primary bg-secondary/50 p-4 rounded-r-lg mt-4">
						<p className="text-sm font-medium text-foreground mb-1">注意ポイント</p>
						<p>契約上は週19時間でも、実態として恒常的に週20時間を超えていれば加入対象とみなされるケースがあります。残業時間の扱いも含め、実際の勤務実態で判断されることを覚えておきましょう。</p>
					</div>
				</ArticleSection>

				<ArticleSection id="use-cases" title="こんなケースで使われています">
					<div className="space-y-4">
						<div>
							<p className="font-medium text-foreground">パート主婦の扶養調整</p>
							<p className="mt-1 leading-relaxed">
								夫の扶養内で働きたい主婦の方が、時給1,200円×週18時間で壁を回避しつつ最大限稼ぐシフト調整に活用。
								週20時間を少し下回るラインで年収を抑えることで、社保料の負担なしに手取りを最大化できます。
							</p>
						</div>
						<div>
							<p className="font-medium text-foreground">大学生アルバイトの卒業前確認</p>
							<p className="mt-1 leading-relaxed">
								学生は原則として加入対象外ですが、卒業後の4月からは即加入対象になります。
								就職前の3〜4月に時間を増やしているケースでは注意が必要です。
							</p>
						</div>
						<div>
							<p className="font-medium text-foreground">副業サラリーマンの合算確認</p>
							<p className="mt-1 leading-relaxed">
								副業先でも社保加入が発生するかを確認したい方に。社会保険の判定は基本的に事業所ごとですが、
								同一企業グループでの勤務には合算される可能性もあるため、副業先の雇用形態を確認しましょう。
							</p>
						</div>
					</div>
				</ArticleSection>

				<ArticleSection id="faq" title="よくある質問">
					<FaqAccordion items={[
						{
							question: "106万の壁は2026年にどう変わりますか？",
							answer: "2026年4月から企業規模の条件が撤廃され、週20時間以上・月収88,000円以上のパート・アルバイトはすべての企業で社会保険加入が義務化されます。これにより加入対象者が大幅に増加します。"
						},
						{
							question: "交通費は106万円の計算に含まれますか？",
							answer: "社会保険の判定では交通費は含みません。これは所得税の103万円の壁とは異なります。通勤手当は月収88,000円の計算対象外です。"
						},
						{
							question: "学生でも加入対象になりますか？",
							answer: "原則として学生は適用除外ですが、卒業見込みとなる時期（卒業月）からは学生扱いが終わります。就職前に稼ぎたい時期と重なるため注意が必要です。"
						},
						{
							question: "社保に加入すると損ですか？",
							answer: "短期的には手取りが月1〜1.5万円程度減りますが、将来の厚生年金受給額の増加・傷病手当金・出産手当金などのメリットもあります。長期的には一概に「損」とは言えません。"
						},
						{
							question: "夫の扶養から外れるとどうなりますか？",
							answer: "配偶者の会社の健康保険の被扶養者から外れ、自分で社会保険料を払う必要があります。扶養内では保険料ゼロだったのが、年間約15〜20万円の負担増になるケースが多いです。"
						}
					]} />
				</ArticleSection>

				<ArticleSection id="related" title="関連ツール">
					<RelatedTools
						slugs={["take-home-pay", "furusato-tax", "shift-labor-cost"]}
						tip="社保加入後の手取り額をさらに詳しく知りたい方は「手取り計算シミュレーター」もご活用ください。"
					/>
				</ArticleSection>

				<ArticleSection id="cta" title="最後に">
					<p className="leading-relaxed">
						106万の壁は2026年4月の制度変更でより多くの方に影響が出ます。
						シフト調整や扶養の見直しを検討する際にぜひお役立てください。
						他にも業務で使える無料計算ツールを揃えています。ぜひ試してみてください。
					</p>
					<p className="text-xs text-muted-foreground mt-2">最終更新：2026年4月</p>
				</ArticleSection>
			</div>
		</ToolLayout>
	);
}
