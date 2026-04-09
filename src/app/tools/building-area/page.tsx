"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";

export default function BuildingAreaPage() {
	const [landArea, setLandArea] = useState("");
	const [floorAreaRatio, setFloorAreaRatio] = useState("");
	const [buildingCoverageRatio, setBuildingCoverageRatio] = useState("");
	const [result, setResult] = useState<{
		maxBuildingArea: number;
		maxTotalFloorArea: number;
	} | null>(null);

	function calculate() {
		const land = parseFloat(landArea);
		const far = parseFloat(floorAreaRatio);
		const bcr = parseFloat(buildingCoverageRatio);
		if (!land || !far || !bcr || land <= 0 || far <= 0 || bcr <= 0) return;

		const maxBuildingArea = land * (bcr / 100);
		const maxTotalFloorArea = land * (far / 100);

		setResult({ maxBuildingArea, maxTotalFloorArea });
	}

	return (
		<ToolLayout
			title="建築可能面積計算ツール"
			description="土地面積・容積率・建ぺい率から建築面積上限を計算します"
		>
			<div className="space-y-6">
				<div className="space-y-4">
					<div>
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="landArea"
						>
							土地面積（㎡）
						</label>
						<input
							id="landArea"
							type="number"
							min="0"
							step="0.01"
							value={landArea}
							onChange={(e) => setLandArea(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="例: 200"
						/>
					</div>
					<div>
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="floorAreaRatio"
						>
							容積率（%）
						</label>
						<input
							id="floorAreaRatio"
							type="number"
							min="0"
							step="1"
							value={floorAreaRatio}
							onChange={(e) => setFloorAreaRatio(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="例: 200"
						/>
					</div>
					<div>
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="buildingCoverageRatio"
						>
							建ぺい率（%）
						</label>
						<input
							id="buildingCoverageRatio"
							type="number"
							min="0"
							max="100"
							step="1"
							value={buildingCoverageRatio}
							onChange={(e) => setBuildingCoverageRatio(e.target.value)}
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="例: 60"
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
								建築面積上限（建ぺい率）
							</span>
							<span className="text-2xl font-bold text-primary">
								{result.maxBuildingArea.toLocaleString(undefined, {
									maximumFractionDigits: 2,
								})}
								㎡
							</span>
						</div>
						<div className="flex justify-between items-center border-t pt-3">
							<span className="text-sm text-muted-foreground">
								延床面積上限（容積率）
							</span>
							<span className="text-2xl font-bold">
								{result.maxTotalFloorArea.toLocaleString(undefined, {
									maximumFractionDigits: 2,
								})}
								㎡
							</span>
						</div>
					</div>
				)}

				<div className="mt-8 space-y-3 text-sm text-muted-foreground">
					<h2 className="text-base font-semibold text-foreground">
						計算式について
					</h2>
					<p>
						建築基準法により、用途地域ごとに<strong>建ぺい率</strong>と
						<strong>容積率</strong>
						が定められており、建物の大きさに上限が設けられています。
					</p>
					<p>
						<strong>建築面積上限</strong> = 土地面積 × （建ぺい率 ÷ 100）
					</p>
					<p>
						建築面積とは建物を真上から見た投影面積（1階部分の床面積に相当）です。
					</p>
					<p>
						<strong>延床面積上限</strong> = 土地面積 × （容積率 ÷ 100）
					</p>
					<p>
						延床面積とは各階の床面積の合計です。容積率が高いほど、多層階の建物を建てることができます。
					</p>
					<p>
						※
						実際の建築可能面積は、道路斜線制限・隣地斜線制限・日影規制などにより、さらに制限される場合があります。詳細は建築士等の専門家にご相談ください。
					</p>
				</div>
			</div>
		</ToolLayout>
	);
}
