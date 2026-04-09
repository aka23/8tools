"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";

type Mode = "単品" | "複数";
type DiscountType = "percent" | "wari";

interface MultiItem {
	name: string;
	price: string;
	discountRate: string;
}

interface SingleResult {
	discountAmount: number;
	payAmount: number;
	taxIncluded: number;
	taxAmount: number;
}

interface MultiResult {
	items: {
		name: string;
		originalPrice: number;
		discountAmount: number;
		payAmount: number;
		taxIncluded: number;
	}[];
	totalDiscount: number;
	totalPay: number;
	totalTaxIncluded: number;
}

export default function DiscountCalcPage() {
	const [mode, setMode] = useState<Mode>("単品");

	// 単品
	const [price, setPrice] = useState("");
	const [discountType, setDiscountType] = useState<DiscountType>("percent");
	const [discountValue, setDiscountValue] = useState("");
	const [taxRate, setTaxRate] = useState("10");
	const [singleResult, setSingleResult] = useState<SingleResult | null>(null);

	// 複数
	const [items, setItems] = useState<MultiItem[]>([
		{ name: "", price: "", discountRate: "" },
	]);
	const [multiTaxRate, setMultiTaxRate] = useState("10");
	const [multiResult, setMultiResult] = useState<MultiResult | null>(null);

	function calculateSingle() {
		const priceVal = Number(price);
		const discountVal = Number(discountValue);
		const tax = Number(taxRate) / 100;
		if (Number.isNaN(priceVal) || priceVal <= 0) return;
		if (Number.isNaN(discountVal) || discountVal < 0) return;

		let discountAmount: number;
		if (discountType === "percent") {
			discountAmount = priceVal * (discountVal / 100);
		} else {
			discountAmount = priceVal * (discountVal / 10);
		}

		const payAmount = priceVal - discountAmount;
		const taxAmount = payAmount * tax;
		const taxIncluded = payAmount + taxAmount;

		setSingleResult({ discountAmount, payAmount, taxIncluded, taxAmount });
	}

	function calculateMulti() {
		const tax = Number(multiTaxRate) / 100;
		const resultItems = items
			.filter((item) => item.price !== "" && item.discountRate !== "")
			.map((item) => {
				const originalPrice = Number(item.price);
				const rate = Number(item.discountRate);
				const discountAmount = originalPrice * (rate / 100);
				const payAmount = originalPrice - discountAmount;
				const taxIncluded = payAmount * (1 + tax);
				return {
					name: item.name || "商品",
					originalPrice,
					discountAmount,
					payAmount,
					taxIncluded,
				};
			});

		if (resultItems.length === 0) return;

		const totalDiscount = resultItems.reduce((s, i) => s + i.discountAmount, 0);
		const totalPay = resultItems.reduce((s, i) => s + i.payAmount, 0);
		const totalTaxIncluded = resultItems.reduce((s, i) => s + i.taxIncluded, 0);

		setMultiResult({
			items: resultItems,
			totalDiscount,
			totalPay,
			totalTaxIncluded,
		});
	}

	function addItem() {
		setItems([...items, { name: "", price: "", discountRate: "" }]);
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

	return (
		<ToolLayout
			title="割引計算ツール"
			description="元値と割引率から割引額・支払額・税込額を計算します"
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
							<label className="block text-sm font-medium mb-1" htmlFor="price">
								元値（円）
							</label>
							<input
								id="price"
								type="number"
								min="0"
								value={price}
								onChange={(e) => setPrice(e.target.value)}
								className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
								placeholder="例: 3000"
							/>
						</div>

						<div>
							<p className="block text-sm font-medium mb-1">割引入力方式</p>
							<div className="flex gap-2">
								<button
									type="button"
									onClick={() => setDiscountType("percent")}
									className={`px-4 py-2 rounded text-sm font-medium ${
										discountType === "percent"
											? "bg-primary text-primary-foreground"
											: "bg-secondary text-foreground"
									}`}
								>
									%入力
								</button>
								<button
									type="button"
									onClick={() => setDiscountType("wari")}
									className={`px-4 py-2 rounded text-sm font-medium ${
										discountType === "wari"
											? "bg-primary text-primary-foreground"
											: "bg-secondary text-foreground"
									}`}
								>
									◯割引
								</button>
							</div>
						</div>

						<div>
							<label
								className="block text-sm font-medium mb-1"
								htmlFor="discountValue"
							>
								{discountType === "percent" ? "割引率（%）" : "割引（割）"}
							</label>
							<input
								id="discountValue"
								type="number"
								min="0"
								max={discountType === "percent" ? "100" : "10"}
								value={discountValue}
								onChange={(e) => setDiscountValue(e.target.value)}
								className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
								placeholder={
									discountType === "percent" ? "例: 20" : "例: 3（3割引）"
								}
							/>
						</div>

						<div>
							<label
								className="block text-sm font-medium mb-1"
								htmlFor="taxRate"
							>
								税率
							</label>
							<select
								id="taxRate"
								value={taxRate}
								onChange={(e) => setTaxRate(e.target.value)}
								className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
							>
								<option value="8">8%（軽減税率）</option>
								<option value="10">10%（標準税率）</option>
							</select>
						</div>

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
									<span className="text-sm text-muted-foreground">割引額</span>
									<span className="text-2xl font-bold text-primary">
										−{Math.round(singleResult.discountAmount).toLocaleString()}
										円
									</span>
								</div>
								<div className="flex justify-between items-center border-t pt-3">
									<span className="text-sm text-muted-foreground">
										支払額（税抜）
									</span>
									<span className="text-2xl font-bold">
										{Math.round(singleResult.payAmount).toLocaleString()}円
									</span>
								</div>
								<div className="flex justify-between items-center border-t pt-3">
									<span className="text-sm text-muted-foreground">
										税込支払額
									</span>
									<span className="text-2xl font-bold">
										{Math.round(singleResult.taxIncluded).toLocaleString()}円
									</span>
								</div>
								<div className="flex justify-between items-center border-t pt-3">
									<span className="text-sm text-muted-foreground">
										消費税額
									</span>
									<span className="text-lg font-semibold">
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
							<label
								className="block text-sm font-medium mb-1"
								htmlFor="multiTaxRate"
							>
								税率（全商品共通）
							</label>
							<select
								id="multiTaxRate"
								value={multiTaxRate}
								onChange={(e) => setMultiTaxRate(e.target.value)}
								className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
							>
								<option value="8">8%（軽減税率）</option>
								<option value="10">10%（標準税率）</option>
							</select>
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
											value={item.price}
											onChange={(e) =>
												updateItem(index, "price", e.target.value)
											}
											className="flex-1 border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
											placeholder="元値（円）"
										/>
										<input
											type="number"
											min="0"
											max="100"
											value={item.discountRate}
											onChange={(e) =>
												updateItem(index, "discountRate", e.target.value)
											}
											className="flex-1 border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
											placeholder="割引率（%）"
										/>
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
													元値
												</th>
												<th className="text-right py-2 pr-2 text-muted-foreground font-medium">
													割引額
												</th>
												<th className="text-right py-2 text-muted-foreground font-medium">
													税込額
												</th>
											</tr>
										</thead>
										<tbody>
											{multiResult.items.map((item, i) => (
												<tr key={i} className="border-b border-border">
													<td className="py-2 pr-2">{item.name}</td>
													<td className="text-right py-2 pr-2">
														{item.originalPrice.toLocaleString()}円
													</td>
													<td className="text-right py-2 pr-2 text-primary">
														−{Math.round(item.discountAmount).toLocaleString()}
														円
													</td>
													<td className="text-right py-2">
														{Math.round(item.taxIncluded).toLocaleString()}円
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
								<div className="flex justify-between items-center border-t pt-3">
									<span className="text-sm text-muted-foreground">
										割引合計
									</span>
									<span className="text-xl font-bold text-primary">
										−{Math.round(multiResult.totalDiscount).toLocaleString()}円
									</span>
								</div>
								<div className="flex justify-between items-center border-t pt-3">
									<span className="text-sm text-muted-foreground">
										支払合計（税抜）
									</span>
									<span className="text-xl font-bold">
										{Math.round(multiResult.totalPay).toLocaleString()}円
									</span>
								</div>
								<div className="flex justify-between items-center border-t pt-3">
									<span className="text-sm text-muted-foreground">
										税込合計
									</span>
									<span className="text-2xl font-bold">
										{Math.round(multiResult.totalTaxIncluded).toLocaleString()}
										円
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
						<strong>%引き</strong>は元値に対する割合で割引します。
						例：3,000円の20%引き = 3,000 × 0.2 = 600円引き → 2,400円
					</p>
					<p>
						<strong>◯割引</strong>は1割＝10%として計算します。
						例：3,000円の3割引 = 3,000 × 0.3 = 900円引き → 2,100円
					</p>
					<p>
						<strong>消費税計算</strong>：支払額（税抜）× 税率
					</p>
					<p>
						<strong>税込支払額</strong> = 支払額（税抜）×（1 + 税率）
					</p>
					<p>※ 本ツールの計算結果は参考値です。</p>
				</div>
			</div>
		</ToolLayout>
	);
}
