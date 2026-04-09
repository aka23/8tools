"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";

export default function ShiftLaborCostPage() {
	const [hourlyWage, setHourlyWage] = useState("");
	const [headcount, setHeadcount] = useState("");
	const [hoursPerDay, setHoursPerDay] = useState("");
	const [daysPerWeek, setDaysPerWeek] = useState("5");
	const [result, setResult] = useState<{
		daily: number;
		weekly: number;
		monthly: number;
	} | null>(null);

	function calculate() {
		const wage = parseFloat(hourlyWage);
		const count = parseFloat(headcount);
		const hours = parseFloat(hoursPerDay);
		const days = parseFloat(daysPerWeek);
		if (
			!wage ||
			!count ||
			!hours ||
			!days ||
			wage <= 0 ||
			count <= 0 ||
			hours <= 0 ||
			days <= 0
		)
			return;

		const daily = wage * hours * count;
		const weekly = daily * days;
		const monthly = weekly * 4.33;

		setResult({ daily, weekly, monthly });
	}

	return (
		<ToolLayout
			title="シフト人件費計算ツール"
			description="時給・人数・勤務時間から日/週/月の人件費を計算します"
		>
			<div className="space-y-6">
				<div className="space-y-4">
					<div>
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="hourlyWage"
						>
							時給（円）
						</label>
						<input
							id="hourlyWage"
							type="number"
							min="0"
							value={hourlyWage}
							onChange={(e) => setHourlyWage(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="例: 1050"
						/>
					</div>
					<div>
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="headcount"
						>
							人数（人）
						</label>
						<input
							id="headcount"
							type="number"
							min="0"
							value={headcount}
							onChange={(e) => setHeadcount(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="例: 5"
						/>
					</div>
					<div>
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="hoursPerDay"
						>
							勤務時間/日（時間）
						</label>
						<input
							id="hoursPerDay"
							type="number"
							min="0"
							step="0.5"
							value={hoursPerDay}
							onChange={(e) => setHoursPerDay(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="例: 8"
						/>
					</div>
					<div>
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="daysPerWeek"
						>
							日数/週
						</label>
						<input
							id="daysPerWeek"
							type="number"
							min="1"
							max="7"
							value={daysPerWeek}
							onChange={(e) => setDaysPerWeek(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="例: 5"
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
							<span className="text-sm text-muted-foreground">日額人件費</span>
							<span className="text-2xl font-bold">
								{Math.round(result.daily).toLocaleString()}円
							</span>
						</div>
						<div className="flex justify-between items-center border-t pt-3">
							<span className="text-sm text-muted-foreground">週額人件費</span>
							<span className="text-2xl font-bold">
								{Math.round(result.weekly).toLocaleString()}円
							</span>
						</div>
						<div className="flex justify-between items-center border-t pt-3">
							<span className="text-sm text-muted-foreground">月額人件費</span>
							<span className="text-2xl font-bold text-primary">
								{Math.round(result.monthly).toLocaleString()}円
							</span>
						</div>
					</div>
				)}

				<div className="mt-8 space-y-3 text-sm text-muted-foreground">
					<h2 className="text-base font-semibold text-foreground">
						計算式について
					</h2>
					<p>
						シフト制の人件費を日・週・月単位で概算します。月額は週額に平均週数（4.33週）を掛けた値です。
					</p>
					<p>
						<strong>日額</strong> = 時給 × 勤務時間/日 × 人数
					</p>
					<p>
						<strong>週額</strong> = 日額 × 日数/週
					</p>
					<p>
						<strong>月額</strong> = 週額 × 4.33（1ヶ月の平均週数）
					</p>
					<p>
						※
						社会保険料・交通費・深夜割増等は含まれません。実際の人件費はこれらを加算してご確認ください。
					</p>
				</div>
			</div>
		</ToolLayout>
	);
}
