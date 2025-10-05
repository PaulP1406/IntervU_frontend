import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 px-16 py-6 bg-[#0a0a0f] z-50">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 w-fit hover:opacity-80 transition-opacity">
          <h1 className="text-4xl font-bold">IntervU</h1>
          <span className="text-2xl">🦝</span>
          {/* Logo placeholder - replace emoji with actual logo */}
        </Link>
        <Link href="/upload">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-8 py-3 rounded-[32px] transition-colors duration-200">
            Practice
          </button>
        </Link>
      </div>
    </header>
  )
}

export default Header;