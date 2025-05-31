"use client";

import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Info } from "lucide-react";
import SidebarNav from "./SidebarNav";
import { useSheetStore } from "@/hooks/use-sheet-store";
import Link from "next/link";

export function ClientSideNavigation() {
	const [isMobile, setIsMobile] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const { isOpen, setIsOpen } = useSheetStore();

	// Handle mobile detection and mounting
	useEffect(() => {
		setIsMounted(true);
		const checkScreenSize = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);
		return () => window.removeEventListener("resize", checkScreenSize);
	}, []);

	if (!isMounted) return null;

	return (
		<>
			{/* Desktop sidebar */}
			<div className="hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-[280px] lg:w-[300px] xl:w-[280px] z-30 bg-[#FCFCFD] border-r border-[#123772]/10">
				<ScrollArea className="h-full w-full">
					<div className="pt-4 pr-4 pl-4 w-full">
						<SidebarNav />
					</div>
				</ScrollArea>
			</div>

			{/* Mobile sidebar sheet */}
			{isMobile && (
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetContent
						side="left"
						className="w-[85%] sm:w-[380px] pr-0 z-[100000] border-r-[#123772]/10"
					>
						<ScrollArea className="h-full py-6 pr-6">
							<div className="flex items-center gap-3 mb-6">
								<div className="p-2 rounded-lg bg-gradient-to-br from-[#123772] to-[#0b1f42] text-white">
									<Info className="w-4 h-4" />
								</div>
								<Link
									href="/profile"
									className="font-semibold text-[#123772]"
								>
									खजुरा प्रोफाइल
								</Link>
							</div>
							<SidebarNav />
						</ScrollArea>
					</SheetContent>
				</Sheet>
			)}
		</>
	);
}
