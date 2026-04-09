"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";

export default function DisabilityEmploymentPage() {
	const [employees, setEmployees] = useState("");
	const [currentHired, setCurrentHired] = useState("0");
	const [result, setResult] = useState<{
		required: number;
		shortage: number;
		monthlyLevy: number;
		annualLevy: number;
	} | null>(null);

	function calculate() {
		const emp = parseFloat(employees);
		const hired = parseFloat(currentHired) || 0;
		if (!emp || emp <= 0) return;

		const required = Math.ceil(emp * 0.027);
		const shortage = Math.max(0, required - hired);
		const monthlyLevy = shortage * 50000;
		const annualLevy = monthlyLevy * 12;

		setResult({ required, shortage, monthlyLevy, annualLevy });
	}

	return (
		<ToolLayout
			title="障害者雇用率計算ツール"
			description="従業員数から必要な障害者雇用人数・不足人数・納付金額を計算します"
		>
			<div className="space-y-6">
				<div className="space-y-4">
					<div>
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="employees"
						>
							従業員数（人）
						</label>
						<input
							id="employees"
							type="number"
							min="0"
							value={employees}
							onChange={(e) => setEmployees(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="例: 100"
						/>
					</div>
					<div>
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="currentHired"
						>
							現在の障害者雇用数（人）
						</label>
						<input
							id="currentHired"
							type="number"
							min="0"
							value={currentHired}
							onChange={(e) => setCurrentHired(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="0"
						/>
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
							<span className="text-sm text-muted-foreground">法定雇用率</span>
							<span className="text-2xl font-bold text-primary">2.7%</span>
						</div>
						<div className="flex justify-between items-center border-t pt-3">
							<span className="text-sm text-muted-foreground">
								法定雇用必要人数
							</span>
							<span className="text-2xl font-bold">{result.required}人</span>
						</div>
						<div className="flex justify-between items-center border-t pt-3">
							<span className="text-sm text-muted-foreground">不足人数</span>
							<span
								className={`text-2xl font-bold ${result.shortage > 0 ? "text-primary" : "text-green-600"}`}
							>
								{result.shortage}人
							</span>
						</div>
						<div className="flex justify-between items-center border-t pt-3">
							<span className="text-sm text-muted-foreground">月額納付金</span>
							<span className="text-2xl font-bold">
								{result.monthlyLevy.toLocaleString()}円
							</span>
						</div>
						<div className="flex justify-between items-center border-t pt-3">
							<span className="text-sm text-muted-foreground">年額納付金</span>
							<span className="text-2xl font-bold text-primary">
								{result.annualLevy.toLocaleString()}円
							</span>
						</div>
					</div>
				)}

				<div className="mt-8 space-y-3 text-sm text-muted-foreground">
					<h2 className="text-base font-semibold text-foreground">
						計算式について
					</h2>
					<p>
						障害者雇用促進法により、常時雇用する従業員数に対して一定割合以上の障害者を雇用することが義務付けられています。
						2024年4月以降の法定雇用率は<strong>2.7%</strong>です。
					</p>
					<p>
						<strong>法定雇用必要人数</strong> = 従業員数 × 2.7%（端数切り上げ）
					</p>
					<p>
						<strong>不足人数</strong> = 法定雇用必要人数 −
						現在の障害者雇用数（0未満は0）
					</p>
					<p>
						法定雇用率を達成していない企業は、不足1人あたり月額
						<strong>50,000円</strong>
						の障害者雇用納付金を納付する必要があります（常時雇用100人超の企業が対象）。
					</p>
					<p>
						<strong>月額納付金</strong> = 不足人数 × 50,000円
					</p>
					<p>
						<strong>年額納付金</strong> = 月額納付金 × 12ヶ月
					</p>
				</div>
			</div>
		</ToolLayout>
	);
}
