import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const sans = Space_Grotesk({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
	title: "fomo — onramp demo",
	description:
		"A card-first onramp powered by the Whop deposits API, with saved cards and an add-a-card flow.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={sans.className}>
			<body>
				<div className="sky" aria-hidden="true">
					<div className="earth" />
				</div>
				{children}
			</body>
		</html>
	);
}
