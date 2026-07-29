"use client";

import { useState } from "react";
import { theme } from "@/lib/theme";

// Space Grotesk has no ‹ / › glyph, so the text characters fall back to a mismatched face.
const CHEVRON_ROTATION = { right: 0, left: 180, down: 90 };

export function Chevron({
	direction = "right",
	size = 14,
	color = theme.faint,
}: {
	direction?: keyof typeof CHEVRON_ROTATION;
	size?: number;
	color?: string;
}) {
	const rotation = CHEVRON_ROTATION[direction];

	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 12 12"
			aria-hidden="true"
			style={{
				color,
				flexShrink: 0,
				transform: rotation ? `rotate(${rotation}deg)` : undefined,
			}}
		>
			<path
				d="M4.5 2.5 L8 6 L4.5 9.5"
				stroke="currentColor"
				strokeWidth="1.6"
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export function Field({
	label,
	value,
	onChange,
	placeholder,
	inputMode,
	maxLength,
	autoFocus,
	trailing,
}: {
	label: string;
	value: string;
	onChange: (next: string) => void;
	placeholder?: string;
	inputMode?: "numeric" | "text";
	maxLength?: number;
	autoFocus?: boolean;
	trailing?: React.ReactNode;
}) {
	return (
		<label style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
			<span style={{ color: theme.faint, fontSize: 12 }}>{label}</span>
			<span style={{ position: "relative", display: "block" }}>
				<input
					className="field"
					value={value}
					onChange={(event) => onChange(event.target.value)}
					placeholder={placeholder}
					inputMode={inputMode}
					maxLength={maxLength}
					// biome-ignore lint/a11y/noAutofocus: the card form opens as its own step
					autoFocus={autoFocus}
					style={{
						width: "100%",
						padding: trailing ? "12px 54px 12px 14px" : "12px 14px",
						borderRadius: 12,
						border: `1px solid ${theme.border}`,
						background: theme.row,
						color: theme.text,
						fontFamily: "inherit",
						fontSize: 14.5,
						fontVariantNumeric: "tabular-nums",
					}}
				/>
				{trailing ? (
					<span
						style={{
							position: "absolute",
							right: 8,
							top: "50%",
							transform: "translateY(-50%)",
							pointerEvents: "none",
						}}
					>
						{trailing}
					</span>
				) : null}
			</span>
		</label>
	);
}

export function Row({
	title,
	subtitle,
	leading,
	trailing,
	onClick,
	selected,
}: {
	title: string;
	subtitle?: string;
	leading: React.ReactNode;
	trailing?: React.ReactNode;
	onClick: () => void;
	selected?: boolean;
}) {
	const [hover, setHover] = useState(false);

	return (
		<button
			type="button"
			onClick={onClick}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			style={{
				display: "flex",
				alignItems: "center",
				gap: 14,
				width: "100%",
				padding: 14,
				borderRadius: 14,
				border: `1px solid ${selected ? theme.accent : theme.border}`,
				background: hover ? theme.rowHover : theme.row,
				color: theme.text,
				fontFamily: "inherit",
				cursor: "pointer",
				textAlign: "left",
				transition: "background-color 150ms, border-color 150ms",
			}}
		>
			{leading}
			<span
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 2,
					flex: 1,
					minWidth: 0,
				}}
			>
				<span style={{ fontSize: 15, fontWeight: 600 }}>{title}</span>
				{subtitle ? (
					<span style={{ fontSize: 12.5, color: theme.muted }}>{subtitle}</span>
				) : null}
			</span>
			{trailing ?? <Chevron />}
		</button>
	);
}

export function PrimaryButton({
	children,
	onClick,
	disabled,
}: {
	children: React.ReactNode;
	onClick: () => void;
	disabled?: boolean;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			style={{
				width: "100%",
				marginTop: 4,
				padding: "13px 0",
				borderRadius: 12,
				border: "none",
				background: disabled ? "rgba(96, 106, 247, 0.35)" : theme.accent,
				color: "#ffffff",
				fontSize: 15,
				fontWeight: 700,
				fontFamily: "inherit",
				cursor: disabled ? "default" : "pointer",
				transition: "background-color 150ms",
			}}
		>
			{children}
		</button>
	);
}

export function Divider({ label }: { label: string }) {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: 10,
				margin: "6px 0 2px",
			}}
		>
			<span style={{ height: 1, flex: 1, background: theme.border }} />
			<span
				style={{
					color: theme.faint,
					fontSize: 11,
					fontWeight: 600,
					letterSpacing: "0.08em",
					textTransform: "uppercase",
				}}
			>
				{label}
			</span>
			<span style={{ height: 1, flex: 1, background: theme.border }} />
		</div>
	);
}

export function CopyValue({ label, value }: { label: string; value: string | null }) {
	const [copied, setCopied] = useState(false);

	if (!value) return null;

	return (
		<button
			type="button"
			onClick={() => {
				navigator.clipboard.writeText(value);
				setCopied(true);
				setTimeout(() => setCopied(false), 1500);
			}}
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				gap: 12,
				width: "100%",
				padding: "12px 14px",
				borderRadius: 12,
				border: `1px solid ${theme.border}`,
				background: theme.row,
				color: theme.text,
				fontFamily: "inherit",
				fontSize: 14,
				cursor: "pointer",
				textAlign: "left",
			}}
		>
			<span
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 2,
					minWidth: 0,
				}}
			>
				<span style={{ color: theme.faint, fontSize: 12 }}>{label}</span>
				<span
					style={{
						fontWeight: 500,
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
					}}
				>
					{value}
				</span>
			</span>
			<span
				style={{
					color: copied ? theme.positive : theme.accent,
					fontSize: 12,
					fontWeight: 600,
					flexShrink: 0,
				}}
			>
				{copied ? "Copied" : "Copy"}
			</span>
		</button>
	);
}
