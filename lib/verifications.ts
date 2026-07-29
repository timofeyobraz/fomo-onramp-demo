import { theme } from "@/lib/theme";

// The statuses Whop's verifications API publishes.
export type VerificationStatus =
	| "not_started"
	| "pending"
	| "processing"
	| "action_required"
	| "approved"
	| "rejected";

export type Verification = {
	id: string;
	kind: "individual" | "business";
	status: VerificationStatus;
	first_name: string;
	last_name: string;
	submitted_at: string;
};

export const STATUS_COLORS: Record<VerificationStatus, string> = {
	not_started: theme.faint,
	pending: theme.warning,
	processing: theme.warning,
	action_required: theme.warning,
	approved: theme.positive,
	rejected: theme.negative,
};

export const STATUS_BLURBS: Record<VerificationStatus, string> = {
	not_started: "No session has been created yet.",
	pending: "Waiting on the applicant to finish the hosted flow.",
	processing: "The provider is reviewing the submitted documents.",
	action_required: "More information is needed before review can continue.",
	approved: "Cleared.",
	rejected: "Declined.",
};

// The slots each document type needs, mirroring the API's own document map.
export const DOCUMENT_TYPES = [
	{ value: "PASSPORT", label: "Passport", slots: ["Front side"] },
	{
		value: "DRIVERS",
		label: "Driver's licence",
		slots: ["Front side", "Back side"],
	},
	{
		value: "ID_CARD",
		label: "National ID card",
		slots: ["Front side", "Back side"],
	},
	{
		value: "RESIDENCE_PERMIT",
		label: "Residence permit",
		slots: ["Front side", "Back side"],
	},
];

// The fields POST /v1/verifications accepts for an individual.
export type VerificationDraft = {
	first_name: string;
	last_name: string;
	date_of_birth: string;
	phone: string;
	tax_identification_number: string;
	line1: string;
	city: string;
	state: string;
	postal_code: string;
	country: string;
	document_type: string;
};

export const EMPTY_DRAFT: VerificationDraft = {
	first_name: "",
	last_name: "",
	date_of_birth: "",
	phone: "",
	tax_identification_number: "",
	line1: "",
	city: "",
	state: "",
	postal_code: "",
	country: "",
	document_type: "PASSPORT",
};

export const SAMPLE_DRAFT: VerificationDraft = {
	first_name: "Alex",
	last_name: "Morgan",
	date_of_birth: "1991-03-08",
	phone: "+1 415 555 0134",
	tax_identification_number: "987-65-4320",
	line1: "2261 Market Street",
	city: "San Francisco",
	state: "CA",
	postal_code: "94114",
	country: "US",
	document_type: "PASSPORT",
};

export function validateDraft(draft: VerificationDraft) {
	if (draft.first_name.trim().length < 2) return "Add a first name.";
	if (draft.last_name.trim().length < 2) return "Add a last name.";
	if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date_of_birth)) {
		return "Add a date of birth.";
	}
	if (draft.line1.trim().length < 4) return "Add a street address.";
	if (draft.city.trim().length < 2) return "Add a city.";
	if (draft.postal_code.trim().length < 3) return "Add a postal code.";
	if (draft.country.trim().length < 2) return "Add a country.";
	return null;
}

let verificationSequence = 0;

// A submitted verification lands in `processing` — the provider has the documents and there
// is nothing for the applicant to do.
export function verificationFromDraft(
	draft: VerificationDraft,
	submittedAt: string,
): Verification {
	verificationSequence += 1;

	return {
		id: `idpf_demo${verificationSequence}`,
		kind: "individual",
		status: "processing",
		first_name: draft.first_name.trim(),
		last_name: draft.last_name.trim(),
		submitted_at: submittedAt,
	};
}
