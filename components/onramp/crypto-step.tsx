"use client";

import { CopyValue, Row } from "@/components/onramp/chrome";
import { theme } from "@/lib/theme";
import type { CryptoNetwork } from "@/lib/whop";

function NetworkIcon({ network }: { network: CryptoNetwork }) {
	if (!network.icon_url) {
		return <span style={{ width: 24, height: 24, flexShrink: 0 }} />;
	}
	return (
		<img
			src={network.icon_url}
			alt=""
			width={24}
			height={24}
			style={{ borderRadius: "50%", flexShrink: 0 }}
		/>
	);
}

function TokenStack({ network }: { network: CryptoNetwork }) {
	const extra = network.supported_currencies.length - 4;

	return (
		<span style={{ display: "flex", gap: 4, alignItems: "center" }}>
			{network.supported_currencies.slice(0, 4).map((currency) =>
				currency.icon_url ? (
					<img
						key={currency.name}
						src={currency.icon_url}
						alt={currency.name}
						width={16}
						height={16}
						style={{ borderRadius: "50%", opacity: 0.8 }}
					/>
				) : null,
			)}
			{extra > 0 ? (
				<span style={{ color: theme.faint, fontSize: 11 }}>+{extra}</span>
			) : null}
		</span>
	);
}

export function CryptoNetworksStep({
	networks,
	onSelect,
}: {
	networks: CryptoNetwork[];
	onSelect: (network: CryptoNetwork) => void;
}) {
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
			{networks.map((network) => (
				<Row
					key={network.name}
					leading={<NetworkIcon network={network} />}
					title={network.name}
					onClick={() => onSelect(network)}
					trailing={<TokenStack network={network} />}
				/>
			))}
		</div>
	);
}

export function CryptoAddressStep({ network }: { network: CryptoNetwork }) {
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
			<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
				<NetworkIcon network={network} />
				<span style={{ fontSize: 16, fontWeight: 700 }}>{network.name}</span>
			</div>

			{network.deposit_address ? (
				<CopyValue label="Deposit address" value={network.deposit_address} />
			) : (
				<p style={{ color: theme.muted, fontSize: 13.5, margin: 0 }}>
					This network's address is still being provisioned for the account. It
					usually appears within a few seconds — reopen this screen to check.
				</p>
			)}

			<div>
				<div style={{ color: theme.faint, fontSize: 12, margin: "4px 2px 6px" }}>
					Accepted tokens
				</div>
				<div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
					{network.supported_currencies.map((currency) => (
						<span
							key={currency.name}
							style={{
								display: "flex",
								alignItems: "center",
								gap: 6,
								padding: "4px 10px",
								borderRadius: 999,
								border: `1px solid ${theme.border}`,
								background: theme.row,
								fontSize: 12,
								fontWeight: 600,
							}}
						>
							{currency.icon_url ? (
								<img
									src={currency.icon_url}
									alt=""
									width={14}
									height={14}
									style={{ borderRadius: "50%" }}
								/>
							) : null}
							{currency.name}
						</span>
					))}
				</div>
			</div>

			{network.deposit_address ? (
				<p style={{ color: theme.faint, fontSize: 12, margin: "4px 2px 0" }}>
					Only send supported tokens on {network.name}. Deposits on other networks
					may be lost.
				</p>
			) : null}
		</div>
	);
}
