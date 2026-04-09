"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";

type Mode = "calc" | "reverse";

type CalcResult = {
	age: number;
	kazoeAge: number;
	daysSinceBirth: number;
	eto: string;
	zodiac: string;
};

type ReverseResult = {
	targetAge: number;
	dateStr: string;
};

// 干支サイクル: 2024年=辰を基準に12年周期
const ETO_BASE_YEAR = 2024; // 辰年
const ETO_BASE_INDEX = 8; // 辰のインデックス(0=子,1=丑,...,8=辰)
const ETO_NAMES = [
	"子",
	"丑",
	"寅",
	"卯",
	"辰",
	"巳",
	"午",
	"未",
	"申",
	"酉",
	"戌",
	"亥",
];

function getEto(year: number): string {
	const diff = year - ETO_BASE_YEAR;
	const index = (((ETO_BASE_INDEX + diff) % 12) + 12) % 12;
	return ETO_NAMES[index];
}

function getZodiac(month: number, day: number): string {
	if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
		return "牡羊座（おひつじ座）";
	if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
		return "牡牛座（おうし座）";
	if ((month === 5 && day >= 21) || (month === 6 && day <= 21))
		return "双子座（ふたご座）";
	if ((month === 6 && day >= 22) || (month === 7 && day <= 22))
		return "蟹座（かに座）";
	if ((month === 7 && day >= 23) || (month === 8 && day <= 22))
		return "獅子座（しし座）";
	if ((month === 8 && day >= 23) || (month === 9 && day <= 22))
		return "乙女座（おとめ座）";
	if ((month === 9 && day >= 23) || (month === 10 && day <= 23))
		return "天秤座（てんびん座）";
	if ((month === 10 && day >= 24) || (month === 11 && day <= 22))
		return "蠍座（さそり座）";
	if ((month === 11 && day >= 23) || (month === 12 && day <= 21))
		return "射手座（いて座）";
	if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
		return "山羊座（やぎ座）";
	if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
		return "水瓶座（みずがめ座）";
	return "魚座（うお座）";
}

function formatDate(date: Date): string {
	const y = date.getFullYear();
	const m = date.getMonth() + 1;
	const d = date.getDate();
	return `${y}年${m}月${d}日`;
}

const today = new Date();
const todayStr = today.toISOString().split("T")[0];

export default function AgeCalculatorPage() {
	const [mode, setMode] = useState<Mode>("calc");

	// Mode 1
	const [birthDate, setBirthDate] = useState("");
	const [baseDate, setBaseDate] = useState(todayStr);
	const [calcResult, setCalcResult] = useState<CalcResult | null>(null);

	// Mode 2
	const [reverseBirthDate, setReverseBirthDate] = useState("");
	const [targetAge, setTargetAge] = useState("");
	const [reverseResult, setReverseResult] = useState<ReverseResult | null>(
		null,
	);

	function calculateAge() {
		if (!birthDate || !baseDate) return;
		const birth = new Date(birthDate);
		const base = new Date(baseDate);
		if (Number.isNaN(birth.getTime()) || Number.isNaN(base.getTime())) return;
		if (birth > base) return;

		const birthYear = birth.getFullYear();
		const birthMonth = birth.getMonth() + 1;
		const birthDay = birth.getDate();
		const baseYear = base.getFullYear();
		const baseMonth = base.getMonth() + 1;
		const baseDay = base.getDate();

		// 満年齢
		let age = baseYear - birthYear;
		if (
			baseMonth < birthMonth ||
			(baseMonth === birthMonth && baseDay < birthDay)
		) {
			age -= 1;
		}

		// 数え年: 生まれた年を1歳とし、元日ごとに1歳加える
		const kazoeAge = baseYear - birthYear + 1;

		// 生まれてからの日数
		const msPerDay = 1000 * 60 * 60 * 24;
		const daysSinceBirth = Math.floor(
			(base.getTime() - birth.getTime()) / msPerDay,
		);

		const eto = getEto(birthYear);
		const zodiac = getZodiac(birthMonth, birthDay);

		setCalcResult({ age, kazoeAge, daysSinceBirth, eto, zodiac });
	}

	function calculateReverse() {
		if (!reverseBirthDate || !targetAge) return;
		const birth = new Date(reverseBirthDate);
		const age = Number(targetAge);
		if (Number.isNaN(birth.getTime()) || Number.isNaN(age) || age < 0) return;

		// 満年齢になる日 = 誕生日と同月同日、誕生年 + age
		const targetYear = birth.getFullYear() + age;
		const result = new Date(targetYear, birth.getMonth(), birth.getDate());
		setReverseResult({ targetAge: age, dateStr: formatDate(result) });
	}

	return (
		<ToolLayout
			title="年齢計算ツール"
			description="生年月日から満年齢・数え年・干支・星座を計算します"
		>
			<div className="space-y-6">
				{/* モード切替 */}
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => setMode("calc")}
						className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
							mode === "calc"
								? "bg-primary text-primary-foreground"
								: "bg-secondary text-foreground"
						}`}
					>
						年齢計算
					</button>
					<button
						type="button"
						onClick={() => setMode("reverse")}
						className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
							mode === "reverse"
								? "bg-primary text-primary-foreground"
								: "bg-secondary text-foreground"
						}`}
					>
						◯歳になる日
					</button>
				</div>

				{/* Mode 1: 年齢計算 */}
				{mode === "calc" && (
					<div className="space-y-4">
						<div>
							<label
								className="block text-sm font-medium mb-1"
								htmlFor="birthDate"
							>
								生年月日
							</label>
							<input
								id="birthDate"
								type="date"
								value={birthDate}
								onChange={(e) => setBirthDate(e.target.value)}
								className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							/>
						</div>
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
						<button
							type="button"
							onClick={calculateAge}
							className="w-full bg-primary text-primary-foreground py-2 px-4 rounded font-medium hover:opacity-90 transition-colors"
						>
							計算する
						</button>
						{calcResult && (
							<div className="border border-border rounded p-4 bg-secondary space-y-3">
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">満年齢</span>
									<span className="text-3xl font-bold text-primary">
										{calcResult.age}歳
									</span>
								</div>
								<div className="flex justify-between items-center border-t border-border pt-3">
									<span className="text-sm text-muted-foreground">数え年</span>
									<span className="text-2xl font-bold">
										{calcResult.kazoeAge}歳
									</span>
								</div>
								<div className="flex justify-between items-center border-t border-border pt-3">
									<span className="text-sm text-muted-foreground">
										生まれてからの日数
									</span>
									<span className="text-2xl font-bold">
										{calcResult.daysSinceBirth.toLocaleString()}日
									</span>
								</div>
								<div className="flex justify-between items-center border-t border-border pt-3">
									<span className="text-sm text-muted-foreground">干支</span>
									<span className="text-2xl font-bold">
										{calcResult.eto}年生まれ
									</span>
								</div>
								<div className="flex justify-between items-center border-t border-border pt-3">
									<span className="text-sm text-muted-foreground">星座</span>
									<span className="text-xl font-bold">{calcResult.zodiac}</span>
								</div>
							</div>
						)}
					</div>
				)}

				{/* Mode 2: 逆引き */}
				{mode === "reverse" && (
					<div className="space-y-4">
						<div>
							<label
								className="block text-sm font-medium mb-1"
								htmlFor="reverseBirthDate"
							>
								生年月日
							</label>
							<input
								id="reverseBirthDate"
								type="date"
								value={reverseBirthDate}
								onChange={(e) => setReverseBirthDate(e.target.value)}
								className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							/>
						</div>
						<div>
							<label
								className="block text-sm font-medium mb-1"
								htmlFor="targetAge"
							>
								何歳になる日を調べますか？
							</label>
							<input
								id="targetAge"
								type="number"
								min="0"
								max="150"
								value={targetAge}
								onChange={(e) => setTargetAge(e.target.value)}
								className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
								placeholder="例: 60"
							/>
						</div>
						<button
							type="button"
							onClick={calculateReverse}
							className="w-full bg-primary text-primary-foreground py-2 px-4 rounded font-medium hover:opacity-90 transition-colors"
						>
							計算する
						</button>
						{reverseResult && (
							<div className="border border-border rounded p-4 bg-secondary space-y-2">
								<p className="text-sm text-muted-foreground">
									満{reverseResult.targetAge}歳になる日
								</p>
								<p className="text-3xl font-bold text-primary">
									{reverseResult.dateStr}
								</p>
							</div>
						)}
					</div>
				)}

				<div className="mt-8 space-y-3 text-sm text-muted-foreground">
					<h2 className="text-base font-semibold text-foreground">
						計算式について
					</h2>
					<p>
						<strong>満年齢</strong>
						：誕生日の前日の終了時（24時）に1歳加算されます。「年齢計算ニ関スル法律」（明治35年）に基づき、生まれた日を0歳とし、誕生日ごとに1歳ずつ加算します。
					</p>
					<p>
						<strong>数え年</strong>
						：生まれた年を1歳とし、以後元日（1月1日）ごとに1歳加算する数え方です。本ツールでは「基準年
						− 生まれ年 + 1」で簡易計算しています。
					</p>
					<p>
						<strong>干支</strong>
						：十二支は12年周期で繰り返します。2024年が辰年を基準に計算しています（子・丑・寅・卯・辰・巳・午・未・申・酉・戌・亥）。
					</p>
					<p>
						<strong>星座</strong>
						：西洋占星術の太陽星座（誕生日の月日）に基づきます。
					</p>
					<p>
						<strong>年齢計算ニ関スル法律</strong>
						（明治35年法律第50号）：年齢は出生の日から起算し、起算日に応当する日の前日が満了したときに加算されると定めています。
					</p>
				</div>
			</div>
		</ToolLayout>
	);
}
