"use client";
import NavItems from "@/utils/NavItems";
import Link from "next/link";
import React, { useState } from "react";

type Props = {
	open: boolean;
	setOpen: (open: boolean) => void;
	activeItem: number;
};

export default function Header({ activeItem }: Props) {
	const [active, setActive] = useState(false);
	const [openSidebar, setOpenSidebar] = useState(0);

	if (typeof window !== "undefined") {
		window.addEventListener("scroll", () => {
			if (window.scrollY > 85) {
				setActive(true);
			} else {
				setActive(false);
			}
		});
	}
	return (
		<>
			<div className="w-full relative">
				<div
					className={`${
						active
							? "dark:bg-opacity-50 dark:bg-gradient-t-br dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#fffffff1c] shadow-xl transition duration-500 "
							: "w-full border-b dark:border-[#fffffff1c] h-[80px] z-[80] dark:shadow "
					}`}
				>
					<div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full ">
						<div className="w-full h-[80px] flex items-center justify-between p-3">
							<div>
								<Link
									href={"/"}
									className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}
								>
									Babu Learning
								</Link>
							</div>
							<div className="flex items-center">
								<NavItems activeItem={activeItem} isMobile={false} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
