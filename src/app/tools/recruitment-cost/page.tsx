"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";

export default function RecruitmentCostPage() {
	const [baitaihi, setBaitaihi] = useState("");
	const [jinkenhi, setJinkenhi] = useState("");
	const [shokai, setShokai] = useState("");
	const [oushosu, setOushosu] = useState("");
	const [saishosu, setSaishosu] = useState("");
	const [result, setResult] = useState<{
		sokosu: number;
		saishotanka: number;
		oushoutanka: number;
	} | null>(null);

	function calculate() {
		const b = parseFloat(baitaihi) || 0;
		const j = parseFloat(jinkenhi) || 0;
		const s = parseFloat(shokai) || 0;
		const o = parseFloat(oushosu);
		const r = parseFloat(saishosu);

		if (Number.isNaN(o) || Number.isNaN(r) || o <= 0 || r <= 0) return;

		const sokosu = b + j + s;
		const saishotanka = sokosu / r;
		const oushoutanka = sokosu / o;

		setResult({ sokosu, saishotanka, oushoutanka });
	}

	return (
		<ToolLayout
			title="採用コスト計算ツール"
			description="採用にかかる各費用から採用単価・応募単価を計算します"
		>
			<div className="space-y-6">
				<div>
					<p className="text-sm font-medium mb-3">費用（円）</p>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div>
							<label
								htmlFor="baitaihi"
								className="block text-sm text-muted-foreground mb-1"
							>
								媒体費
							</label>
							<input
								id="baitaihi"
								type="number"
								value={baitaihi}
								onChange={(e) => setBaitaihi(e.target.value)}
								placeholder="例: 500000"
								className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							/>
						</div>
						<div>
							<label
								htmlFor="jinkenhi"
								className="block text-sm text-muted-foreground mb-1"
							>
								人件費
							</label>
							<input
								id="jinkenhi"
								type="number"
								value={jinkenhi}
								onChange={(e) => setJinkenhi(e.target.value)}
								placeholder="例: 200000"
								className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							/>
						</div>
						<div>
							<label
								htmlFor="shokai"
								className="block text-sm text-muted-foreground mb-1"
							>
								紹介手数料
							</label>
							<input
								id="shokai"
								type="number"
								value={shokai}
								onChange={(e) => setShokai(e.target.value)}
								placeholder="例: 300000"
								className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							/>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label htmlFor="oushosu" className="block text-sm font-medium mb-1">
							応募数（人）
						</label>
						<input
							id="oushosu"
							type="number"
							value={oushosu}
							onChange={(e) => setOushosu(e.target.value)}
							placeholder="例: 50"
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>
					<div>
						<label
							htmlFor="saishosu"
							className="block text-sm font-medium mb-1"
						>
							採用数（人）
						</label>
						<input
							id="saishosu"
							type="number"
							value={saishosu}
							onChange={(e) => setSaishosu(e.target.value)}
							placeholder="例: 5"
							className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div className="bg-secondary border border-border rounded-lg p-4 text-center">
							<p className="text-xs text-muted-foreground mb-1">採用総コスト</p>
							<p className="text-2xl font-bold">
								{result.sokosu.toLocaleString()}
							</p>
							<p className="text-xs text-muted-foreground mt-1">円</p>
						</div>
						<div className="bg-secondary border border-border rounded-lg p-4 text-center">
							<p className="text-xs text-muted-foreground mb-1">採用単価</p>
							<p className="text-2xl font-bold text-primary">
								{Math.round(result.saishotanka).toLocaleString()}
							</p>
							<p className="text-xs text-muted-foreground mt-1">円 / 採用1人</p>
						</div>
						<div className="bg-secondary border border-border rounded-lg p-4 text-center">
							<p className="text-xs text-muted-foreground mb-1">応募単価</p>
							<p className="text-2xl font-bold text-green-600">
								{Math.round(result.oushoutanka).toLocaleString()}
							</p>
							<p className="text-xs text-muted-foreground mt-1">円 / 応募1人</p>
						</div>
					</div>
				)}

				<div className="mt-8 space-y-3 text-sm text-muted-foreground">
					<h2 className="text-base font-semibold text-foreground">
						計算式の説明
					</h2>
					<dl className="space-y-2">
						<div>
							<dt className="font-semibold text-foreground">総コスト</dt>
							<dd className="ml-4">
								総コスト ＝ 媒体費 ＋ 人件費 ＋ 紹介手数料
							</dd>
							<dd className="ml-4 text-xs">
								採用活動にかかったすべての費用の合計です。
							</dd>
						</div>
						<div>
							<dt className="font-semibold text-foreground">
								採用単価（Cost Per Hire）
							</dt>
							<dd className="ml-4">採用単価 ＝ 総コスト ÷ 採用数</dd>
							<dd className="ml-4 text-xs">
								1人を採用するためにかかったコストです。
							</dd>
						</div>
						<div>
							<dt className="font-semibold text-foreground">
								応募単価（Cost Per Applicant）
							</dt>
							<dd className="ml-4">応募単価 ＝ 総コスト ÷ 応募数</dd>
							<dd className="ml-4 text-xs">
								1人の応募を獲得するためにかかったコストです。
							</dd>
						</div>
					</dl>
				</div>
			</div>
		</ToolLayout>
	);
}
