import React, { useState, useEffect, useRef } from 'react';
import { StageScript } from '../types';
import { Play, Pause, RotateCcw, Volume2, CheckCircle2, Circle, Search, Sparkles, Sliders, Copy, Check } from 'lucide-react';

interface ManifestoReaderProps {
  scripts: StageScript[];
  selectedStageId: string;
  onSelectStage: (stageId: string) => void;
  completedStages: string[];
  onToggleStageComplete: (stageId: string) => void;
  onAddActionItem: (title: string, stageId: string) => void;
}

export const ManifestoReader: React.FC<ManifestoReaderProps> = ({
  scripts,
  selectedStageId,
  onSelectStage,
  completedStages,
  onToggleStageComplete,
  onAddActionItem,
}) => {
  const currentStage = scripts.find((s) => s.id === selectedStageId) || scripts[0];

  const [voiceName, setVoiceName] = useState<string>('Kore');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoadingTTS, setIsLoadingTTS] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [activeLineIndex, setActiveLineIndex] = useState<number>(-1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedLine, setCopiedLine] = useState<string | null>(null);
  const [focusMode, setFocusMode] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCache = useRef<Map<string, string>>(new Map());

  // Cleanup audio object URLs on unmount
  useEffect(() => {
    return () => {
      audioCache.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // Update playback speed when speed changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Generate or fetch cached TTS audio
  const handlePlayTTS = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (audioRef.current && audioUrl) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    const cacheKey = `${currentStage.id}-${voiceName}`;
    if (audioCache.current.has(cacheKey)) {
      const url = audioCache.current.get(cacheKey)!;
      setAudioUrl(url);
      playAudio(url);
      return;
    }

    setIsLoadingTTS(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentStage.fullText,
          voiceName,
          style: 'Clear, grounded, powerful masculine audio manifesto reader',
        }),
      });

      if (!res.ok) {
        throw new Error('TTS generation failed');
      }

      const data = await res.json();
      const binary = atob(data.audioBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
      const createdUrl = URL.createObjectURL(blob);

      audioCache.current.set(cacheKey, createdUrl);
      setAudioUrl(createdUrl);
      playAudio(createdUrl);
    } catch (err) {
      console.error('Error generating stage audio:', err);
      alert('Unable to synthesize TTS audio right now. Please check your Gemini API key configuration.');
    } finally {
      setIsLoadingTTS(false);
    }
  };

  const playAudio = (url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(url);
    audio.playbackRate = playbackSpeed;
    audioRef.current = audio;

    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => {
      setIsPlaying(false);
      setActiveLineIndex(-1);
    };

    // Highlight lines based on audio progress estimation
    audio.ontimeupdate = () => {
      if (audio.duration && currentStage.lines.length > 0) {
        const progress = audio.currentTime / audio.duration;
        const lineIdx = Math.min(
          Math.floor(progress * currentStage.lines.length),
          currentStage.lines.length - 1
        );
        setActiveLineIndex(lineIdx);
      }
    };

    audio.play().catch((e) => console.error('Audio playback failed', e));
  };

  const handleStageChange = (stageId: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    setAudioUrl(null);
    setActiveLineIndex(-1);
    onSelectStage(stageId);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLine(text);
    setTimeout(() => setCopiedLine(null), 2000);
  };

  const isCompleted = completedStages.includes(currentStage.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Stage Selector */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E9E7] shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#EEF1EF] pb-6">
          <div>
            <span className="text-xs font-semibold text-[#009B87] tracking-wider uppercase">
              Page-Mapped Affirmation Script
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171D27] mt-1">
              Jamil's Ascendant Identity Manifestos
            </h1>
            <p className="text-sm text-[#626B78] mt-1">
              7 Stages of Quantum Self-Mastery, Discipline & Permanent Upgrade.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleStageComplete(currentStage.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isCompleted
                  ? 'bg-[#15803D]/10 text-[#15803D] border border-[#15803D]/30'
                  : 'bg-[#F3FCF8] text-[#005F58] hover:bg-[#EAFBF5] border border-[#E5E9E7]'
              }`}
            >
              {isCompleted ? <CheckCircle2 className="w-4 h-4 text-[#15803D]" /> : <Circle className="w-4 h-4" />}
              {isCompleted ? 'Stage Integrated' : 'Mark Stage Complete'}
            </button>

            <button
              onClick={() => setFocusMode(!focusMode)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                focusMode
                  ? 'bg-[#005F58] text-white border-[#005F58]'
                  : 'bg-white text-[#626B78] border-[#E5E9E7] hover:bg-[#F7FAF8]'
              }`}
            >
              {focusMode ? 'Exit Focus Mode' : 'Focus Mode'}
            </button>
          </div>
        </div>

        {/* Stage Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {scripts.map((s) => {
            const active = s.id === selectedStageId;
            const completed = completedStages.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => handleStageChange(s.id)}
                className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  active
                    ? 'bg-[#EAFBF5] border-[#009B87] shadow-sm text-[#005F58]'
                    : 'bg-[#FAF9F6] border-[#E5E9E7] text-[#626B78] hover:bg-white hover:border-[#2DD4BF]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                    {s.stageNumber === 8 ? 'Master' : `Stage ${s.stageNumber}`}
                  </span>
                  {completed && <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />}
                </div>
                <div className="text-xs font-bold line-clamp-1 mt-1 text-[#171D27]">
                  {s.title.split('—')[1] || s.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Script Line Reader */}
        <div className={`space-y-6 ${focusMode ? 'lg:col-span-12' : 'lg:col-span-8'}`}>
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E9E7] shadow-sm space-y-6">
            {/* Header Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EEF1EF] pb-4">
              <div>
                <span className="text-xs font-bold text-[#009B87] uppercase tracking-wider">
                  {currentStage.category} · Read Time ~{currentStage.estimatedReadTime}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#171D27] mt-1">
                  {currentStage.title}
                </h2>
                <p className="text-xs font-medium text-[#626B78] capitalize mt-0.5">
                  ({currentStage.subtitle})
                </p>
              </div>

              {/* Line Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#89919B]" />
                <input
                  type="text"
                  placeholder="Filter lines in stage..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF9F6] border border-[#E5E9E7] rounded-lg focus:outline-none focus:border-[#009B87] text-[#171D27]"
                />
              </div>
            </div>

            {/* Script Text Display */}
            <div className="space-y-3 font-sans text-base sm:text-lg leading-relaxed text-[#171D27]">
              {currentStage.lines
                .filter((line) => line.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((line, idx) => {
                  const isHighlighted = idx === activeLineIndex;
                  return (
                    <div
                      key={idx}
                      className={`p-3 sm:p-4 rounded-xl border transition-all duration-200 group flex items-start justify-between gap-4 ${
                        isHighlighted
                          ? 'bg-[#EAFBF5] border-[#009B87] shadow-sm text-[#005F58] font-medium scale-[1.01]'
                          : 'bg-white border-transparent hover:bg-[#F3FCF8] hover:border-[#EEF1EF]'
                      }`}
                    >
                      <p className="flex-1">{line}</p>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => copyToClipboard(line)}
                          title="Copy line"
                          className="p-1.5 text-[#89919B] hover:text-[#009B87] rounded-md hover:bg-white transition-colors"
                        >
                          {copiedLine === line ? <Check className="w-3.5 h-3.5 text-[#15803D]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => onAddActionItem(`Action from Manifesto: ${line}`, currentStage.id)}
                          title="Turn into Action Item"
                          className="p-1.5 text-[#89919B] hover:text-[#009B87] rounded-md hover:bg-white transition-colors text-[10px] font-bold"
                        >
                          + Action
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Right Column: Voice Audio Studio Controls */}
        {!focusMode && (
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E5E9E7] shadow-sm space-y-6 sticky top-24">
              <div className="flex items-center justify-between border-b border-[#EEF1EF] pb-4">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-[#009B87]" />
                  <h3 className="text-base font-bold text-[#171D27]">TTS Voice Studio</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F3FCF8] text-[#005F58] border border-[#E5E9E7]">
                  Gemini 3.8 Audio
                </span>
              </div>

              {/* Audio Playback Hero Button */}
              <div className="bg-[#F3FCF8] rounded-xl p-5 border border-[#E5E9E7] text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#009B87] text-white flex items-center justify-center mx-auto shadow-md hover:scale-105 transition-transform cursor-pointer"
                  onClick={handlePlayTTS}
                >
                  {isLoadingTTS ? (
                    <Sparkles className="w-7 h-7 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-7 h-7 fill-white" />
                  ) : (
                    <Play className="w-7 h-7 fill-white ml-1" />
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#171D27]">
                    {isLoadingTTS ? 'Synthesizing Voice...' : isPlaying ? 'Playing Stage Manifesto' : 'Play Stage Audio'}
                  </h4>
                  <p className="text-xs text-[#626B78] mt-0.5">
                    Voice: <span className="font-semibold text-[#005F58]">{voiceName}</span> · Speed: {playbackSpeed}x
                  </p>
                </div>

                {audioUrl && (
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        if (audioRef.current) {
                          audioRef.current.currentTime = 0;
                          audioRef.current.play();
                        }
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#005F58] hover:text-[#009B87]"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restart
                    </button>
                  </div>
                )}
              </div>

              {/* Voice Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#171D27] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#009B87]" />
                  Select Voice Persona
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Kore', label: 'Kore (Balanced)' },
                    { name: 'Fenrir', label: 'Fenrir (Deep)' },
                    { name: 'Zephyr', label: 'Zephyr (Resonant)' },
                    { name: 'Puck', label: 'Puck (Dynamic)' },
                  ].map((v) => (
                    <button
                      key={v.name}
                      onClick={() => {
                        setVoiceName(v.name);
                        setAudioUrl(null);
                        setIsPlaying(false);
                      }}
                      className={`p-2 rounded-lg text-xs font-semibold text-center border transition-all ${
                        voiceName === v.name
                          ? 'bg-[#EAFBF5] border-[#009B87] text-[#005F58]'
                          : 'bg-[#FAF9F6] border-[#E5E9E7] text-[#626B78] hover:bg-white'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed Controls */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#171D27]">Playback Speed</label>
                <div className="flex items-center gap-2">
                  {[0.8, 1.0, 1.25, 1.5, 2.0].map((s) => (
                    <button
                      key={s}
                      onClick={() => setPlaybackSpeed(s)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        playbackSpeed === s
                          ? 'bg-[#009B87] text-white border-[#009B87]'
                          : 'bg-[#FAF9F6] border-[#E5E9E7] text-[#626B78] hover:bg-white'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Themes Badges */}
              <div className="space-y-2 pt-2 border-t border-[#EEF1EF]">
                <label className="text-xs font-bold text-[#171D27]">Core Pillars in this Stage</label>
                <div className="flex flex-wrap gap-1.5">
                  {currentStage.themes.map((theme, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs font-medium bg-[#F3FCF8] text-[#005F58] border border-[#E5E9E7] rounded-md"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
