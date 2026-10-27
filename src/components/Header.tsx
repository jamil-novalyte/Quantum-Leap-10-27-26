import React from 'react';
import { Flame, Headphones, CheckSquare, BrainCircuit, Library, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'manifesto' | 'habits' | 'reflection' | 'vault' | 'ambient';
  setActiveTab: (tab: 'manifesto' | 'habits' | 'reflection' | 'vault' | 'ambient') => void;
  onQuickTTSPlay: () => void;
  isTTSGenerating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onQuickTTSPlay,
  isTTSGenerating,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E5E9E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#009B87] text-white flex items-center justify-center font-bold text-lg shadow-sm">
            N
          </div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('manifesto');
            }}
            className="text-lg font-extrabold tracking-tight text-[#171D27] hover:text-[#009B87] transition-colors whitespace-nowrap"
          >
            Novalyte AI <span className="text-[#009B87] font-normal">// Founder Studio</span>
          </a>
        </div>

        {/* Zone 2: Navigation Links (Single-Line Text Controls) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#F3FCF8] p-1 rounded-xl border border-[#E5E9E7]">
          <button
            onClick={() => setActiveTab('manifesto')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'manifesto'
                ? 'bg-white text-[#005F58] shadow-sm'
                : 'text-[#626B78] hover:text-[#171D27] hover:bg-white/50'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#009B87]" />
            Manifesto Reader
          </button>

          <button
            onClick={() => setActiveTab('habits')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'habits'
                ? 'bg-white text-[#005F58] shadow-sm'
                : 'text-[#626B78] hover:text-[#171D27] hover:bg-white/50'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-[#009B87]" />
            Daily Command
          </button>

          <button
            onClick={() => setActiveTab('reflection')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'reflection'
                ? 'bg-white text-[#005F58] shadow-sm'
                : 'text-[#626B78] hover:text-[#171D27] hover:bg-white/50'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-[#009B87]" />
            AI Reflection
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'vault'
                ? 'bg-white text-[#005F58] shadow-sm'
                : 'text-[#626B78] hover:text-[#171D27] hover:bg-white/50'
            }`}
          >
            <Library className="w-3.5 h-3.5 text-[#009B87]" />
            Knowledge Vault
          </button>

          <button
            onClick={() => setActiveTab('ambient')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'ambient'
                ? 'bg-white text-[#005F58] shadow-sm'
                : 'text-[#626B78] hover:text-[#171D27] hover:bg-white/50'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-[#009B87]" />
            Ambient Focus
          </button>
        </nav>

        {/* Zone 3: Primary Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onQuickTTSPlay}
            disabled={isTTSGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-[#009B87] hover:bg-[#007F73] text-white text-xs font-bold rounded-lg transition-colors shadow-sm disabled:opacity-60 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            {isTTSGenerating ? 'Synthesizing Audio...' : 'Listen to Quantum Fusion'}
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex items-center justify-around bg-[#F3FCF8] border-t border-[#E5E9E7] py-2 px-1">
        <button
          onClick={() => setActiveTab('manifesto')}
          className={`px-2 py-1 text-xs font-medium rounded ${activeTab === 'manifesto' ? 'bg-[#009B87] text-white' : 'text-[#626B78]'}`}
        >
          Reader
        </button>
        <button
          onClick={() => setActiveTab('habits')}
          className={`px-2 py-1 text-xs font-medium rounded ${activeTab === 'habits' ? 'bg-[#009B87] text-white' : 'text-[#626B78]'}`}
        >
          Command
        </button>
        <button
          onClick={() => setActiveTab('reflection')}
          className={`px-2 py-1 text-xs font-medium rounded ${activeTab === 'reflection' ? 'bg-[#009B87] text-white' : 'text-[#626B78]'}`}
        >
          Reflection
        </button>
        <button
          onClick={() => setActiveTab('vault')}
          className={`px-2 py-1 text-xs font-medium rounded ${activeTab === 'vault' ? 'bg-[#009B87] text-white' : 'text-[#626B78]'}`}
        >
          Vault
        </button>
        <button
          onClick={() => setActiveTab('ambient')}
          className={`px-2 py-1 text-xs font-medium rounded ${activeTab === 'ambient' ? 'bg-[#009B87] text-white' : 'text-[#626B78]'}`}
        >
          Focus
        </button>
      </div>
    </header>
  );
};
