"use client";

import { useState } from "react";
import { Chevron, Field, PrimaryButton } from "@/components/onramp/chrome";
import { theme } from "@/lib/theme";
import {
	DOCUMENT_TYPES,
	SAMPLE_DRAFT,
	type VerificationDraft,
	validateDraft,
} from "@/lib/verifications";

function SectionLabel({ children }: { children: React.ReactNode }) {
	return (
		<div
			style={{
				color: theme.faint,
				fontSize: 11,
				fontWeight: 700,
				letterSpacing: "0.08em",
				textTransform: "uppercase",
				margin: "6px 0 -2px",
			}}
		>
			{children}
		</div>
	);
}

function UploadSlot({ slot }: { slot: string }) {
	const [filename, setFilename] = useState("");

	return (
		<label
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				gap: 12,
				padding: "12px 14px",
				borderRadius: 12,
				border: `1px dashed ${filename ? theme.accent : "rgba(255,255,255,0.18)"}`,
				background: theme.row,
				cursor: "pointer",
			}}
		>
			<span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
				<span style={{ fontSize: 13.5, fontWeight: 600 }}>{slot}</span>
				<span style={{ color: theme.faint, fontSize: 11.5 }}>
					{filename || "PNG or JPG"}
				</span>
			</span>
			<span
				style={{
					color: filename ? theme.positive : theme.accent,
					fontSize: 12,
					fontWeight: 700,
				}}
			>
				{filename ? "Attached" : "Upload"}
			</span>
			<input
				type="file"
				accept="image/png,image/jpeg"
				onChange={(event) => setFilename(event.target.files?.[0]?.name ?? "")}
				style={{ display: "none" }}
			/>
		</label>
	);
}

export function VerifyFormStep({
	onSubmitted,
}: {
	onSubmitted: (draft: VerificationDraft) => void;
}) {
	const [draft, setDraft] = useState<VerificationDraft>(SAMPLE_DRAFT);
	const [error, setError] = useState<string | null>(null);

	const set = (patch: Partial<VerificationDraft>) => {
		setDraft((current) => ({ ...current, ...patch }));
		setError(null);
	};

	const documentType =
		DOCUMENT_TYPES.find((option) => option.value === draft.document_type) ??
		DOCUMENT_TYPES[0]!;

	const submit = () => {
		const problem = validateDraft(draft);
		if (problem) {
			setError(problem);
			return;
		}
		onSubmitted(draft);
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
			<p
				style={{
					color: theme.muted,
					fontSize: 13,
					lineHeight: 1.5,
					margin: "0 0 2px",
				}}
			>
				These are the fields the verifications API accepts for an individual.
			</p>

			<SectionLabel>Personal details</SectionLabel>
			<div style={{ display: "flex", gap: 10 }}>
				<Field
					label="First name"
					value={draft.first_name}
					onChange={(next) => set({ first_name: next })}
				/>
				<Field
					label="Last name"
					value={draft.last_name}
					onChange={(next) => set({ last_name: next })}
				/>
			</div>
			<div style={{ display: "flex", gap: 10 }}>
				<Field
					label="Date of birth"
					value={draft.date_of_birth}
					onChange={(next) => set({ date_of_birth: next })}
					placeholder="YYYY-MM-DD"
				/>
				<Field
					label="Phone"
					value={draft.phone}
					onChange={(next) => set({ phone: next })}
				/>
			</div>
			<Field
				label="Tax identification number"
				value={draft.tax_identification_number}
				onChange={(next) => set({ tax_identification_number: next })}
			/>

			<SectionLabel>Residential address</SectionLabel>
			<Field
				label="Address"
				value={draft.line1}
				onChange={(next) => set({ line1: next })}
			/>
			<div style={{ display: "flex", gap: 10 }}>
				<Field
					label="City"
					value={draft.city}
					onChange={(next) => set({ city: next })}
				/>
				<Field
					label="State"
					value={draft.state}
					onChange={(next) => set({ state: next })}
				/>
			</div>
			<div style={{ display: "flex", gap: 10 }}>
				<Field
					label="Postal code"
					value={draft.postal_code}
					onChange={(next) => set({ postal_code: next })}
				/>
				<Field
					label="Country"
					value={draft.country}
					onChange={(next) => set({ country: next })}
				/>
			</div>

			<SectionLabel>Identity document</SectionLabel>
			<label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
				<span style={{ color: theme.faint, fontSize: 12 }}>Document type</span>
				<span style={{ position: "relative", display: "block" }}>
					<select
						className="field"
						value={draft.document_type}
						onChange={(event) => set({ document_type: event.target.value })}
						style={{
							width: "100%",
							padding: "12px 38px 12px 14px",
							borderRadius: 12,
							border: `1px solid ${theme.border}`,
							background: theme.row,
							color: theme.text,
							fontFamily: "inherit",
							fontSize: 14.5,
							appearance: "none",
							cursor: "pointer",
						}}
					>
						{DOCUMENT_TYPES.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
					<span
						style={{
							position: "absolute",
							right: 13,
							top: "50%",
							marginTop: -7,
							pointerEvents: "none",
							display: "flex",
						}}
					>
						<Chevron direction="down" color={theme.muted} />
					</span>
				</span>
			</label>

			{documentType.slots.map((slot) => (
				<UploadSlot key={`${documentType.value}-${slot}`} slot={slot} />
			))}

			{error ? (
				<p style={{ color: theme.negative, fontSize: 13, margin: "2px 0 0" }}>
					{error}
				</p>
			) : null}

			<PrimaryButton onClick={submit}>Submit for review</PrimaryButton>
		</div>
	);
}
