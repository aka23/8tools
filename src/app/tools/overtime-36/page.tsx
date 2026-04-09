"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";

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

				<div className="mt-8 space-y-3 text-sm text-muted-foreground">
					<h2 className="text-base font-semibold text-foreground">
						36協定について
					</h2>
					<p>
						労働基準法第36条に基づく「時間外労働・休日労働に関する協定」（36協定）では、
						時間外労働の上限が法律で定められています。
					</p>
					<p>
						<strong>原則の上限</strong>
					</p>
					<ul className="list-disc list-inside space-y-1 ml-2">
						<li>月45時間以内</li>
						<li>年360時間以内</li>
					</ul>
					<p>
						特別条項付き36協定を締結した場合でも、年間720時間・単月100時間未満・複数月平均80時間以内という上限が適用されます（2019年4月施行）。
					</p>
					<p>
						上限を超えた場合、6ヶ月以下の懲役または30万円以下の罰金が科される可能性があります。
					</p>
				</div>
			</div>
		</ToolLayout>
	);
}
