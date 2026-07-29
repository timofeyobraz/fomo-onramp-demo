"use client";

import { PrimaryButton } from "@/components/onramp/chrome";
import { theme } from "@/lib/theme";
import {
	STATUS_BLURBS,
	STATUS_COLORS,
	type Verification,
	type VerificationStatus,
} from "@/lib/verifications";

function StatusPill({ status }: { status: VerificationStatus }) {
	const color = STATUS_COLORS[status] ?? theme.muted;

	return (
		<span
			style={{
				display: "inline-flex",
				alignItems: "center",
				gap: 8,
				padding: "5px 12px",
				borderRadius: 999,
				background: theme.row,
				color,
				fontSize: 12.5,
				fontWeight: 600,
				whiteSpace: "nowrap",
			}}
		>
			<span
				style={{ width: 7, height: 7, borderRadius: "50%", background: color }}
			/>
			{status.replaceAll("_", " ")}
		</span>
	);
}

export function VerifyStep({
	verifications,
	onStart,
}: {
	verifications: Verification[];
	onStart: () => void;
}) {
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
			<p
				style={{
					color: theme.muted,
					fontSize: 13.5,
					lineHeight: 1.5,
					margin: 0,
				}}
			>
				Larger bank transfers need a verified identity. Whop collects it once and
				attests the result.
			</p>

			{verifications.length === 0 ? (
				<p style={{ color: theme.faint, fontSize: 13.5, margin: "4px 0 0" }}>
					No verifications yet.
				</p>
			) : (
				verifications.map((verification) => (
					<div
						key={verification.id}
						style={{
							borderRadius: 14,
							border: `1px solid ${theme.border}`,
							background: theme.row,
							padding: 14,
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								gap: 12,
							}}
						>
							<span style={{ minWidth: 0 }}>
								<span
									style={{
										display: "block",
										fontSize: 15,
										fontWeight: 600,
									}}
								>
									{verification.first_name} {verification.last_name}
								</span>
								<span
									style={{
										display: "block",
										color: theme.faint,
										fontSize: 12,
										marginTop: 3,
									}}
								>
									{verification.id}
								</span>
							</span>
							<StatusPill status={verification.status} />
						</div>
						<p
							style={{
								color: theme.muted,
								fontSize: 12.5,
								lineHeight: 1.45,
								margin: "10px 0 0",
							}}
						>
							{STATUS_BLURBS[verification.status]}
						</p>
					</div>
				))
			)}

			<PrimaryButton onClick={onStart}>
				{verifications.length ? "Start another verification" : "Start verification"}
			</PrimaryButton>
		</div>
	);
}
