"use client";

import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useEffect, useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { Routes } from "@/lib/routes";
import NavLink from "./navLink";
import { Separator } from "../ui/separator";
import ThemeToggle from "../theme";

const collapsibleTriggerIconClass = 'col-start-1 row-start-1 transition-opacity duration-300';

export default function Navbar() {
    const isScreenLarge = useMediaQuery("(min-width: 768px)");
    const [isNavbarOpen, setNavbarOpen] = useState(false);

    useEffect(() => setNavbarOpen(false), [isScreenLarge])

    return (
        <>
            <nav className={cn('flex justify-between flex-shrink-0 w-full h-max py-1 px-2 md:px-8 border-b shadow')}>
                <Collapsible
                    open={isNavbarOpen}
                    onOpenChange={setNavbarOpen}
                    className={cn('flex flex-wrap flex-grow justify-between items-stretch h-max')}
                >
                    <CollapsibleTrigger className={cn('group inline-grid md:hidden items-center')}>
                        <MenuIcon className={cn('opacity-100 group-data-[state=open]:opacity-0', collapsibleTriggerIconClass)} />
                        <XIcon className={cn('opacity-0 group-data-[state=open]:opacity-100', collapsibleTriggerIconClass)} />
                    </CollapsibleTrigger>
                    <div className={cn('flex flex-grow md:flex-grow-0 items-center justify-between ms-2 my-4')}>
                        <h1 className={cn('text-lg font-bold')}>Chroni-Companion</h1>
                    </div>
                    <div className={cn("flex items-center md:order-last")}>
                        <ThemeToggle />
                    </div>
                    <div className={cn("hidden md:flex flex-wrap items-center justify-around my-2 space-x-2")}>
                        {
                            Routes.map(
                                route => (
                                    <NavLink
                                        key={route.href}
                                        href={route.href}
                                    >
                                        <h3>{route.label}</h3>
                                    </NavLink>
                                )
                            )
                        }
                    </div>
                    <CollapsibleContent className={cn("group basis-full md:basis-auto content-center bg-background animate-collapsible-down data-[state=closed]:animate-collapsible-up md:hidden overflow-hidden")}>
                        <Separator />
                        <div className={cn("flex flex-wrap items-center justify-around my-2 space-x-2")}>
                            {
                                Routes.map(
                                    route => (
                                        <NavLink
                                            key={route.href}
                                            href={route.href}
                                        >
                                            <h3>{route.label}</h3>
                                        </NavLink>
                                    )
                                )
                            }
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </nav>
        </>
    )
}