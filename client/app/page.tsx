"use client";

import { Heading } from "@/utils/Heading";

interface Props {}
export default function Home({}: Props) {
	return (
		<>
			<div className="">
				<Heading
					title="Babu Learning"
					description="Platform to become a Software Engineer"
					keywords="Programming,MERN,Redux"
				/>
			</div>
		</>
	);
}
