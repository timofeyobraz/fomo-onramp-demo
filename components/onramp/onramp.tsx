"use client";

import { useEffect, useRef, useState } from "react";
import { AddCardStep } from "@/components/onramp/add-card-step";
import { AmountStep } from "@/components/onramp/amount-step";
import { BankStep } from "@/components/onramp/bank-step";
import {
	CryptoAddressStep,
	CryptoNetworksStep,
} from "@/components/onramp/crypto-step";
import { Chevron } from "@/components/onramp/chrome";
import { MethodStep } from "@/components/onramp/method-step";
import { ReviewStep } from "@/components/onramp/review-step";
import { SuccessStep } from "@/components/onramp/success-step";
import type { Selection } from "@/components/onramp/selection";
import { VerifyFormStep } from "@/components/onramp/verify-form-step";
import { VerifyStep } from "@/components/onramp/verify-step";
import { INITIAL_CARDS, type SavedCard } from "@/lib/cards";
import { useDeposit } from "@/lib/hooks";
import { theme } from "@/lib/theme";
import { type Verification, verificationFromDraft } from "@/lib/verifications";
import type { CryptoNetwork } from "@/lib/whop";

type Step =
	| { name: "amount" }
	| { name: "method" }
	| { name: "add-card" }
	| { name: "review" }
	| { name: "success"; amount: number }
	| { name: "bank" }
	| { name: "crypto" }
	| { name: "crypto-address"; network: CryptoNetwork }
	| { name: "verify" }
	| { name: "verify-form" };

const TITLES: Record<Step["name"], string> = {
	amount: "Add money",
	method: "Pay with",
	"add-card": "Add a card",
	review: "Review deposit",
	success: "Deposit complete",
	bank: "Bank transfer",
	crypto: "Choose a network",
	"crypto-address": "Deposit crypto",
	verify: "Identity check",
	"verify-form": "Confirm your details",
};

const BACK: Partial<Record<Step["name"], Step["name"]>> = {
	method: "amount",
	"add-card": "method",
	review: "amount",
	bank: "amount",
	crypto: "amount",
	"crypto-address": "crypto",
	verify: "bank",
	"verify-form": "verify",
};

function Modal({
	title,
	onBack,
	onClose,
	children,
}: {
	title: string;
	onBack?: () => void;
	onClose: () => void;
	children: React.ReactNode;
}) {
	const panel = useRef<HTMLDivElement>(null);

	useEffect(() => {
		panel.current?.focus();

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [onClose]);

	return (
		<div
			role="presentation"
			onClick={onClose}
			className="onramp-backdrop"
			data-animate
			style={{
				position: "fixed",
				inset: 0,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: 20,
				background: "rgba(3, 2, 10, 0.7)",
				backdropFilter: "blur(6px)",
				WebkitBackdropFilter: "blur(6px)",
				zIndex: 50,
			}}
		>
			<div
				ref={panel}
				role="dialog"
				aria-modal="true"
				aria-labelledby="onramp-title"
				tabIndex={-1}
				className="onramp-panel"
				data-animate
				onClick={(event) => event.stopPropagation()}
				style={{
					width: 420,
					maxWidth: "100%",
					maxHeight: "88vh",
					overflowY: "auto",
					borderRadius: 20,
					border: `1px solid ${theme.border}`,
					background: theme.panel,
					padding: 20,
					color: theme.text,
					textAlign: "left",
					boxShadow: "0 24px 80px rgba(0, 0, 0, 0.6)",
					// focused on open so Escape works; the ring belongs on the controls inside
					outline: "none",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						marginBottom: 16,
					}}
				>
					<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
						{onBack ? (
							<button
								type="button"
								onClick={onBack}
								aria-label="Back"
								style={{
									display: "flex",
									alignItems: "center",
									border: "none",
									background: "none",
									cursor: "pointer",
									padding: "2px 2px 2px 0",
								}}
							>
								<Chevron direction="left" size={18} color={theme.muted} />
							</button>
						) : null}
						<h2
							id="onramp-title"
							style={{
								fontSize: 17,
								fontWeight: 700,
								color: theme.heading,
								margin: 0,
							}}
						>
							{title}
						</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close"
						style={{
							border: "none",
							background: "none",
							color: theme.muted,
							fontSize: 18,
							cursor: "pointer",
							padding: 4,
							fontFamily: "inherit",
						}}
					>
						✕
					</button>
				</div>
				{children}
			</div>
		</div>
	);
}

function OnrampFlow({ onClose }: { onClose: () => void }) {
	const { deposit, error, loading } = useDeposit();
	const [cards, setCards] = useState<SavedCard[]>(INITIAL_CARDS);
	const [amount, setAmount] = useState("500");
	const [selection, setSelection] = useState<Selection>({
		kind: "card",
		card: INITIAL_CARDS[0]!,
	});
	const [verifications, setVerifications] = useState<Verification[]>([]);
	const [step, setStep] = useState<Step>({ name: "amount" });

	const numeric = Number(amount) || 0;
	const backTo = BACK[step.name];

	const continueFromAmount = () => {
		if (selection.kind === "card") setStep({ name: "review" });
		else if (selection.kind === "bank") setStep({ name: "bank" });
		else setStep({ name: "crypto" });
	};

	const body = () => {
		switch (step.name) {
			case "amount":
				return (
					<AmountStep
						amount={amount}
						onAmountChange={setAmount}
						selection={selection}
						onChangeMethod={() => setStep({ name: "method" })}
						onContinue={continueFromAmount}
					/>
				);
			case "method":
				return (
					<MethodStep
						cards={cards}
						selection={selection}
						onSelectCard={(card) => {
							setSelection({ kind: "card", card });
							setStep({ name: "amount" });
						}}
						onAddCard={() => setStep({ name: "add-card" })}
						onSelectBank={() => {
							setSelection({ kind: "bank" });
							setStep({ name: "bank" });
						}}
						onSelectCrypto={() => {
							setSelection({ kind: "crypto" });
							setStep({ name: "crypto" });
						}}
					/>
				);
			case "add-card":
				return (
					<AddCardStep
						onAdded={(card) => {
							setCards((current) => [...current, card]);
							setSelection({ kind: "card", card });
							setStep({ name: "amount" });
						}}
					/>
				);
			case "review":
				return selection.kind === "card" ? (
					<ReviewStep
						card={selection.card}
						amount={numeric}
						onConfirmed={() => setStep({ name: "success", amount: numeric })}
					/>
				) : null;
			case "success":
				return <SuccessStep amount={step.amount} onDone={onClose} />;
			case "bank":
				if (loading) return <Pending>Loading bank details…</Pending>;
				if (error) return <Failed>{error}</Failed>;
				return (
					<BankStep
						currency={deposit?.methods.bank?.currencies[0]}
						onVerify={() => setStep({ name: "verify" })}
					/>
				);
			case "verify":
				return (
					<VerifyStep
						verifications={verifications}
						onStart={() => setStep({ name: "verify-form" })}
					/>
				);
			case "verify-form":
				return (
					<VerifyFormStep
						onSubmitted={(draft) => {
							setVerifications((current) => [
								verificationFromDraft(draft, new Date().toISOString()),
								...current,
							]);
							setStep({ name: "verify" });
						}}
					/>
				);
			case "crypto":
				if (loading) return <Pending>Loading networks…</Pending>;
				if (error) return <Failed>{error}</Failed>;
				return (
					<CryptoNetworksStep
						networks={deposit?.methods.crypto ?? []}
						onSelect={(network) => setStep({ name: "crypto-address", network })}
					/>
				);
			case "crypto-address":
				return <CryptoAddressStep network={step.network} />;
		}
	};

	return (
		<Modal
			title={TITLES[step.name]}
			onBack={backTo ? () => setStep({ name: backTo } as Step) : undefined}
			onClose={onClose}
		>
			{body()}
		</Modal>
	);
}

function Pending({ children }: { children: React.ReactNode }) {
	return (
		<p style={{ color: theme.muted, fontSize: 14, margin: 0 }}>{children}</p>
	);
}

function Failed({ children }: { children: React.ReactNode }) {
	return (
		<p style={{ color: theme.negative, fontSize: 14, margin: 0 }}>{children}</p>
	);
}

export function OnrampTrigger() {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				style={{
					padding: "13px 0",
					width: 210,
					borderRadius: 12,
					border: `1px solid ${theme.border}`,
					background: "rgba(96, 106, 247, 0.5)",
					backdropFilter: "blur(12px)",
					WebkitBackdropFilter: "blur(12px)",
					color: "#ffffff",
					fontSize: 17,
					fontWeight: 700,
					fontFamily: "inherit",
					cursor: "pointer",
				}}
			>
				Add money
			</button>
			{open ? <OnrampFlow onClose={() => setOpen(false)} /> : null}
		</>
	);
}
