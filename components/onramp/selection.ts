import type { SavedCard } from "@/lib/cards";

export type Selection =
	| { kind: "card"; card: SavedCard }
	| { kind: "bank" }
	| { kind: "crypto" };
