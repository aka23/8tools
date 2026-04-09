"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";

type Mode = "時間計算" | "合計モード";
type Operation = "足し算" | "引き算";

interface TimeRow {
	id: number;
	hours: string;
	minutes: string;
}

function toMinutes(hours: string, minutes: string): number {
	const h = parseInt(hours || "0", 10);
	const m = parseInt(minutes || "0", 10);
	if (Number.isNaN(h) || Number.isNaN(m)) return 0;
	return h * 60 + m;
}

function formatTime(totalMinutes: number): {
	hours: number;
	minutes: number;
	decimal: number;
} {
	const abs = Math.abs(totalMinutes);
	const hours = Math.floor(abs / 60);
	const minutes = abs % 60;
	const decimal = Math.round((abs / 60) * 100) / 100;
	return { hours, minutes, decimal };
}

let nextId = 3;

export default function TimeCalculatorPage() {
	const [mode, setMode] = useState<Mode>("時間計算");

	// Mode 1 state
	const [hoursA, setHoursA] = useState("");
	const [minutesA, setMinutesA] = useState("");
	const [hoursB, setHoursB] = useState("");
	const [minutesB, setMinutesB] = useState("");
	const [operation, setOperation] = useState<Operation>("足し算");

	// Mode 2 state
	const [rows, setRows] = useState<TimeRow[]>([
		{ id: 1, hours: "", minutes: "" },
		{ id: 2, hours: "", minutes: "" },
	]);

	const [result1, setResult1] = useState<{
		totalMinutes: number;
		negative: boolean;
	} | null>(null);

	const [result2, setResult2] = useState<{
		totalMinutes: number;
	} | null>(null);

	function calculate() {
		if (mode === "時間計算") {
			const minA = toMinutes(hoursA, minutesA);
			const minB = toMinutes(hoursB, minutesB);
			const total = operation === "足し算" ? minA + minB : minA - minB;
			setResult1({ totalMinutes: Math.abs(total), negative: total < 0 });
			setResult2(null);
		} else {
			const total = rows.reduce(
				(sum, row) => sum + toMinutes(row.hours, row.minutes),
				0,
			);
			setResult2({ totalMinutes: total });
			setResult1(null);
		}
	}

	function addRow() {
		setRows((prev) => [...prev, { id: nextId++, hours: "", minutes: "" }]);
	}

	function removeRow(id: number) {
		setRows((prev) => prev.filter((r) => r.id !== id));
	}

	function updateRow(id: number, field: "hours" | "minutes", value: string) {
		setRows((prev) =>
			prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
		);
	}

	const timeInputClass =
		"w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary";

	return (
		<ToolLayout
			title="時間計算ツール"
			description="時間の足し算・引き算・合計を計算します"
		>
			<div className="space-y-6">
				<div className="flex gap-2">
					{(["時間計算", "合計モード"] as Mode[]).map((m) => (
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

				{mode === "時間計算" && (
					<div className="space-y-4">
						<div>
							<label
								htmlFor="hoursA"
								className="block text-sm font-medium mb-1"
							>
								時間A（時：分）
							</label>
							<div className="flex items-center gap-2">
								<input
									id="hoursA"
									type="number"
									min="0"
									value={hoursA}
									onChange={(e) => setHoursA(e.target.value)}
									className={timeInputClass}
									placeholder="時"
								/>
								<span className="text-sm font-medium">:</span>
								<input
									id="minutesA"
									type="number"
									min="0"
									max="59"
									value={minutesA}
									onChange={(e) => setMinutesA(e.target.value)}
									className={timeInputClass}
									placeholder="分"
								/>
							</div>
						</div>

						<div>
							<label
								className="block text-sm font-medium mb-1"
								htmlFor="operation"
							>
								演算
							</label>
							<select
								id="operation"
								value={operation}
								onChange={(e) => setOperation(e.target.value as Operation)}
								className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
							>
								<option value="足し算">足し算（＋）</option>
								<option value="引き算">引き算（－）</option>
							</select>
						</div>

						<div>
							<label
								htmlFor="hoursB"
								className="block text-sm font-medium mb-1"
							>
								時間B（時：分）
							</label>
							<div className="flex items-center gap-2">
								<input
									id="hoursB"
									type="number"
									min="0"
									value={hoursB}
									onChange={(e) => setHoursB(e.target.value)}
									className={timeInputClass}
									placeholder="時"
								/>
								<span className="text-sm font-medium">:</span>
								<input
									id="minutesB"
									type="number"
									min="0"
									max="59"
									value={minutesB}
									onChange={(e) => setMinutesB(e.target.value)}
									className={timeInputClass}
									placeholder="分"
								/>
							</div>
						</div>
					</div>
				)}

				{mode === "合計モード" && (
					<div className="space-y-3">
						{rows.map((row, index) => (
							<div key={row.id} className="flex items-center gap-2">
								<span className="text-sm text-muted-foreground w-6 shrink-0">
									{index + 1}.
								</span>
								<input
									type="number"
									min="0"
									value={row.hours}
									onChange={(e) => updateRow(row.id, "hours", e.target.value)}
									className={timeInputClass}
									placeholder="時"
								/>
								<span className="text-sm font-medium">:</span>
								<input
									type="number"
									min="0"
									max="59"
									value={row.minutes}
									onChange={(e) => updateRow(row.id, "minutes", e.target.value)}
									className={timeInputClass}
									placeholder="分"
								/>
								{rows.length > 1 && (
									<button
										type="button"
										onClick={() => removeRow(row.id)}
										className="shrink-0 text-muted-foreground hover:text-foreground text-lg leading-none px-1"
										aria-label="削除"
									>
										×
									</button>
								)}
							</div>
						))}
						<button
							type="button"
							onClick={addRow}
							className="text-sm text-primary hover:opacity-80 transition-colors"
						>
							＋ 行を追加
						</button>
					</div>
				)}

				<button
					type="button"
					onClick={calculate}
					className="w-full bg-primary text-primary-foreground py-2 px-4 rounded font-medium hover:opacity-90 transition-colors"
				>
					計算する
				</button>

				{result1 &&
					(() => {
						const { hours, minutes, decimal } = formatTime(
							result1.totalMinutes,
						);
						return (
							<div className="space-y-3 border border-border rounded p-4 bg-secondary">
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">
										計算結果
									</span>
									<span className="text-2xl font-bold text-primary">
										{result1.negative && "−"}
										{hours}時間{String(minutes).padStart(2, "0")}分
									</span>
								</div>
								<div className="flex justify-between items-center border-t pt-3">
									<span className="text-sm text-muted-foreground">
										小数表記
									</span>
									<span className="text-lg font-semibold">
										{result1.negative && "−"}
										{decimal.toLocaleString()}時間
									</span>
								</div>
							</div>
						);
					})()}

				{result2 &&
					(() => {
						const { hours, minutes, decimal } = formatTime(
							result2.totalMinutes,
						);
						return (
							<div className="space-y-3 border border-border rounded p-4 bg-secondary">
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">
										合計時間
									</span>
									<span className="text-2xl font-bold text-primary">
										{hours}時間{String(minutes).padStart(2, "0")}分
									</span>
								</div>
								<div className="flex justify-between items-center border-t pt-3">
									<span className="text-sm text-muted-foreground">
										小数表記
									</span>
									<span className="text-lg font-semibold">
										{decimal.toLocaleString()}時間
									</span>
								</div>
							</div>
						);
					})()}

				<div className="mt-8 space-y-3 text-sm text-muted-foreground">
					<h2 className="text-base font-semibold text-foreground">
						計算式について
					</h2>
					<p>
						時間は<strong>60進法</strong>
						で管理されるため、通常の四則演算とは異なる計算が必要です。
					</p>
					<p>
						<strong>60進法 → 10進法の変換</strong>：分を時間に変換するには「分 ÷
						60」を行います。例えば45分は 45 ÷ 60 = 0.75時間です。
					</p>
					<p>
						<strong>時間の足し算</strong>
						：それぞれの時間を分に換算してから合算し、結果を時間・分に戻します。
						例：2時間30分 + 1時間45分 = 150分 + 105分 = 255分 = 4時間15分
					</p>
					<p>
						<strong>時間の引き算</strong>
						：同様に分に換算して差を求めます。結果がマイナスの場合は「−」で表示されます。
					</p>
				</div>
			</div>
		</ToolLayout>
	);
}
