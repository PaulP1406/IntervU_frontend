import React from 'react';

const Header = () => {
  return (
    <header className="px-8 py-6 border-b border-slate-800">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">IntervU</h1>
        <span className="text-2xl">🦝</span>
        {/* Logo placeholder - replace emoji with actual logo */}
      </div>
    </header>
  )
}

export default Header;