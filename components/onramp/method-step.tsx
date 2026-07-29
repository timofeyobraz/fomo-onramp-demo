"use client";

import { CardChip } from "@/components/onramp/card-face";
import { Divider, Row } from "@/components/onramp/chrome";
import type { Selection } from "@/components/onramp/selection";
import { BRAND_LABELS, type SavedCard } from "@/lib/cards";
import { theme } from "@/lib/theme";

function Glyph({ children }: { children: React.ReactNode }) {
	return (
		<span
			aria-hidden="true"
			style={{ fontSize: 22, width: 46, textAlign: "center" }}
		>
			{children}
		</span>
	);
}

export function MethodStep({
	cards,
	selection,
	onSelectCard,
	onAddCard,
	onSelectBank,
	onSelectCrypto,
}: {
	cards: SavedCard[];
	selection: Selection;
	onSelectCard: (card: SavedCard) => void;
	onAddCard: () => void;
	onSelectBank: () => void;
	onSelectCrypto: () => void;
}) {
	const selectedCardId =
		selection.kind === "card" ? selection.card.id : undefined;

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
			{cards.map((card) => (
				<Row
					key={card.id}
					leading={<CardChip brand={card.brand} />}
					title={`${BRAND_LABELS[card.brand]} ···· ${card.last4}`}
					subtitle={`Expires ${card.expMonth}/${card.expYear} · Instant`}
					selected={card.id === selectedCardId}
					onClick={() => onSelectCard(card)}
					trailing={
						card.id === selectedCardId ? (
							<span
								style={{ color: theme.accent, fontSize: 15, fontWeight: 700 }}
							>
								✓
							</span>
						) : undefined
					}
				/>
			))}

			<Row
				leading={<Glyph>＋</Glyph>}
				title="Add a card"
				subtitle="Debit or credit"
				onClick={onAddCard}
			/>

			<Divider label="Other ways to fund" />

			<Row
				leading={<Glyph>🏦</Glyph>}
				title="Bank transfer"
				subtitle="ACH or wire · no fee"
				selected={selection.kind === "bank"}
				onClick={onSelectBank}
			/>
			<Row
				leading={<Glyph>🪙</Glyph>}
				title="Crypto"
				subtitle="USDC, USDT, ETH, SOL and more"
				selected={selection.kind === "crypto"}
				onClick={onSelectCrypto}
			/>
		</div>
	);
}
