'use client'
import Link from "next/link";
import { usePathname } from 'next/navigation'

const Header = () => {
    const pathname = usePathname()
    const isActive = (href:string) => (pathname === href ? 'bg-white text-black' : '')
    return (
        <header className="sticky top-0 left-0 w-full grid gap-5 grid-flow-col auto-cols-max p-5 bg-neutral-900 rounded-lg z-50">
        <Link className={`${isActive('/exercise1')} p-4 md:hover:bg-neutral-700 rounded-lg transition-all duration-200`} href="/exercise1">Exercise 1</Link>
        <Link className={`${isActive('/exercise2')} p-4 md:hover:bg-neutral-700 rounded-lg transition-all duration-200`} href="/exercise2">Exercise 2</Link>
        </header>    )
}

export default Header