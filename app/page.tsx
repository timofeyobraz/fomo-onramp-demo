import { OnrampTrigger } from "@/components/onramp/onramp";
import { theme } from "@/lib/theme";

export default function Page() {
	return (
		<main
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: 22,
				padding: 32,
				minHeight: "100vh",
				textAlign: "center",
			}}
		>
			<h1
				style={{
					fontSize: 56,
					fontWeight: 700,
					letterSpacing: "-0.04em",
					color: theme.heading,
					lineHeight: 1,
					margin: 0,
				}}
			>
				fomo
			</h1>
			<p
				style={{
					color: theme.muted,
					margin: 0,
					fontSize: 14.5,
					maxWidth: 340,
					lineHeight: 1.5,
				}}
			>
				Fund your account in seconds — card, bank transfer or crypto.
			</p>
			<OnrampTrigger />
		</main>
	);
}
