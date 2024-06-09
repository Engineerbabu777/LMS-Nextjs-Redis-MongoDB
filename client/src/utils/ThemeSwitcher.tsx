"use client";

import { BiMoon, BiSun } from "react-icons/bi";

import React, { useEffect } from "react";
import { useTheme } from "next-themes";

type Props = {};

export default function ThemeSwitcher({}: Props) {
	const [mounted, setmounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setmounted(true);
	}, []);

	if (!mounted) return null;
	return (
		<>
			<div className="flex items-center justify-center mx-4">
				{theme === "light" ? (
					<>
						<BiMoon
							className="cursor-pointer"
							fill="black"
							size={25}
							onClick={() => setTheme("dark")}
						/>
					</>
				) : (
					<>
						<BiSun
							size={25}
							className="cursor-pointer"
							onClick={() => setTheme("light")}
						/>
					</>
				)}
			</div>
		</>
	);
}
