import React, { useState, useRef } from 'react';
import { LyriaTrack } from '../types';
import { Play, Pause, Sparkles, Headphones, RotateCcw, Volume2, Plus } from 'lucide-react';

export const AmbientFocus: React.FC = () => {
  const [tracks, setTracks] = useState<LyriaTrack[]>([
    {
      id: 't1',
      title: 'Deep Focus Alpha Flow',
      prompt: 'Calm ambient focus soundscape with soft atmospheric synth pads and warm binaural resonance for executive deep work',
      durationSeconds: 30,
    },
    {
      id: 't2',
      title: 'Clean Intensity Drive',
      prompt: 'Clean motivational electronic pulse with driving low-end bass and steady rhythm for high-throughput engineering and coding',
      durationSeconds: 30,
    },
    {
      id: 't3',
      title: 'Masculine Anchor Pad',
      prompt: 'Resonant grounding sub-bass pad with subtle organic textures and calm unmovable presence',
      durationSeconds: 30,
    },
  ]);

  const [customPrompt, setCustomPrompt] = useState('');
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleGenerateMusic = async (trackId: string, promptText: string) => {
    setGeneratingId(trackId);
    try {
      const res = await fetch('/api/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });

      if (!res.ok) {
        throw new Error('Music generation failed');
      }

      const data = await res.json();
      const binary = atob(data.audioBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
      const audioUrl = URL.createObjectURL(blob);

      setTracks((prev) =>
        prev.map((t) => (t.id === trackId ? { ...t, audioUrl, isGenerating: false } : t))
      );

      playTrack(trackId, audioUrl);
    } catch (err) {
      console.error('Error generating Lyria focus music:', err);
      alert('Unable to generate focus audio right now. Please check Gemini API key configuration.');
    } finally {
      setGeneratingId(null);
    }
  };

  const playTrack = (trackId: string, url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(url);
    audio.loop = true;
    audioRef.current = audio;

    audio.onplay = () => setPlayingTrackId(trackId);
    audio.onpause = () => setPlayingTrackId(null);

    audio.play().catch((e) => console.error('Audio play error', e));
  };

  const togglePlay = (track: LyriaTrack) => {
    if (playingTrackId === track.id && audioRef.current) {
      audioRef.current.pause();
      setPlayingTrackId(null);
      return;
    }

    if (track.audioUrl) {
      playTrack(track.id, track.audioUrl);
    } else {
      handleGenerateMusic(track.id, track.prompt);
    }
  };

  const handleAddCustomTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    const newId = `t-${Date.now()}`;
    const newTrack: LyriaTrack = {
      id: newId,
      title: customPrompt.slice(0, 30) + '...',
      prompt: customPrompt,
      durationSeconds: 30,
    };

    setTracks([newTrack, ...tracks]);
    setCustomPrompt('');
    handleGenerateMusic(newId, customPrompt);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div>
        <span className="text-xs font-semibold text-[#009B87] uppercase tracking-wider">
          Lyria AI Soundscape Generator
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171D27] mt-0.5">
          Ambient Focus & Sound Studio
        </h1>
        <p className="text-sm text-[#626B78]">
          Generate custom focus soundscapes powered by <span className="font-semibold text-[#005F58]">lyria-3-clip-preview</span> to maintain calm, sharp focus.
        </p>
      </div>

      {/* Generate Custom Focus Track Form */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E9E7] shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[#171D27] flex items-center gap-2">
          <Headphones className="w-4 h-4 text-[#009B87]" />
          Synthesize Custom Focus Audio
        </h2>

        <form onSubmit={handleAddCustomTrack} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="e.g. Cinematic orchestral pad with warm sub-bass for deep coding sessions..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="flex-1 w-full px-4 py-2.5 text-xs bg-[#FAF9F6] border border-[#E5E9E7] rounded-xl focus:outline-none focus:border-[#009B87] text-[#171D27]"
            required
          />

          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-[#009B87] hover:bg-[#007F73] text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            Generate Track
          </button>
        </form>
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tracks.map((track) => {
          const isPlaying = playingTrackId === track.id;
          const isGenerating = generatingId === track.id;

          return (
            <div
              key={track.id}
              className={`bg-white rounded-2xl p-6 border transition-all space-y-4 flex flex-col justify-between ${
                isPlaying
                  ? 'border-[#009B87] shadow-md bg-[#F3FCF8]'
                  : 'border-[#E5E9E7] hover:border-[#2DD4BF]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#005F58] uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-[#E5E9E7]">
                    Lyria 3
                  </span>
                  <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-[#009B87] animate-pulse' : 'text-[#89919B]'}`} />
                </div>

                <h3 className="text-base font-bold text-[#171D27]">{track.title}</h3>
                <p className="text-xs text-[#626B78] line-clamp-3">{track.prompt}</p>
              </div>

              <div className="pt-2 border-t border-[#EEF1EF] flex items-center justify-between gap-3">
                <button
                  onClick={() => togglePlay(track)}
                  disabled={isGenerating}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isPlaying
                      ? 'bg-[#005F58] text-white shadow-sm'
                      : 'bg-[#009B87] hover:bg-[#007F73] text-white shadow-sm'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-white" />
                      Pause Soundscape
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                      {track.audioUrl ? 'Play Soundscape' : 'Generate & Play'}
                    </>
                  )}
                </button>

                {track.audioUrl && (
                  <button
                    onClick={() => {
                      if (audioRef.current && isPlaying) {
                        audioRef.current.currentTime = 0;
                        audioRef.current.play();
                      }
                    }}
                    className="p-2.5 bg-[#FAF9F6] hover:bg-white text-[#626B78] rounded-xl border border-[#E5E9E7]"
                    title="Restart Audio"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
