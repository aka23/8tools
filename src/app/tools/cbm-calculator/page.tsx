"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";

export default function CbmCalculatorPage() {
	const [length, setLength] = useState("");
	const [width, setWidth] = useState("");
	const [height, setHeight] = useState("");
	const [quantity, setQuantity] = useState("1");
	const [result, setResult] = useState<{
		cbm: number;
		sai: number;
		airWeight: number;
		seaWeight: number;
		truckWeight: number;
	} | null>(null);

	function calculate() {
		const l = parseFloat(length);
		const w = parseFloat(width);
		const h = parseFloat(height);
		const q = parseFloat(quantity) || 1;
		if (!l || !w || !h || l <= 0 || w <= 0 || h <= 0) return;

		const cbm = (l / 100) * (w / 100) * (h / 100) * q;
		const sai = cbm / 0.028317;
		const airWeight = ((l * w * h) / 6000) * q;
		const seaWeight = cbm * 1000;
		const truckWeight = ((l * w * h) / 5000) * q;

		setResult({ cbm, sai, airWeight, seaWeight, truckWeight });
	}

	return (
		<ToolLayout
			title="CBM計算ツール"
			description="荷物の寸法からCBM・才換算・容積重量を計算します"
		>
			<div className="space-y-6">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="length">
							縦（cm）
						</label>
						<input
							id="length"
							type="number"
							min="0"
							value={length}
							onChange={(e) => setLength(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="例: 50"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="width">
							横（cm）
						</label>
						<input
							id="width"
							type="number"
							min="0"
							value={width}
							onChange={(e) => setWidth(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="例: 40"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="height">
							高さ（cm）
						</label>
						<input
							id="height"
							type="number"
							min="0"
							value={height}
							onChange={(e) => setHeight(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="例: 30"
						/>
					</div>
					<div>
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="quantity"
						>
							個数
						</label>
						<input
							id="quantity"
							type="number"
							min="1"
							value={quantity}
							onChange={(e) => setQuantity(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="1"
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
								CBM（立方メートル）
							</span>
							<span className="text-2xl font-bold text-primary">
								{result.cbm.toFixed(4)} m³
							</span>
						</div>
						<div className="flex justify-between items-center border-t pt-3">
							<span className="text-sm text-muted-foreground">才換算</span>
							<span className="text-2xl font-bold">
								{result.sai.toFixed(2)} 才
							</span>
						</div>
						<div className="border-t pt-3">
							<p className="text-xs font-semibold text-muted-foreground mb-2">
								容積重量
							</p>
							<div className="space-y-2">
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">
										航空（÷6000）
									</span>
									<span className="text-lg font-bold">
										{result.airWeight.toFixed(2)} kg
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">
										海上（×1000）
									</span>
									<span className="text-lg font-bold">
										{result.seaWeight.toFixed(2)} kg
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">
										トラック（÷5000）
									</span>
									<span className="text-lg font-bold">
										{result.truckWeight.toFixed(2)} kg
									</span>
								</div>
							</div>
						</div>
					</div>
				)}

				<div className="mt-8 space-y-3 text-sm text-muted-foreground">
					<h2 className="text-base font-semibold text-foreground">
						計算式について
					</h2>
					<p>
						<strong>CBM（Cubic Meter）</strong>
						は、荷物の体積を立方メートルで表した単位です。
						国際物流・海上輸送・航空輸送の運賃計算に広く使用されます。
					</p>
					<p>
						<strong>CBM</strong> = 縦(m) × 横(m) × 高さ(m) × 個数
					</p>
					<p>
						<strong>才換算</strong>：日本の国内輸送で使われる体積単位。1才 =
						約0.028317 m³（1辺1尺の立方体）
					</p>
					<p>
						<strong>容積重量</strong>
						は実重量と比較して大きい方が運賃計算の基準となります。
					</p>
					<ul className="list-disc list-inside space-y-1 ml-2">
						<li>航空便：縦×横×高さ（cm³）÷ 6,000 = kg</li>
						<li>海上便：CBM × 1,000 = kg</li>
						<li>トラック便：縦×横×高さ（cm³）÷ 5,000 = kg</li>
					</ul>
				</div>
			</div>
		</ToolLayout>
	);
}
