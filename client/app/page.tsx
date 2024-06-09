"use client";

import Header from "@/components/Header";
import { Heading } from "@/utils/Heading";
import { useState } from "react";

interface Props {}
export default function Home({}: Props) {
	const [open, setOpen] = useState(false);
	const [activeItem, setActiveItem] = useState(0);
	return (
		<>
			<div className="">
				<Heading
					title="Babu Learning"
					description="Platform to become a Software Engineer"
					keywords="Programming,MERN,Redux"
				/>
				<Header open={open} activeItem={activeItem} setOpen={setOpen} />
			</div>
		</>
	);
}
