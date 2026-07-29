"use client";

import { useState } from "react";
import { CardFace } from "@/components/onramp/card-face";
import { Field, PrimaryButton } from "@/components/onramp/chrome";
import {
	BRAND_LABELS,
	type CardDraft,
	type SavedCard,
	cardFromDraft,
	cvcLengthFor,
	detectBrand,
	digitsOf,
	formatCardNumber,
	formatExpiry,
	validateDraft,
} from "@/lib/cards";
import { theme } from "@/lib/theme";

const EMPTY: CardDraft = { number: "", expiry: "", cvc: "", holder: "" };

export function AddCardStep({ onAdded }: { onAdded: (card: SavedCard) => void }) {
	const [draft, setDraft] = useState<CardDraft>(EMPTY);
	const [error, setError] = useState<string | null>(null);

	const brand = detectBrand(draft.number);
	const digits = digitsOf(draft.number);

	const set = (patch: Partial<CardDraft>) => {
		setDraft((current) => ({ ...current, ...patch }));
		setError(null);
	};

	const submit = () => {
		const problem = validateDraft(draft);
		if (problem) {
			setError(problem);
			return;
		}
		onAdded(cardFromDraft(draft));
	};

	const [expMonth = "", expYear = ""] = draft.expiry.split("/");

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
			<CardFace
				brand={brand}
				digits={digits}
				expMonth={expMonth}
				expYear={expYear}
				holder={draft.holder}
			/>

			<Field
				label="Card number"
				value={draft.number}
				onChange={(next) => set({ number: formatCardNumber(next) })}
				placeholder="1234 1234 1234 1234"
				inputMode="numeric"
				autoFocus
				trailing={
					digits.length >= 2 ? (
						<span
							style={{
								fontSize: 11,
								fontWeight: 700,
								letterSpacing: "0.04em",
								textTransform: "uppercase",
								color: theme.muted,
							}}
						>
							{BRAND_LABELS[brand]}
						</span>
					) : undefined
				}
			/>

			<div style={{ display: "flex", gap: 10 }}>
				<Field
					label="Expiry"
					value={draft.expiry}
					onChange={(next) => set({ expiry: formatExpiry(next) })}
					placeholder="MM/YY"
					inputMode="numeric"
					maxLength={5}
				/>
				<Field
					label="CVC"
					value={draft.cvc}
					onChange={(next) =>
						set({ cvc: digitsOf(next).slice(0, cvcLengthFor(brand)) })
					}
					placeholder={"•".repeat(cvcLengthFor(brand))}
					inputMode="numeric"
				/>
			</div>

			<Field
				label="Name on card"
				value={draft.holder}
				onChange={(next) => set({ holder: next })}
				placeholder="Alex Morgan"
			/>

			{error ? (
				<p style={{ color: theme.negative, fontSize: 13, margin: 0 }}>{error}</p>
			) : null}

			<PrimaryButton onClick={submit}>Add card</PrimaryButton>
		</div>
	);
}
