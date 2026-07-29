"use client";

import { PrimaryButton } from "@/components/onramp/chrome";
import { usd } from "@/lib/format";
import { theme } from "@/lib/theme";

export function SuccessStep({
	amount,
	onDone,
}: {
	amount: number;
	onDone: () => void;
}) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: 12,
				padding: "16px 0 4px",
			}}
		>
			<div
				style={{
					width: 52,
					height: 52,
					borderRadius: "50%",
					background: "rgba(126, 226, 168, 0.15)",
					border: "1px solid rgba(126, 226, 168, 0.4)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontSize: 24,
					color: theme.positive,
				}}
			>
				✓
			</div>
			<div style={{ fontSize: 24, fontWeight: 700, color: theme.heading }}>
				{usd(amount)} added
			</div>
			<p
				style={{
					color: theme.muted,
					fontSize: 13,
					margin: 0,
					textAlign: "center",
				}}
			>
				Your balance is available now.
			</p>
			<div style={{ width: "100%", marginTop: 8 }}>
				<PrimaryButton onClick={onDone}>Done</PrimaryButton>
			</div>
		</div>
	);
}
