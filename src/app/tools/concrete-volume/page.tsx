"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";

export default function ConcreteVolumePage() {
	const [area, setArea] = useState("");
	const [thickness, setThickness] = useState("");
	const [result, setResult] = useState<{
		required: number;
		withMargin: number;
		trucks: number;
	} | null>(null);

	function calculate() {
		const a = parseFloat(area);
		const t = parseFloat(thickness);
		if (!a || !t || a <= 0 || t <= 0) return;

		const required = a * (t / 100);
		const withMargin = required * 1.1;
		const trucks = Math.ceil(withMargin / 4.25);

		setResult({ required, withMargin, trucks });
	}

	return (
		<ToolLayout
			title="コンクリート打設量計算ツール"
			description="面積と厚みから必要コンクリート量・ミキサー車台数を計算します"
		>
			<div className="space-y-6">
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="area">
							面積（㎡）
						</label>
						<input
							id="area"
							type="number"
							min="0"
							step="0.1"
							value={area}
							onChange={(e) => setArea(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="例: 50"
						/>
					</div>
					<div>
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="thickness"
						>
							厚み（cm）
						</label>
						<input
							id="thickness"
							type="number"
							min="0"
							step="0.5"
							value={thickness}
							onChange={(e) => setThickness(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="例: 15"
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
							<span className="text-sm text-muted-foreground">
								必要コンクリート量
							</span>
							<span className="text-2xl font-bold">
								{result.required.toFixed(2)} m³
							</span>
						</div>
						<div className="flex justify-between items-center border-t pt-3">
							<span className="text-sm text-muted-foreground">
								余裕量込み（+10%）
							</span>
							<span className="text-2xl font-bold">
								{result.withMargin.toFixed(2)} m³
							</span>
						</div>
						<div className="flex justify-between items-center border-t pt-3">
							<span className="text-sm text-muted-foreground">
								必要ミキサー車台数
							</span>
							<span className="text-2xl font-bold text-primary">
								{result.trucks} 台
							</span>
						</div>
					</div>
				)}

				<div className="mt-8 space-y-3 text-sm text-muted-foreground">
					<h2 className="text-base font-semibold text-foreground">
						計算式について
					</h2>
					<p>
						コンクリートの打設量は面積と厚みから計算します。
						実際の施工では廃棄・充填の誤差を考慮して余裕分を加算するのが一般的です。
					</p>
					<p>
						<strong>必要コンクリート量（m³）</strong> = 面積（㎡）× 厚み（m）
					</p>
					<p>
						<strong>余裕量込み</strong> = 必要量 × 1.1（10%増し）
					</p>
					<p>
						<strong>ミキサー車台数</strong>は1台あたりの積載量
						<strong>4.25 m³</strong>で計算しています。
						ミキサー車（アジテータ車）の標準積載量は4〜5 m³が一般的で、4.25
						m³は国内でよく使われる基準値です。
					</p>
					<p>
						<strong>台数</strong> = 余裕量 ÷ 4.25（端数切り上げ）
					</p>
					<p>
						実際の発注時には配合設計・スランプ値・ポンプ車の有無なども考慮してください。
					</p>
				</div>
			</div>
		</ToolLayout>
	);
}
