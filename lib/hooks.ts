"use client";

import { useEffect, useState } from "react";
import type { Deposit } from "@/lib/whop";

export function useDeposit() {
	const [deposit, setDeposit] = useState<Deposit | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		fetch("/api/deposits", { method: "POST" })
			.then(async (response) => {
				const payload = await response.json();
				if (!response.ok) {
					throw new Error(payload?.error?.message ?? "Request failed.");
				}
				return payload as Deposit;
			})
			.then((data) => active && setDeposit(data))
			.catch(
				(cause) =>
					active &&
					setError(cause instanceof Error ? cause.message : "Request failed."),
			);

		return () => {
			active = false;
		};
	}, []);

	return { deposit, error, loading: !deposit && !error };
}
