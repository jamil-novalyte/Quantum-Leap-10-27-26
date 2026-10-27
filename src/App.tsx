import React, { useState } from 'react';
import { Header } from './components/Header';
import { ManifestoReader } from './components/ManifestoReader';
import { DailyCommand } from './components/DailyCommand';
import { AIReflection } from './components/AIReflection';
import { KnowledgeVault } from './components/KnowledgeVault';
import { AmbientFocus } from './components/AmbientFocus';

import { STAGE_SCRIPTS, INITIAL_HABITS } from './data/scriptData';
import { HabitItem, ActionItem, JournalEntry } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'manifesto' | 'habits' | 'reflection' | 'vault' | 'ambient'>('manifesto');
  const [selectedStageId, setSelectedStageId] = useState<string>('stage-1');
  const [completedStages, setCompletedStages] = useState<string[]>(['stage-1']);
  const [habits, setHabits] = useState<HabitItem[]>(INITIAL_HABITS);

  const [actionItems, setActionItems] = useState<ActionItem[]>([
    {
      id: 'a1',
      title: 'Execute 90-min uninterrupted deep work block for founder strategy',
      stageId: 'stage-1',
      priority: 'high',
      status: 'todo',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      source: 'manual',
    },
    {
      id: 'a2',
      title: 'Maintain calm, clear, and regulated nervous system under pressure',
      stageId: 'stage-2',
      priority: 'high',
      status: 'in_progress',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      source: 'manual',
    },
    {
      id: 'a3',
      title: 'Speak with authentic clarity and warmth without losing backbone',
      stageId: 'stage-6',
      priority: 'medium',
      status: 'done',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      source: 'manual',
    },
  ]);

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isGlobalTTSGenerating, setIsGlobalTTSGenerating] = useState(false);

  // Quick Quantum Fusion TTS playback
  const handleQuickTTSPlay = async () => {
    setActiveTab('manifesto');
    setSelectedStageId('stage-quantum-loop');
  };

  const handleToggleStageComplete = (stageId: string) => {
    setCompletedStages((prev) =>
      prev.includes(stageId) ? prev.filter((id) => id !== stageId) : [...prev, stageId]
    );
  };

  const handleToggleHabit = (habitId: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const nextCompleted = !h.completed;
          return {
            ...h,
            completed: nextCompleted,
            streak: nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1),
          };
        }
        return h;
      })
    );
  };

  const handleAddHabit = (title: string, category: HabitItem['category'], description: string) => {
    const newHabit: HabitItem = {
      id: `h-${Date.now()}`,
      title,
      description,
      category,
      completed: false,
      streak: 1,
      frequency: 'Daily',
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const handleAddActionItem = (title: string, stageId?: string, priority: ActionItem['priority'] = 'high') => {
    const newItem: ActionItem = {
      id: `act-${Date.now()}`,
      title,
      stageId,
      priority,
      status: 'todo',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      source: 'manual',
    };
    setActionItems((prev) => [newItem, ...prev]);
  };

  const handleUpdateActionStatus = (id: string, status: ActionItem['status']) => {
    setActionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const handleDeleteActionItem = (id: string) => {
    setActionItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddJournalEntry = (entry: JournalEntry) => {
    setJournalEntries((prev) => [entry, ...prev]);

    // Automatically convert extracted action items into Knowledge Vault
    if (entry.actionItems && entry.actionItems.length > 0) {
      entry.actionItems.forEach((act) => {
        handleAddActionItem(act, entry.stageId, 'high');
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#171D27] flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickTTSPlay={handleQuickTTSPlay}
        isTTSGenerating={isGlobalTTSGenerating}
      />

      <main className="flex-1 pb-16">
        {activeTab === 'manifesto' && (
          <ManifestoReader
            scripts={STAGE_SCRIPTS}
            selectedStageId={selectedStageId}
            onSelectStage={setSelectedStageId}
            completedStages={completedStages}
            onToggleStageComplete={handleToggleStageComplete}
            onAddActionItem={handleAddActionItem}
          />
        )}

        {activeTab === 'habits' && (
          <DailyCommand
            habits={habits}
            onToggleHabit={handleToggleHabit}
            onAddHabit={handleAddHabit}
          />
        )}

        {activeTab === 'reflection' && (
          <AIReflection
            entries={journalEntries}
            onAddEntry={handleAddJournalEntry}
            onAddActionItem={handleAddActionItem}
          />
        )}

        {activeTab === 'vault' && (
          <KnowledgeVault
            actionItems={actionItems}
            onAddActionItem={handleAddActionItem}
            onUpdateStatus={handleUpdateActionStatus}
            onDeleteActionItem={handleDeleteActionItem}
          />
        )}

        {activeTab === 'ambient' && <AmbientFocus />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E9E7] py-6 text-center text-xs text-[#626B78]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-semibold">Novalyte AI Founder Studio · Powered by Google Gemini 3.8 & Lyria 3</p>
          <div className="flex items-center gap-4 text-[#89919B]">
            <span>Clean Power</span>
            <span>·</span>
            <span>Identity Discipline</span>
            <span>·</span>
            <span>Relentless Execution</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
