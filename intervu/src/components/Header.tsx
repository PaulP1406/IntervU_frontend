import React from 'react';

const Header = () => {
    return(
    <header className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">IntervU</h1>
            <div className="w-8 h-8 bg-slate-700 rounded"></div>
          </div>
        </div>
      </header>
      )
}

export default Header;