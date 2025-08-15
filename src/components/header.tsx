'use client';
import { MobileNav } from './mobile-nav';

export default function Header({ title }: { title: string }) {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
        <MobileNav />
        <div className="flex-1">
            <h1 className="font-semibold text-lg">{title}</h1>
        </div>
    </header>
  );
}
