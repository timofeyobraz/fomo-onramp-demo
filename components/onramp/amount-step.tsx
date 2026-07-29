"use client";

import { SelectedCardSummary } from "@/components/onramp/card-face";
import { PrimaryButton } from "@/components/onramp/chrome";
import type { Selection } from "@/components/onramp/selection";
import { estimateCardFee } from "@/lib/cards";
import { formatAmount, parseAmount, usd } from "@/lib/format";
import { theme } from "@/lib/theme";

const QUICK_AMOUNTS = ["500", "1000", "10000"];

function methodLabel(selection: Selection) {
	if (selection.kind === "bank") return "Bank transfer";
	if (selection.kind === "crypto") return "Crypto";
	return "";
}

export function AmountStep({
	amount,
	onAmountChange,
	selection,
	onChangeMethod,
	onContinue,
}: {
	amount: string;
	onAmountChange: (next: string) => void;
	selection: Selection;
	onChangeMethod: () => void;
	onContinue: () => void;
}) {
	const numeric = Number(amount) || 0;
	const fee = selection.kind === "card" ? estimateCardFee(numeric) : 0;

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 14,
					padding: "10px 0 2px",
				}}
			>
				{/* The symbol is part of the value rather than a sibling, so one full-width
				    centred input holds the whole figure — sizing the box to the text in `ch`
				    overshoots, because commas are narrower than digits. */}
				<input
					className="amount"
					value={amount ? `$${formatAmount(amount)}` : ""}
					onChange={(event) => {
						const next = parseAmount(event.target.value);
						const [whole = ""] = next.split(".");
						if (whole.length > 9) return;
						onAmountChange(next);
					}}
					placeholder="$0"
					inputMode="decimal"
					aria-label="Amount to deposit"
					style={{
						width: "100%",
						textAlign: "center",
						border: "none",
						// the caret is the focus indicator here; a ring would box the number in
						outline: "none",
						background: "none",
						color: theme.heading,
						fontSize: 46,
						fontWeight: 700,
						fontFamily: "inherit",
						letterSpacing: "-0.03em",
						padding: 0,
					}}
				/>

				<div style={{ display: "flex", gap: 8 }}>
					{QUICK_AMOUNTS.map((quick) => (
						<button
							key={quick}
							type="button"
							onClick={() => onAmountChange(quick)}
							style={{
								padding: "8px 18px",
								borderRadius: 999,
								border: `1px solid ${amount === quick ? theme.accent : theme.border}`,
								background: amount === quick ? theme.accentSoft : theme.row,
								color: theme.text,
								fontSize: 13.5,
								fontWeight: 600,
								fontFamily: "inherit",
								cursor: "pointer",
							}}
						>
							${formatAmount(quick)}
						</button>
					))}
				</div>
			</div>

			<div>
				<div style={{ color: theme.faint, fontSize: 12, marginBottom: 6 }}>
					Pay with
				</div>
				<button
					type="button"
					onClick={onChangeMethod}
					style={{
						display: "flex",
						alignItems: "center",
						gap: 12,
						width: "100%",
						padding: 14,
						borderRadius: 14,
						border: `1px solid ${theme.border}`,
						background: theme.row,
						color: theme.text,
						fontFamily: "inherit",
						cursor: "pointer",
						textAlign: "left",
					}}
				>
					<span style={{ flex: 1, minWidth: 0 }}>
						{selection.kind === "card" ? (
							<SelectedCardSummary
								brand={selection.card.brand}
								last4={selection.card.last4}
							/>
						) : (
							<span style={{ fontSize: 14.5, fontWeight: 600 }}>
								{methodLabel(selection)}
							</span>
						)}
					</span>
					<span style={{ color: theme.accent, fontSize: 13, fontWeight: 600 }}>
						Change
					</span>
				</button>
			</div>

			{selection.kind === "card" && numeric > 0 ? (
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						fontSize: 12.5,
						color: theme.muted,
					}}
				>
					<span>Processing fee · 2.9% + $0.30</span>
					<span>{usd(fee)}</span>
				</div>
			) : null}

			<PrimaryButton onClick={onContinue} disabled={numeric <= 0}>
				{selection.kind === "card"
					? `Deposit ${usd(numeric)}`
					: "Show instructions"}
			</PrimaryButton>
		</div>
	);
}
