"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";

type Mode = "日数計算" | "N日後計算";

function countBusinessDays(start: Date, end: Date): number {
	let count = 0;
	const current = new Date(start);
	current.setHours(0, 0, 0, 0);
	const endDate = new Date(end);
	endDate.setHours(0, 0, 0, 0);
	while (current <= endDate) {
		const day = current.getDay();
		if (day !== 0 && day !== 6) count++;
		current.setDate(current.getDate() + 1);
	}
	return count;
}

function getTodayString(): string {
	const today = new Date();
	const y = today.getFullYear();
	const m = String(today.getMonth() + 1).padStart(2, "0");
	const d = String(today.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

function formatDate(date: Date): string {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}年${m}月${d}日`;
}

export default function DateCalculatorPage() {
	const [mode, setMode] = useState<Mode>("日数計算");

	// Mode 1 state
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [inclusive, setInclusive] = useState(true);

	// Mode 2 state
	const [baseDate, setBaseDate] = useState(getTodayString());
	const [nDays, setNDays] = useState("");

	const [result1, setResult1] = useState<{
		days: number;
		businessDays: number;
		weeks: number;
		remainderDays: number;
	} | null>(null);

	const [result2, setResult2] = useState<{
		targetDate: string;
	} | null>(null);

	function calculate() {
		if (mode === "日数計算") {
			if (!startDate || !endDate) return;
			const start = new Date(startDate);
			const end = new Date(endDate);
			if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return;

			const diffMs = end.getTime() - start.getTime();
			let days = Math.round(diffMs / (1000 * 60 * 60 * 24));
			if (days < 0) days = Math.abs(days);
			if (inclusive) days += 1;

			const businessDays = countBusinessDays(
				days < 0 ? end : start,
				days < 0 ? start : end,
			);
			const weeks = Math.floor(days / 7);
			const remainderDays = days % 7;

			setResult1({ days, businessDays, weeks, remainderDays });
			setResult2(null);
		} else {
			if (!baseDate || !nDays) return;
			const nVal = parseInt(nDays, 10);
			if (Number.isNaN(nVal)) return;
			const base = new Date(baseDate);
			if (Number.isNaN(base.getTime())) return;
			base.setDate(base.getDate() + nVal);
			setResult2({ targetDate: formatDate(base) });
			setResult1(null);
		}
	}

	return (
		<ToolLayout
			title="日数計算ツール"
			description="2つの日付間の日数・営業日数・週数を計算します"
		>
			<div className="space-y-6">
				<div className="flex gap-2">
					{(["日数計算", "N日後計算"] as Mode[]).map((m) => (
						<button
							key={m}
							type="button"
							onClick={() => {
								setMode(m);
								setResult1(null);
								setResult2(null);
							}}
							className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
								mode === m
									? "bg-primary text-primary-foreground"
									: "bg-secondary text-foreground"
							}`}
						>
							{m}
						</button>
					))}
				</div>

				{mode === "日数計算" && (
					<div className="space-y-4">
						<div>
							<label
								className="block text-sm font-medium mb-1"
								htmlFor="startDate"
							>
								開始日
							</label>
							<input
								id="startDate"
								type="date"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							/>
						</div>
						<div>
							<label
								className="block text-sm font-medium mb-1"
								htmlFor="endDate"
							>
								終了日
							</label>
							<input
								id="endDate"
								type="date"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							/>
						</div>
						<div className="flex items-center gap-3">
							<label className="flex items-center gap-2 cursor-pointer text-sm">
								<input
									type="checkbox"
									checked={inclusive}
									onChange={(e) => setInclusive(e.target.checked)}
									className="rounded border-border"
								/>
								両端を含む（開始日・終了日もカウント）
							</label>
						</div>
					</div>
				)}

				{mode === "N日後計算" && (
					<div className="space-y-4">
						<div>
							<label
								className="block text-sm font-medium mb-1"
								htmlFor="baseDate"
							>
								基準日
							</label>
							<input
								id="baseDate"
								type="date"
								value={baseDate}
								onChange={(e) => setBaseDate(e.target.value)}
								className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1" htmlFor="nDays">
								日数（マイナスも可）
							</label>
							<input
								id="nDays"
								type="number"
								value={nDays}
								onChange={(e) => setNDays(e.target.value)}
								className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
								placeholder="例: 30"
							/>
						</div>
					</div>
				)}

				<button
					type="button"
					onClick={calculate}
					className="w-full bg-primary text-primary-foreground py-2 px-4 rounded font-medium hover:opacity-90 transition-colors"
				>
					計算する
				</button>

				{result1 && (
					<div className="space-y-3 border border-border rounded p-4 bg-secondary">
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">日数</span>
							<span className="text-2xl font-bold text-primary">
								{result1.days.toLocaleString()}日
							</span>
						</div>
						<div className="flex justify-between items-center border-t pt-3">
							<span className="text-sm text-muted-foreground">営業日数</span>
							<span className="text-2xl font-bold">
								{result1.businessDays.toLocaleString()}日
							</span>
						</div>
						<div className="flex justify-between items-center border-t pt-3">
							<span className="text-sm text-muted-foreground">週数</span>
							<span className="text-2xl font-bold">
								{result1.weeks.toLocaleString()}週{result1.remainderDays}日
							</span>
						</div>
					</div>
				)}

				{result2 && (
					<div className="space-y-3 border border-border rounded p-4 bg-secondary">
						<div className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">結果</span>
							<span className="text-2xl font-bold text-primary">
								{result2.targetDate}
							</span>
						</div>
					</div>
				)}

				<div className="mt-8 space-y-3 text-sm text-muted-foreground">
					<h2 className="text-base font-semibold text-foreground">
						計算式について
					</h2>
					<p>
						<strong>日数計算</strong>：終了日 − 開始日の差を日数に換算します。
						「両端を含む」にチェックを入れると、開始日と終了日の両方を1日としてカウントします。
					</p>
					<p>
						<strong>営業日数</strong>
						：土曜日・日曜日を除いた日数です。祝日は考慮していません。
					</p>
					<p>
						<strong>うるう年</strong>
						：2月29日が存在する年（4の倍数、ただし100の倍数は除く、400の倍数は含む）を自動的に考慮します。
					</p>
					<p>
						<strong>N日後計算</strong>
						：基準日から指定した日数を加算または減算した日付を求めます。マイナスの日数を入力すると過去の日付を計算できます。
					</p>
				</div>
			</div>
		</ToolLayout>
	);
}
