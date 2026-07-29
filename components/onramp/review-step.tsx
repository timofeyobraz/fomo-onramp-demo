"use client";

import { useEffect, useState } from "react";
import { CardFace } from "@/components/onramp/card-face";
import { PrimaryButton } from "@/components/onramp/chrome";
import { BRAND_LABELS, type SavedCard, estimateCardFee } from "@/lib/cards";
import { usd } from "@/lib/format";
import { theme } from "@/lib/theme";

function Line({
	label,
	value,
	strong,
}: {
	label: string;
	value: string;
	strong?: boolean;
}) {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "space-between",
				gap: 12,
				fontSize: strong ? 15 : 13.5,
				fontWeight: strong ? 700 : 500,
				color: strong ? theme.heading : theme.muted,
			}}
		>
			<span>{label}</span>
			<span style={{ fontVariantNumeric: "tabular-nums" }}>{value}</span>
		</div>
	);
}

export function ReviewStep({
	card,
	amount,
	onConfirmed,
}: {
	card: SavedCard;
	amount: number;
	onConfirmed: () => void;
}) {
	const [processing, setProcessing] = useState(false);
	const fee = estimateCardFee(amount);

	// owned by an effect so backing out mid-charge cancels it instead of firing a late success
	useEffect(() => {
		if (!processing) return;
		const timer = window.setTimeout(onConfirmed, 900);
		return () => window.clearTimeout(timer);
	}, [processing, onConfirmed]);

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			<CardFace
				brand={card.brand}
				last4={card.last4}
				expMonth={card.expMonth}
				expYear={card.expYear}
				holder={card.holder}
			/>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 10,
					padding: 14,
					borderRadius: 14,
					border: `1px solid ${theme.border}`,
					background: theme.row,
				}}
			>
				<Line label="Deposit" value={usd(amount)} />
				<Line label="Processing fee (2.9% + $0.30)" value={usd(fee)} />
				<span style={{ height: 1, background: theme.border }} />
				<Line label="Total charged" value={usd(amount + fee)} strong />
			</div>

			<PrimaryButton onClick={() => setProcessing(true)} disabled={processing}>
				{processing
					? "Processing…"
					: `Charge ${BRAND_LABELS[card.brand]} ···· ${card.last4}`}
			</PrimaryButton>

			<p
				style={{
					color: theme.faint,
					fontSize: 12,
					lineHeight: 1.5,
					margin: 0,
					textAlign: "center",
				}}
			>
				Whop's deposit API returns funding instructions, never card data — so this is
				the point where your own processor takes over.
			</p>
		</div>
	);
}
