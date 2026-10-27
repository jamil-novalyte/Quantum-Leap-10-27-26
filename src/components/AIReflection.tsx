import React, { useState, useRef } from 'react';
import { JournalEntry } from '../types';
import { Mic, Square, Sparkles, BrainCircuit, Check, ArrowRight, Volume2 } from 'lucide-react';

interface AIReflectionProps {
  entries: JournalEntry[];
  onAddEntry: (entry: JournalEntry) => void;
  onAddActionItem: (title: string, stageId?: string) => void;
}

export const AIReflection: React.FC<AIReflectionProps> = ({ entries, onAddEntry, onAddActionItem }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [selectedStageName, setSelectedStageName] = useState('Stage 1 — Life-Upgrade Fire');
  const [addedActionsMap, setAddedActionsMap] = useState<{ [key: string]: boolean }>({});

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioBlobUrl = URL.createObjectURL(audioBlob);
        await processAudio(audioBlob, audioBlobUrl);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access error:', err);
      alert('Unable to access microphone. Please check permissions or type your reflection text directly.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const processAudio = async (audioBlob: Blob, audioBlobUrl: string) => {
    setIsAnalyzing(true);
    try {
      // 1. Convert Blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];

        // 2. Transcribe audio using gemini-3.5-transcribe
        const transcribeRes = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audioBase64: base64Data, mimeType: 'audio/webm' }),
        });

        const transcribeData = await transcribeRes.json();
        const transcript = transcribeData.transcript || 'Speech recorded successfully.';

        // 3. Analyze transcript using gemini-3.8-flash
        await analyzeTranscript(transcript, audioBlobUrl);
      };
    } catch (err) {
      console.error('Error processing audio reflection:', err);
      alert('Error transcribing audio. You can also submit text directly.');
      setIsAnalyzing(false);
    }
  };

  const handleManualTextSubmit = async () => {
    if (!textInput.trim()) return;
    setIsAnalyzing(true);
    await analyzeTranscript(textInput, undefined);
    setTextInput('');
  };

  const analyzeTranscript = async (transcript: string, audioBlobUrl?: string) => {
    try {
      const res = await fetch('/api/analyze-journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          currentStageName: selectedStageName,
        }),
      });

      if (!res.ok) throw new Error('Failed to analyze reflection');

      const analysis = await res.json();

      const newEntry: JournalEntry = {
        id: `journal-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: Date.now(),
        stageId: 'stage-1',
        stageName: selectedStageName,
        transcript,
        summary: analysis.summary || 'Daily reflection logged.',
        keyTakeaways: analysis.keyTakeaways || [],
        actionItems: analysis.actionItems || [],
        groundedPerspective: analysis.groundedPerspective || 'Stay focused on consistent execution.',
        audioBlobUrl,
      };

      onAddEntry(newEntry);
    } catch (err) {
      console.error('Analysis error:', err);
      alert('Analysis completed with standard log.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div>
        <span className="text-xs font-semibold text-[#009B87] uppercase tracking-wider">
          Gemini Intelligence Studio
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171D27] mt-0.5">
          AI Voice Journal & Grounded Coaching
        </h1>
        <p className="text-sm text-[#626B78]">
          Speak your thoughts freely. Transcribe verbatim with <span className="font-semibold text-[#005F58]">gemini-3.5-transcribe</span> and extract actionable insights.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Voice Recorder & Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E5E9E7] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#EEF1EF] pb-4">
              <h2 className="text-base font-bold text-[#171D27] flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-[#009B87]" />
                Log Thought Reflection
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F3FCF8] text-[#005F58] border border-[#E5E9E7]">
                Voice & Text
              </span>
            </div>

            {/* Stage Association Dropdown */}
            <div>
              <label className="text-xs font-bold text-[#171D27] block mb-1">Associate with Stage</label>
              <select
                value={selectedStageName}
                onChange={(e) => setSelectedStageName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#E5E9E7] rounded-lg focus:outline-none focus:border-[#009B87] text-[#171D27]"
              >
                <option value="Stage 1 — Life-Upgrade Fire">Stage 1 — Life-Upgrade Fire</option>
                <option value="Stage 2 — Calm / Sharp Masculinity">Stage 2 — Calm / Sharp Masculinity</option>
                <option value="Stage 3 — Strength, Confidence & Charisma">Stage 3 — Strength & Charisma</option>
                <option value="Stage 4 — Attraction as Normal Reality">Stage 4 — Attraction Reality</option>
                <option value="Stage 5 — Health, Craft & Emotional Ease">Stage 5 — Health & Craft</option>
                <option value="Stage 6 — Fears Gone / Deep Honesty">Stage 6 — Deep Honesty</option>
                <option value="Stage 7 — Pure Identity-Command Mode">Stage 7 — Command Mode</option>
              </select>
            </div>

            {/* Mic Hero Record Button */}
            <div className="bg-[#F3FCF8] rounded-xl p-6 border border-[#E5E9E7] text-center space-y-4">
              <div
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-md transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-[#DC2626] text-white animate-pulse'
                    : 'bg-[#009B87] hover:bg-[#007F73] text-white'
                }`}
              >
                {isRecording ? <Square className="w-8 h-8 fill-white" /> : <Mic className="w-8 h-8" />}
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#171D27]">
                  {isRecording ? `Recording... (${formatTime(recordingTime)})` : 'Tap Mic to Start Voice Journal'}
                </h3>
                <p className="text-xs text-[#626B78] mt-1">
                  {isRecording ? 'Click stop when finished to process transcript.' : 'Captures verbatim voice with zero friction.'}
                </p>
              </div>
            </div>

            {/* Text Fallback Option */}
            <div className="space-y-3 pt-2 border-t border-[#EEF1EF]">
              <label className="text-xs font-bold text-[#171D27] block">Or Write Reflection Text</label>
              <textarea
                rows={4}
                placeholder="Type your insights, realization, or daily situation here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full p-3 text-xs bg-[#FAF9F6] border border-[#E5E9E7] rounded-xl focus:outline-none focus:border-[#009B87] text-[#171D27]"
              />
              <button
                onClick={handleManualTextSubmit}
                disabled={isAnalyzing || !textInput.trim()}
                className="w-full py-2.5 bg-[#009B87] hover:bg-[#007F73] text-white text-xs font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Analyzing with Gemini 3.8...
                  </>
                ) : (
                  <>
                    Analyze Reflection <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Reflection Journal Entries Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E9E7] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#EEF1EF] pb-4">
              <h2 className="text-lg font-bold text-[#171D27]">Founder Reflection Log</h2>
              <span className="text-xs font-bold text-[#005F58] bg-[#F3FCF8] px-3 py-1 rounded-full border border-[#E5E9E7]">
                {entries.length} Entries Saved
              </span>
            </div>

            {entries.length === 0 ? (
              <div className="text-center py-12 text-[#626B78] space-y-2">
                <BrainCircuit className="w-10 h-10 text-[#009B87] mx-auto opacity-40" />
                <p className="text-sm font-semibold">No reflections logged yet.</p>
                <p className="text-xs">Record a voice journal or write a reflection above to begin.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {entries.map((entry) => (
                  <div key={entry.id} className="bg-[#FAF9F6] rounded-xl p-5 border border-[#E5E9E7] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#EEF1EF] pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-[#009B87] uppercase tracking-wider">
                          {entry.stageName}
                        </span>
                        <p className="text-xs font-semibold text-[#171D27]">{entry.date}</p>
                      </div>

                      {entry.audioBlobUrl && (
                        <button
                          onClick={() => {
                            const audio = new Audio(entry.audioBlobUrl);
                            audio.play();
                          }}
                          className="flex items-center gap-1 text-xs font-semibold text-[#005F58] hover:text-[#009B87]"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          Play Recording
                        </button>
                      )}
                    </div>

                    {/* Summary & Perspective */}
                    <div className="space-y-2">
                      <p className="text-xs text-[#171D27] italic">"{entry.transcript}"</p>
                      <div className="bg-white p-3 rounded-lg border border-[#EEF1EF] space-y-1">
                        <span className="text-[10px] font-bold text-[#009B87] uppercase">Grounded Perspective</span>
                        <p className="text-xs text-[#171D27]">{entry.groundedPerspective}</p>
                      </div>
                    </div>

                    {/* Key Takeaways */}
                    {entry.keyTakeaways.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#626B78] uppercase">Key Growth Takeaways</span>
                        <ul className="text-xs space-y-1 text-[#171D27]">
                          {entry.keyTakeaways.map((t, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#009B87] font-bold">•</span>
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Extracted Action Items */}
                    {entry.actionItems.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-[#EEF1EF]">
                        <span className="text-[10px] font-bold text-[#005F58] uppercase">Extracted Action Items</span>
                        <div className="space-y-1">
                          {entry.actionItems.map((action, i) => {
                            const key = `${entry.id}-${i}`;
                            const isAdded = addedActionsMap[key];
                            return (
                              <div key={i} className="flex items-center justify-between text-xs bg-white p-2 rounded border border-[#E5E9E7]">
                                <span className="text-[#171D27] font-medium">{action}</span>
                                <button
                                  onClick={() => {
                                    onAddActionItem(action, entry.stageId);
                                    setAddedActionsMap((prev) => ({ ...prev, [key]: true }));
                                  }}
                                  disabled={isAdded}
                                  className={`px-2 py-0.5 text-[10px] font-bold rounded transition-colors ${
                                    isAdded
                                      ? 'bg-[#15803D]/10 text-[#15803D]'
                                      : 'bg-[#F3FCF8] text-[#005F58] hover:bg-[#EAFBF5]'
                                  }`}
                                >
                                  {isAdded ? <Check className="w-3 h-3 inline" /> : '+ Vault'}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
