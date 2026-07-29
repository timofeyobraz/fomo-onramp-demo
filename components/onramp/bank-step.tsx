"use client";

import { CopyValue } from "@/components/onramp/chrome";
import { theme } from "@/lib/theme";
import type { BankCurrency } from "@/lib/whop";

function VerifyLink({ onClick }: { onClick: () => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			style={{
				marginLeft: "auto",
				padding: "3px 12px",
				borderRadius: 999,
				border: `1px solid ${theme.accent}`,
				background: "none",
				color: theme.accentText,
				fontSize: 11,
				fontWeight: 700,
				fontFamily: "inherit",
				textTransform: "uppercase",
				letterSpacing: "0.06em",
				cursor: "pointer",
			}}
		>
			Verify identity
		</button>
	);
}

export function BankStep({
	currency,
	onVerify,
}: {
	currency: BankCurrency | undefined;
	onVerify: () => void;
}) {
	if (!currency) {
		return (
			<p style={{ color: theme.muted, fontSize: 14, margin: 0 }}>
				Bank details are still being provisioned for this account. Crypto is ready
				now — check back shortly for wire instructions.
			</p>
		);
	}

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
			<div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
				{currency.rails.map((rail) => (
					<span
						key={rail}
						style={{
							padding: "3px 10px",
							borderRadius: 999,
							border: `1px solid ${theme.border}`,
							background: theme.accentSoft,
							color: theme.heading,
							fontSize: 11,
							fontWeight: 600,
							textTransform: "uppercase",
							letterSpacing: "0.06em",
						}}
					>
						{rail}
					</span>
				))}
				<VerifyLink onClick={onVerify} />
			</div>
			<CopyValue label="Account number" value={currency.account_number} />
			<CopyValue label="Routing number" value={currency.routing_number} />
			<CopyValue label="Beneficiary" value={currency.deposit_beneficiary_name} />
			<CopyValue label="Bank" value={currency.deposit_bank_name} />
			<CopyValue label="Bank address" value={currency.deposit_bank_address} />
			<CopyValue label="Reference" value={currency.deposit_reference} />
			<CopyValue label="SWIFT / BIC" value={currency.swift_bic} />
		</div>
	);
}
