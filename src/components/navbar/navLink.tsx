"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

type NavLinkProps = PropsWithChildren<{
    href: string
}>

export default function NavLink({ href, children }: NavLinkProps) {
    const pathname = usePathname();

    return (
        <>
            <Link
                href={href}
                prefetch
                className={
                    cn(
                        "px-4 py-1.5 hover:bg-accent hover:text-accent-foreground",
                        pathname === href ? "border bg-background shadow-md shadow-border" : ""
                    )
                }
            >
                {children}
            </Link>
        </>
    )
}