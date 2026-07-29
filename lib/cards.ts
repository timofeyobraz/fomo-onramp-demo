export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "card";

export type SavedCard = {
	id: string;
	brand: CardBrand;
	last4: string;
	expMonth: string;
	expYear: string;
	holder: string;
};

export const BRAND_LABELS: Record<CardBrand, string> = {
	visa: "Visa",
	mastercard: "Mastercard",
	amex: "Amex",
	discover: "Discover",
	card: "Card",
};

// What fits on a 46px chip.
export const BRAND_SHORT: Record<CardBrand, string> = {
	visa: "VISA",
	mastercard: "MC",
	amex: "AMEX",
	discover: "DISC",
	card: "CARD",
};

export const BRAND_GRADIENTS: Record<CardBrand, string> = {
	visa: "linear-gradient(135deg, #1a2b6b 0%, #4650d8 100%)",
	mastercard: "linear-gradient(135deg, #3a1f2b 0%, #b4453f 100%)",
	amex: "linear-gradient(135deg, #0b3a5e 0%, #1f83bd 100%)",
	discover: "linear-gradient(135deg, #4a3410 0%, #d98b2b 100%)",
	card: "linear-gradient(135deg, #1a1a2e 0%, #3d3d63 100%)",
};

// Cards on the payer's file. Whop's deposit API never returns or charges cards — the
// element emits cardDepositRequested and the host settles it — so these stand in for
// whatever payment processor you already use.
export const INITIAL_CARDS: SavedCard[] = [
	{
		id: "pm_demo_visa",
		brand: "visa",
		last4: "4242",
		expMonth: "12",
		expYear: "29",
		holder: "A. MORGAN",
	},
	{
		id: "pm_demo_mc",
		brand: "mastercard",
		last4: "5556",
		expMonth: "04",
		expYear: "28",
		holder: "A. MORGAN",
	},
];

// Percentage POINTS and major units, matching the shape the deposit element takes.
export const CARD_FEE = { percentageFee: 2.9, fixedFee: 0.3 };

// Rounded to whole cents so the deposit, fee and total lines can never disagree by a cent.
export function estimateCardFee(amount: number) {
	const cents =
		Math.round(amount * CARD_FEE.percentageFee) +
		Math.round(CARD_FEE.fixedFee * 100);
	return cents / 100;
}

export function digitsOf(value: string) {
	return value.replace(/\D/g, "");
}

export function detectBrand(value: string): CardBrand {
	const digits = digitsOf(value);
	if (/^4/.test(digits)) return "visa";
	if (/^3[47]/.test(digits)) return "amex";
	if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(digits)) return "mastercard";
	if (/^(6011|65|64[4-9])/.test(digits)) return "discover";
	return "card";
}

export function numberLengthFor(brand: CardBrand) {
	return brand === "amex" ? 15 : 16;
}

export function cvcLengthFor(brand: CardBrand) {
	return brand === "amex" ? 4 : 3;
}

export function formatCardNumber(value: string) {
	const brand = detectBrand(value);
	const digits = digitsOf(value).slice(0, numberLengthFor(brand));
	const groups = brand === "amex" ? [4, 6, 5] : [4, 4, 4, 4];

	const parts: string[] = [];
	let cursor = 0;
	for (const size of groups) {
		if (cursor >= digits.length) break;
		parts.push(digits.slice(cursor, cursor + size));
		cursor += size;
	}
	return parts.join(" ");
}

export function formatExpiry(value: string) {
	const digits = digitsOf(value).slice(0, 4);
	if (digits.length <= 2) return digits;
	return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function passesLuhn(value: string) {
	const digits = digitsOf(value);
	if (digits.length < 12) return false;

	let sum = 0;
	let double = false;
	for (let index = digits.length - 1; index >= 0; index -= 1) {
		let digit = Number(digits[index]);
		if (double) {
			digit *= 2;
			if (digit > 9) digit -= 9;
		}
		sum += digit;
		double = !double;
	}
	return sum % 10 === 0;
}

export type CardDraft = {
	number: string;
	expiry: string;
	cvc: string;
	holder: string;
};

export function validateDraft(draft: CardDraft) {
	const brand = detectBrand(draft.number);
	const digits = digitsOf(draft.number);
	const [month = "", year = ""] = draft.expiry.split("/");

	if (digits.length !== numberLengthFor(brand)) return "Card number looks incomplete.";
	if (!passesLuhn(digits)) return "That card number isn't valid.";
	if (month.length !== 2 || year.length !== 2) return "Add an expiry date as MM/YY.";
	if (Number(month) < 1 || Number(month) > 12) return "That expiry month isn't valid.";
	if (isExpired(month, year)) return "That card has expired.";
	if (draft.cvc.length !== cvcLengthFor(brand)) {
		return `CVC should be ${cvcLengthFor(brand)} digits.`;
	}
	if (draft.holder.trim().length < 2) return "Add the name on the card.";
	return null;
}

function isExpired(month: string, year: string) {
	const now = new Date();
	const expiryYear = 2000 + Number(year);
	const currentYear = now.getFullYear();
	if (expiryYear < currentYear) return true;
	return expiryYear === currentYear && Number(month) < now.getMonth() + 1;
}

let cardSequence = 0;

export function cardFromDraft(draft: CardDraft): SavedCard {
	const digits = digitsOf(draft.number);
	const [month = "", year = ""] = draft.expiry.split("/");
	cardSequence += 1;

	return {
		// not derived from the card, so adding the same number twice still yields distinct rows
		id: `pm_${digits.slice(-4)}_${cardSequence}`,
		brand: detectBrand(digits),
		last4: digits.slice(-4),
		expMonth: month,
		expYear: year,
		holder: draft.holder.trim().toUpperCase(),
	};
}
