const API_BASE = "https://api.whop.com/api/v1";
const API_VERSION = "2026-07-27";

export type BankCurrency = {
	currency: string;
	rails: string[];
	account_number: string | null;
	routing_number: string | null;
	deposit_bank_name: string | null;
	deposit_bank_address: string | null;
	deposit_beneficiary_name: string | null;
	deposit_reference: string | null;
	swift_bic: string | null;
};

export type CryptoNetwork = {
	name: string;
	deposit_address: string | null;
	icon_url: string | null;
	supported_currencies: { name: string; icon_url: string | null }[];
};

export type Deposit = {
	object: "deposit";
	account_id: string | null;
	hosted_url: string | null;
	methods: {
		bank: { currencies: BankCurrency[] } | null;
		crypto: CryptoNetwork[];
	};
	metadata: Record<string, unknown>;
};

export class WhopApiError extends Error {
	constructor(
		readonly status: number,
		readonly type: string,
		message: string,
	) {
		super(message);
		this.name = "WhopApiError";
	}
}

function apiKey() {
	const key = process.env.WHOP_API_KEY;
	if (!key) {
		throw new Error(
			"WHOP_API_KEY is not set. Copy .env.example to .env.local and add your key.",
		);
	}
	return key;
}

export function accountId() {
	const id = process.env.WHOP_COMPANY_ID;
	if (!id) {
		throw new Error(
			"WHOP_COMPANY_ID is not set. Copy .env.example to .env.local and add your company id.",
		);
	}
	return id;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	const response = await fetch(`${API_BASE}${path}`, {
		...init,
		headers: {
			Authorization: `Bearer ${apiKey()}`,
			"Content-Type": "application/json",
			"Api-Version-Date": API_VERSION,
		},
		cache: "no-store",
	});

	const payload = await response.json();

	if (!response.ok) {
		const error = payload?.error ?? {};
		throw new WhopApiError(
			response.status,
			error.type ?? "api_error",
			error.message ?? `Whop API responded with ${response.status}.`,
		);
	}

	return payload as T;
}

export function createDeposit(account: string) {
	return request<Deposit>("/deposits", {
		method: "POST",
		body: JSON.stringify({ destination: account }),
	});
}

export function toErrorResponse(error: unknown) {
	if (error instanceof WhopApiError) {
		return Response.json(
			{ error: { type: error.type, message: error.message } },
			{ status: error.status },
		);
	}

	return Response.json(
		{
			error: {
				type: "server_error",
				message: error instanceof Error ? error.message : "Unexpected error.",
			},
		},
		{ status: 500 },
	);
}
