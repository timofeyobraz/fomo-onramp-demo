import { accountId, createDeposit, toErrorResponse } from "@/lib/whop";

export async function POST() {
	try {
		return Response.json(await createDeposit(accountId()));
	} catch (error) {
		return toErrorResponse(error);
	}
}
