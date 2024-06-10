import Link from "next/link";
import React from "react";

export const navItemsData = [
	{
		name: "Home",
		href: "/",
	},
	{
		name: "Courses",
		href: "/courses",
	},
	{
		name: "About",
		href: "/about",
	},
	{
		name: "Policy",
		href: "/policy",
	},
	{
		name: "FAQ",
		href: "/faq",
	},
];
type Props = {
	activeItem: number;
	isMobile: boolean;
};

export default function NavItems({ activeItem, isMobile }: Props) {
	return (
		<>
			<div className="hidden 800px:flex">
				{navItemsData &&
					navItemsData.map((item, index) => (
						<Link href={`${item.href}`} passHref key={index}>
							<span
								className={`
                    ${
											activeItem == index
												? "dark:text-[#37a39a] text-[crimson] "
												: "dark:text-white text-black "
										} text-[18px] px-6 font-Poppin font-[400]
                    `}
							>
								{item.name}
							</span>
						</Link>
					))}
			</div>

			{isMobile && (
				<>
					<div className="800px:hidden mt-5">
						<div className="w-full text-center py-5">
							<Link href="/" passHref>
								<span className="text-[25px] font-Poppins font-[500] text-black dark:text-white">
									Babu Learning
								</span>
							</Link>
						</div>
						{navItemsData.map((item, index) => (
							<Link href={`${item.href}`} passHref key={index}>
								<span
									className={`
                ${
									activeItem == index
										? "dark:text-[#37a39a] text-[crimson] "
										: "dark:text-white text-black "
								} text-[18px] px-6 font-Poppins font-[400]
                `}
								>
									{item.name}
								</span>
							</Link>
						))}
					</div>
				</>
			)}
		</>
	);
}
