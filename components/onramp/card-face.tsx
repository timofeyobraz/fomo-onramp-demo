import {
	BRAND_GRADIENTS,
	BRAND_LABELS,
	BRAND_SHORT,
	type CardBrand,
	numberLengthFor,
} from "@/lib/cards";
import { theme } from "@/lib/theme";

function BrandMark({ brand }: { brand: CardBrand }) {
	return (
		<span
			style={{
				fontSize: 13,
				fontWeight: 700,
				letterSpacing: "0.08em",
				textTransform: "uppercase",
				color: "rgba(255, 255, 255, 0.92)",
			}}
		>
			{BRAND_LABELS[brand]}
		</span>
	);
}

export function CardChip({ brand }: { brand: CardBrand }) {
	return (
		<span
			style={{
				width: 46,
				height: 30,
				borderRadius: 6,
				background: BRAND_GRADIENTS[brand],
				border: "1px solid rgba(255, 255, 255, 0.14)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				fontSize: 9,
				fontWeight: 700,
				letterSpacing: "0.04em",
				color: "rgba(255, 255, 255, 0.92)",
				flexShrink: 0,
			}}
		>
			{BRAND_SHORT[brand]}
		</span>
	);
}

// Grouped digits with dots standing in for whatever hasn't been typed yet, so the preview
// keeps a card's shape from the first keystroke.
function maskedNumber(digits: string, brand: CardBrand) {
	const length = numberLengthFor(brand);
	const filled = digits.slice(0, length);
	const padded = filled.padEnd(length, "•");
	const groups = brand === "amex" ? [4, 6, 5] : [4, 4, 4, 4];

	const parts: string[] = [];
	let cursor = 0;
	for (const size of groups) {
		parts.push(padded.slice(cursor, cursor + size));
		cursor += size;
	}
	return parts.join("  ");
}

export function CardFace({
	brand,
	digits = "",
	last4,
	expMonth,
	expYear,
	holder,
}: {
	brand: CardBrand;
	digits?: string;
	last4?: string;
	expMonth?: string;
	expYear?: string;
	holder?: string;
}) {
	const shown = last4 ? "•".repeat(numberLengthFor(brand) - 4) + last4 : digits;

	return (
		<div
			style={{
				position: "relative",
				width: "100%",
				aspectRatio: "1.6 / 1",
				borderRadius: 16,
				padding: 18,
				background: BRAND_GRADIENTS[brand],
				border: "1px solid rgba(255, 255, 255, 0.14)",
				boxShadow: "0 18px 44px rgba(0, 0, 0, 0.45)",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				overflow: "hidden",
			}}
		>
			<div
				aria-hidden="true"
				style={{
					position: "absolute",
					inset: 0,
					background:
						"radial-gradient(120% 90% at 8% 0%, rgba(255,255,255,0.22), transparent 55%)",
					pointerEvents: "none",
				}}
			/>

			<div
				style={{
					position: "relative",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<span
					style={{
						width: 34,
						height: 24,
						borderRadius: 5,
						background:
							"linear-gradient(135deg, rgba(255,225,150,0.9), rgba(200,160,70,0.75))",
						border: "1px solid rgba(255, 255, 255, 0.25)",
					}}
				/>
				<BrandMark brand={brand} />
			</div>

			<div
				style={{
					position: "relative",
					fontSize: 17,
					fontWeight: 600,
					letterSpacing: "0.06em",
					color: "rgba(255, 255, 255, 0.95)",
					fontVariantNumeric: "tabular-nums",
				}}
			>
				{maskedNumber(shown, brand)}
			</div>

			<div
				style={{
					position: "relative",
					display: "flex",
					alignItems: "flex-end",
					justifyContent: "space-between",
					gap: 12,
				}}
			>
				<span
					style={{
						fontSize: 11.5,
						fontWeight: 600,
						letterSpacing: "0.08em",
						textTransform: "uppercase",
						color: "rgba(255, 255, 255, 0.82)",
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
					}}
				>
					{holder?.trim() ? holder : "CARDHOLDER"}
				</span>
				<span
					style={{
						fontSize: 11.5,
						fontWeight: 600,
						letterSpacing: "0.06em",
						color: "rgba(255, 255, 255, 0.82)",
						fontVariantNumeric: "tabular-nums",
						flexShrink: 0,
					}}
				>
					{expMonth || "MM"}/{expYear || "YY"}
				</span>
			</div>
		</div>
	);
}

export function SelectedCardSummary({
	brand,
	last4,
}: {
	brand: CardBrand;
	last4: string;
}) {
	return (
		<span style={{ display: "flex", alignItems: "center", gap: 10 }}>
			<CardChip brand={brand} />
			<span style={{ fontSize: 14.5, fontWeight: 600, color: theme.text }}>
				{BRAND_LABELS[brand]} ···· {last4}
			</span>
		</span>
	);
}
