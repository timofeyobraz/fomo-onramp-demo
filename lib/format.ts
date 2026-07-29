export function formatAmount(raw: string) {
	const [whole = "", decimals] = raw.split(".");
	const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return decimals === undefined ? grouped : `${grouped}.${decimals}`;
}

export function parseAmount(input: string) {
	const [whole = "", ...decimals] = input.replace(/[^\d.]/g, "").split(".");
	return decimals.length > 0
		? `${whole}.${decimals.join("").slice(0, 2)}`
		: whole;
}

export function usd(amount: number) {
	return `$${formatAmount(amount.toFixed(2))}`;
}
