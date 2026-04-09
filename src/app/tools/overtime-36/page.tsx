"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ArticleSection } from "@/components/tools/ArticleSection";
import { FaqAccordion } from "@/components/tools/FaqAccordion";
import { RelatedTools } from "@/components/tools/RelatedTools";

const MONTH_LIMIT = 45;
const ANNUAL_LIMIT = 360;

const MONTH_LABELS = [
	"1月",
	"2月",
	"3月",
	"4月",
	"5月",
	"6月",
	"7月",
	"8月",
	"9月",
	"10月",
	"11月",
	"12月",
];

export default function Overtime36Page() {
	const [hours, setHours] = useState<string[]>(Array(12).fill(""));
	const [submitted, setSubmitted] = useState(false);

	function handleChange(index: number, value: string) {
		const next = [...hours];
		next[index] = value;
		setHours(next);
		setSubmitted(false);
	}

	function calculate() {
		setSubmitted(true);
	}

	const parsed = hours.map((h) => (h === "" ? null : parseFloat(h)));
	const annualTotal = parsed.reduce<number>((sum, v) => sum + (v ?? 0), 0);
	const annualDiff = ANNUAL_LIMIT - annualTotal;

	return (
		<ToolLayout
			title="36協定残業時間カウンター"
			description="月別残業時間から36協定の上限との差分を表示します"
		>
			<div className="space-y-6">
				<div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
					{MONTH_LABELS.map((label, i) => (
						<div key={label}>
							<label
								className="block text-xs font-medium mb-1"
								htmlFor={`month-${i}`}
							>
								{label}（時間）
							</label>
							<input
								id={`month-${i}`}
								type="number"
								min="0"
								value={hours[i]}
								onChange={(e) => handleChange(i, e.target.value)}
								className="w-full border border-border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
								placeholder="0"
							/>
						</div>
					))}
				</div>

				<button
					type="button"
					onClick={calculate}
					className="w-full bg-primary text-primary-foreground py-2 px-4 rounded font-medium hover:opacity-90 transition-colors"
				>
					集計する
				</button>

				{submitted && (
					<div className="space-y-4">
						<div className="overflow-x-auto">
							<table className="w-full text-sm border border-border rounded overflow-hidden">
								<thead>
									<tr className="bg-secondary text-left">
										<th className="px-3 py-2 font-medium">月</th>
										<th className="px-3 py-2 font-medium text-right">
											残業時間
										</th>
										<th className="px-3 py-2 font-medium text-right">
											月上限（45h）との差
										</th>
										<th className="px-3 py-2 font-medium text-center">状態</th>
									</tr>
								</thead>
								<tbody>
									{MONTH_LABELS.map((label, i) => {
										const val = parsed[i];
										const diff = val !== null ? MONTH_LIMIT - val : null;
										const exceeded = diff !== null && diff < 0;
										return (
											<tr
												key={label}
												className={`border-t border-border ${exceeded ? "bg-red-50" : ""}`}
											>
												<td className="px-3 py-2">{label}</td>
												<td className="px-3 py-2 text-right">
													{val !== null ? `${val}h` : "−"}
												</td>
												<td
													className={`px-3 py-2 text-right font-medium ${exceeded ? "text-primary" : "text-green-600"}`}
												>
													{diff !== null
														? diff >= 0
															? `+${diff}h`
															: `${diff}h`
														: "−"}
												</td>
												<td className="px-3 py-2 text-center">
													{val !== null ? (
														exceeded ? (
															<span className="text-xs text-white bg-primary px-2 py-0.5 rounded">
																超過
															</span>
														) : (
															<span className="text-xs text-white bg-green-600 px-2 py-0.5 rounded">
																範囲内
															</span>
														)
													) : null}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>

						<div className="border border-border rounded p-4 bg-secondary space-y-3">
							<div className="flex justify-between items-center">
								<span className="text-sm text-muted-foreground">
									年間残業時間合計
								</span>
								<span className="text-2xl font-bold">
									{annualTotal.toFixed(1)}h
								</span>
							</div>
							<div className="flex justify-between items-center border-t pt-3">
								<span className="text-sm text-muted-foreground">
									年間上限（360h）との差
								</span>
								<span
									className={`text-2xl font-bold ${annualDiff < 0 ? "text-primary" : "text-green-600"}`}
								>
									{annualDiff >= 0
										? `+${annualDiff.toFixed(1)}`
										: annualDiff.toFixed(1)}
									h
								</span>
							</div>
							{annualDiff < 0 && (
								<p className="text-xs text-primary font-medium border-t pt-2">
									年間上限360時間を{Math.abs(annualDiff).toFixed(1)}
									時間超過しています
								</p>
							)}
						</div>
					</div>
				)}

				<ArticleSection id="intro" title="こんなときに便利です">
					<p className="leading-relaxed">
						「毎月のExcel集計、本当に合ってますか？」月45時間・年360時間の上限を手計算で管理している管理職・人事担当者は多いですが、集計ミスや見落としが起きやすい状況です。
					</p>
					<p className="leading-relaxed">
						違反時は6ヶ月以下の懲役または30万円以下の罰金というプレッシャーも。月別の残業時間を入力するだけで、月上限・年上限との差分が一目でわかります。
					</p>
				</ArticleSection>

				<ArticleSection id="how-to-use" title="使い方（4ステップ）">
					<ol className="list-decimal list-inside space-y-2 leading-relaxed">
						<li>1月〜12月の各月の残業時間を入力（例：1月=35時間、2月=42時間…）</li>
						<li>「集計する」ボタンを押す</li>
						<li>月別表で上限45時間との差分を確認（超過月は赤背景+「超過」バッジで表示）</li>
						<li>年間合計と360時間上限との差分をサマリーで確認</li>
					</ol>
					<div className="bg-secondary/50 border border-border rounded-lg p-4 mt-2">
						<p className="text-xs font-medium text-foreground mb-1">入力例</p>
						<p>繁忙期の3月に50時間入力 → 月上限を5時間超過（赤表示）、年間累計180時間で年上限まで180時間の余裕あり</p>
					</div>
				</ArticleSection>

				<ArticleSection id="background" title="36協定の上限規制と罰則">
					<p className="leading-relaxed">
						労働基準法第36条に基づく36協定は、2019年4月に法的上限が設けられました。それ以前は「事実上青天井」だった残業時間に罰則付きの上限が適用されます。
					</p>
					<p className="font-medium text-foreground mt-2">上限の種類</p>
					<ul className="list-disc list-inside space-y-1">
						<li>原則：月45時間以内・年360時間以内</li>
						<li>特別条項あり：年720時間・単月100時間未満・2〜6ヶ月平均80時間以内</li>
						<li>違反時：6ヶ月以下の懲役または30万円以下の罰金（労基法119条）</li>
					</ul>
					<div className="border-l-4 border-primary bg-secondary/50 p-4 rounded-r-lg mt-4">
						<p className="text-sm font-medium text-foreground mb-1">注意ポイント：特別条項の「年6回」制限</p>
						<p>特別条項があっても月45時間を超えられるのは年6回まで。7回目の超過で特別条項違反になりますが、このカウントは意外と見落とされがちです。月別の超過回数を本ツールで定期チェックすることをお勧めします。</p>
					</div>
				</ArticleSection>

				<ArticleSection id="use-cases" title="こんなケースで使われています">
					<div className="space-y-4">
						<div>
							<p className="font-medium text-foreground">建設業の現場監督による月次管理</p>
							<p className="mt-1 leading-relaxed">
								繁忙期の3月・9月に残業が集中する建設現場。月ごとの推移を可視化して、閑散期に残業を抑える計画立案に活用。
								2024年4月から建設業も一般業種と同じ上限が適用されたため、より厳密な管理が必要になりました。
							</p>
						</div>
						<div>
							<p className="font-medium text-foreground">中小企業の人事担当者による早期警告</p>
							<p className="mt-1 leading-relaxed">
								10人の部署の残業時間を月次でこのツールに入力し、年間上限を超えそうな社員を早期発見。
								対策が後手に回る前に、月20〜30時間超えの時点でシフト調整や業務分散を検討できます。
							</p>
						</div>
						<div>
							<p className="font-medium text-foreground">管理職の部下残業管理</p>
							<p className="mt-1 leading-relaxed">
								管理監督者自身は36協定の適用外ですが、部下の残業管理責任があります。
								部下全員分を月1回このツールで確認することで、労基署への対応や報告書作成をスムーズに行えます。
							</p>
						</div>
					</div>
				</ArticleSection>

				<ArticleSection id="faq" title="よくある質問">
					<FaqAccordion items={[
						{
							question: "36協定の上限を超えたらどうなりますか？",
							answer: "労働基準法119条により、6ヶ月以下の懲役または30万円以下の罰金が科される可能性があります。また、労働基準監督署の是正勧告・指導の対象にもなります。"
						},
						{
							question: "特別条項があれば月45時間を超えてもいいですか？",
							answer: "超えられるのは年6回まで。かつ単月100時間未満、2〜6ヶ月の平均が80時間以内という条件もあります。年7回目の超過は特別条項があっても違反です。"
						},
						{
							question: "管理監督者は36協定の対象ですか？",
							answer: "管理監督者は36協定の適用除外ですが、深夜割増賃金（22時〜5時）は適用されます。また「名ばかり管理職」問題があり、実態が管理監督者に当たらない場合は適用対象です。"
						},
						{
							question: "休日労働は月45時間に含まれますか？",
							answer: "法定休日労働（週1日の法定休日）は月45時間・年360時間の上限には含まれません。ただし年720時間の上限と単月100時間未満の計算には含まれます。"
						},
						{
							question: "建設業・運送業の上限は違いますか？",
							answer: "2024年4月から猶予期間が終了し、建設業・運送業・医師も一般業種と同じ上限規制が適用されるようになりました。"
						},
						{
							question: "このツールに入力したデータは保存されますか？",
							answer: "ブラウザ上で計算するのみです。入力したデータはサーバーに送信されず、ページを閉じると消えます。"
						}
					]} />
				</ArticleSection>

				<ArticleSection id="related" title="関連ツール">
					<RelatedTools
						slugs={["take-home-pay", "shift-labor-cost", "man-day"]}
						tip="残業が多い月の人件費への影響は「シフト人件費計算」で確認できます。"
					/>
				</ArticleSection>

				<ArticleSection id="cta" title="最後に">
					<p className="leading-relaxed">
						36協定の管理は違反リスクを避けるだけでなく、社員の健康と働きやすさにも直結します。
						月1回の定期チェックにぜひお役立てください。
						他にも業務で使える無料計算ツールを揃えています。ぜひ試してみてください。
					</p>
					<p className="text-xs text-muted-foreground mt-2">最終更新：2026年4月</p>
				</ArticleSection>
			</div>
		</ToolLayout>
	);
}
