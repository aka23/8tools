"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";

type Mode = "単品" | "複数";
type Direction = "税抜→税込" | "税込→税抜";
type TaxRateOption = "8" | "10" | "custom";

interface MultiItem {
	name: string;
	amount: string;
	taxRate: "8" | "10";
}

interface SingleResult {
	converted: number;
	taxAmount: number;
}

interface MultiItemResult {
	name: string;
	originalAmount: number;
	converted: number;
	taxAmount: number;
}

interface MultiResult {
	items: MultiItemResult[];
	totalAmount: number;
	totalTax: number;
}

export default function TaxCalcPage() {
	const [mode, setMode] = useState<Mode>("単品");

	// 単品
	const [amount, setAmount] = useState("");
	const [direction, setDirection] = useState<Direction>("税抜→税込");
	const [taxRateOption, setTaxRateOption] = useState<TaxRateOption>("10");
	const [customRate, setCustomRate] = useState("");
	const [singleResult, setSingleResult] = useState<SingleResult | null>(null);

	// 複数
	const [items, setItems] = useState<MultiItem[]>([
		{ name: "", amount: "", taxRate: "10" },
	]);
	const [multiDirection, setMultiDirection] = useState<Direction>("税抜→税込");
	const [multiResult, setMultiResult] = useState<MultiResult | null>(null);

	function getRate(): number {
		if (taxRateOption === "custom") {
			const r = Number(customRate);
			return Number.isNaN(r) ? 0 : r / 100;
		}
		return Number(taxRateOption) / 100;
	}

	function calculateSingle() {
		const val = Number(amount);
		if (Number.isNaN(val) || val < 0) return;
		const rate = getRate();

		let converted: number;
		let taxAmount: number;

		if (direction === "税抜→税込") {
			taxAmount = val * rate;
			converted = val + taxAmount;
		} else {
			converted = val / (1 + rate);
			taxAmount = val - converted;
		}

		setSingleResult({ converted, taxAmount });
	}

	function calculateMulti() {
		const resultItems: MultiItemResult[] = items
			.filter((item) => item.amount !== "")
			.map((item) => {
				const val = Number(item.amount);
				const rate = Number(item.taxRate) / 100;
				let converted: number;
				let taxAmount: number;

				if (multiDirection === "税抜→税込") {
					taxAmount = val * rate;
					converted = val + taxAmount;
				} else {
					converted = val / (1 + rate);
					taxAmount = val - converted;
				}

				return {
					name: item.name || "商品",
					originalAmount: val,
					converted,
					taxAmount,
				};
			});

		if (resultItems.length === 0) return;

		const totalAmount = resultItems.reduce((s, i) => s + i.converted, 0);
		const totalTax = resultItems.reduce((s, i) => s + i.taxAmount, 0);

		setMultiResult({ items: resultItems, totalAmount, totalTax });
	}

	function addItem() {
		setItems([...items, { name: "", amount: "", taxRate: "10" }]);
	}

	function removeItem(index: number) {
		setItems(items.filter((_, i) => i !== index));
	}

	function updateItem(index: number, field: keyof MultiItem, value: string) {
		setItems(
			items.map((item, i) =>
				i === index ? { ...item, [field]: value } : item,
			),
		);
	}

	const directionLabel = direction === "税抜→税込" ? "税込金額" : "税抜金額";
	const multiDirectionLabel =
		multiDirection === "税抜→税込" ? "税込金額" : "税抜金額";

	return (
		<ToolLayout
			title="税込・税抜計算ツール"
			description="金額の税込⇔税抜変換と消費税額を計算します"
		>
			<div className="space-y-6">
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => setMode("単品")}
						className={`px-4 py-2 rounded text-sm font-medium ${
							mode === "単品"
								? "bg-primary text-primary-foreground"
								: "bg-secondary text-foreground"
						}`}
					>
						単品計算
					</button>
					<button
						type="button"
						onClick={() => setMode("複数")}
						className={`px-4 py-2 rounded text-sm font-medium ${
							mode === "複数"
								? "bg-primary text-primary-foreground"
								: "bg-secondary text-foreground"
						}`}
					>
						複数商品計算
					</button>
				</div>

				{mode === "単品" && (
					<div className="space-y-4">
						<div>
							<label
								className="block text-sm font-medium mb-1"
								htmlFor="amount"
							>
								金額（円）
							</label>
							<input
								id="amount"
								type="number"
								min="0"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
								placeholder="例: 1000"
							/>
						</div>

						<div>
							<p className="block text-sm font-medium mb-1">変換方向</p>
							<div className="flex gap-2">
								<button
									type="button"
									onClick={() => setDirection("税抜→税込")}
									className={`px-4 py-2 rounded text-sm font-medium ${
										direction === "税抜→税込"
											? "bg-primary text-primary-foreground"
											: "bg-secondary text-foreground"
									}`}
								>
									税抜→税込
								</button>
								<button
									type="button"
									onClick={() => setDirection("税込→税抜")}
									className={`px-4 py-2 rounded text-sm font-medium ${
										direction === "税込→税抜"
											? "bg-primary text-primary-foreground"
											: "bg-secondary text-foreground"
									}`}
								>
									税込→税抜
								</button>
							</div>
						</div>

						<div>
							<label
								className="block text-sm font-medium mb-1"
								htmlFor="taxRateOption"
							>
								税率
							</label>
							<select
								id="taxRateOption"
								value={taxRateOption}
								onChange={(e) =>
									setTaxRateOption(e.target.value as TaxRateOption)
								}
								className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
							>
								<option value="8">8%（軽減税率）</option>
								<option value="10">10%（標準税率）</option>
								<option value="custom">カスタム</option>
							</select>
						</div>

						{taxRateOption === "custom" && (
							<div>
								<label
									className="block text-sm font-medium mb-1"
									htmlFor="customRate"
								>
									カスタム税率（%）
								</label>
								<input
									id="customRate"
									type="number"
									min="0"
									max="100"
									step="0.1"
									value={customRate}
									onChange={(e) => setCustomRate(e.target.value)}
									className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
									placeholder="例: 15"
								/>
							</div>
						)}

						<button
							type="button"
							onClick={calculateSingle}
							className="w-full bg-primary text-primary-foreground py-2 px-4 rounded font-medium hover:opacity-90 transition-colors"
						>
							計算する
						</button>

						{singleResult && (
							<div className="space-y-3 border border-border rounded p-4 bg-secondary">
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">
										{directionLabel}
									</span>
									<span className="text-2xl font-bold text-primary">
										{Math.round(singleResult.converted).toLocaleString()}円
									</span>
								</div>
								<div className="flex justify-between items-center border-t pt-3">
									<span className="text-sm text-muted-foreground">
										消費税額
									</span>
									<span className="text-2xl font-bold">
										{Math.round(singleResult.taxAmount).toLocaleString()}円
									</span>
								</div>
							</div>
						)}
					</div>
				)}

				{mode === "複数" && (
					<div className="space-y-4">
						<div>
							<p className="block text-sm font-medium mb-1">
								変換方向（全商品共通）
							</p>
							<div className="flex gap-2">
								<button
									type="button"
									onClick={() => setMultiDirection("税抜→税込")}
									className={`px-4 py-2 rounded text-sm font-medium ${
										multiDirection === "税抜→税込"
											? "bg-primary text-primary-foreground"
											: "bg-secondary text-foreground"
									}`}
								>
									税抜→税込
								</button>
								<button
									type="button"
									onClick={() => setMultiDirection("税込→税抜")}
									className={`px-4 py-2 rounded text-sm font-medium ${
										multiDirection === "税込→税抜"
											? "bg-primary text-primary-foreground"
											: "bg-secondary text-foreground"
									}`}
								>
									税込→税抜
								</button>
							</div>
						</div>

						<div className="space-y-3">
							{items.map((item, index) => (
								<div
									key={index}
									className="border border-border rounded p-3 space-y-2"
								>
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium">
											商品 {index + 1}
										</span>
										{items.length > 1 && (
											<button
												type="button"
												onClick={() => removeItem(index)}
												className="text-sm text-muted-foreground hover:text-foreground"
											>
												×
											</button>
										)}
									</div>
									<input
										type="text"
										value={item.name}
										onChange={(e) => updateItem(index, "name", e.target.value)}
										className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
										placeholder="商品名（任意）"
									/>
									<div className="flex gap-2">
										<input
											type="number"
											min="0"
											value={item.amount}
											onChange={(e) =>
												updateItem(index, "amount", e.target.value)
											}
											className="flex-1 border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
											placeholder="金額（円）"
										/>
										<select
											value={item.taxRate}
											onChange={(e) =>
												updateItem(
													index,
													"taxRate",
													e.target.value as "8" | "10",
												)
											}
											className="border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
										>
											<option value="8">8%</option>
											<option value="10">10%</option>
										</select>
									</div>
								</div>
							))}
						</div>

						<button
							type="button"
							onClick={addItem}
							className="w-full border border-border rounded py-2 text-sm hover:bg-secondary transition-colors"
						>
							行を追加
						</button>

						<button
							type="button"
							onClick={calculateMulti}
							className="w-full bg-primary text-primary-foreground py-2 px-4 rounded font-medium hover:opacity-90 transition-colors"
						>
							計算する
						</button>

						{multiResult && (
							<div className="space-y-3 border border-border rounded p-4 bg-secondary">
								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<thead>
											<tr className="border-b border-border">
												<th className="text-left py-2 pr-2 text-muted-foreground font-medium">
													商品名
												</th>
												<th className="text-right py-2 pr-2 text-muted-foreground font-medium">
													元金額
												</th>
												<th className="text-right py-2 pr-2 text-muted-foreground font-medium">
													消費税
												</th>
												<th className="text-right py-2 text-muted-foreground font-medium">
													{multiDirectionLabel}
												</th>
											</tr>
										</thead>
										<tbody>
											{multiResult.items.map((item, i) => (
												<tr key={i} className="border-b border-border">
													<td className="py-2 pr-2">{item.name}</td>
													<td className="text-right py-2 pr-2">
														{item.originalAmount.toLocaleString()}円
													</td>
													<td className="text-right py-2 pr-2">
														{Math.round(item.taxAmount).toLocaleString()}円
													</td>
													<td className="text-right py-2">
														{Math.round(item.converted).toLocaleString()}円
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
								<div className="flex justify-between items-center border-t pt-3">
									<span className="text-sm text-muted-foreground">
										合計消費税額
									</span>
									<span className="text-xl font-bold">
										{Math.round(multiResult.totalTax).toLocaleString()}円
									</span>
								</div>
								<div className="flex justify-between items-center border-t pt-3">
									<span className="text-sm text-muted-foreground">
										合計金額（{multiDirectionLabel}）
									</span>
									<span className="text-2xl font-bold text-primary">
										{Math.round(multiResult.totalAmount).toLocaleString()}円
									</span>
								</div>
							</div>
						)}
					</div>
				)}

				<div className="mt-8 space-y-3 text-sm text-muted-foreground">
					<h2 className="text-base font-semibold text-foreground">
						計算式について
					</h2>
					<p>
						<strong>税抜→税込</strong>：税込金額 = 税抜金額 ×（1 + 税率）
					</p>
					<p>
						<strong>税込→税抜</strong>：税抜金額 = 税込金額 ÷（1 + 税率）
					</p>
					<p>
						<strong>軽減税率8%の対象品目</strong>
						：飲食料品（酒類・外食を除く）、定期購読の新聞など。
					</p>
					<p>
						<strong>標準税率10%の対象品目</strong>
						：上記以外の一般的な商品・サービス、外食、酒類など。
					</p>
					<p>
						軽減税率は2019年10月の消費税増税時に導入されました。スーパーでの食料品購入は8%、外食は10%が適用されます。
					</p>
					<p>※ 本ツールの計算結果は参考値です。</p>
				</div>
			</div>
		</ToolLayout>
	);
}
