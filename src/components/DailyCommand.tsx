import React, { useState } from 'react';
import { HabitItem } from '../types';
import { CheckCircle2, Circle, Dumbbell, Zap, Flame, Shield, Plus, Award, Activity } from 'lucide-react';

interface DailyCommandProps {
  habits: HabitItem[];
  onToggleHabit: (habitId: string) => void;
  onAddHabit: (title: string, category: HabitItem['category'], description: string) => void;
}

export const DailyCommand: React.FC<DailyCommandProps> = ({ habits, onToggleHabit, onAddHabit }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<HabitItem['category']>('training');
  const [focusHours, setFocusHours] = useState(3.5);

  const completedCount = habits.filter((h) => h.completed).length;
  const totalCount = habits.length;
  const disciplineScore = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const avgStreak = Math.round(habits.reduce((acc, h) => acc + h.streak, 0) / (habits.length || 1));

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddHabit(newTitle, newCategory, newDesc);
    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const getCategoryIcon = (cat: HabitItem['category']) => {
    switch (cat) {
      case 'training':
        return <Dumbbell className="w-4 h-4 text-[#009B87]" />;
      case 'craft':
        return <Zap className="w-4 h-4 text-[#009B87]" />;
      case 'speech':
        return <Flame className="w-4 h-4 text-[#009B87]" />;
      case 'recovery':
        return <Shield className="w-4 h-4 text-[#009B87]" />;
      default:
        return <Activity className="w-4 h-4 text-[#009B87]" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#009B87] uppercase tracking-wider">
            Executive Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171D27] mt-0.5">
            Founder Daily Command Center
          </h1>
          <p className="text-sm text-[#626B78]">
            Identity-level discipline, physical power, and relentless craft execution.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#009B87] hover:bg-[#007F73] text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          Add Discipline Standard
        </button>
      </div>

      {/* KPI Stat Cards (32px / 700 numbers per design guidelines) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-[#E5E9E7] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#626B78]">
            <span className="text-xs font-semibold uppercase tracking-wider">Discipline Score</span>
            <Award className="w-4 h-4 text-[#009B87]" />
          </div>
          <div className="text-[32px] font-bold text-[#171D27] tracking-tight">{disciplineScore}%</div>
          <p className="text-xs text-[#626B78]">
            {completedCount} of {totalCount} daily standards met today
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E5E9E7] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#626B78]">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Streak</span>
            <Flame className="w-4 h-4 text-[#009B87]" />
          </div>
          <div className="text-[32px] font-bold text-[#171D27] tracking-tight">{avgStreak} Days</div>
          <p className="text-xs text-[#15803D] font-medium">Unbroken momentum line</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E5E9E7] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#626B78]">
            <span className="text-xs font-semibold uppercase tracking-wider">Focus Execution</span>
            <Zap className="w-4 h-4 text-[#009B87]" />
          </div>
          <div className="text-[32px] font-bold text-[#171D27] tracking-tight">{focusHours} hrs</div>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setFocusHours((h) => Math.min(12, Math.round((h + 0.5) * 10) / 10))}
              className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F3FCF8] text-[#005F58] border border-[#E5E9E7]"
            >
              +30m Deep Work
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E5E9E7] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#626B78]">
            <span className="text-xs font-semibold uppercase tracking-wider">Nervous System</span>
            <Shield className="w-4 h-4 text-[#009B87]" />
          </div>
          <div className="text-[32px] font-bold text-[#005F58] tracking-tight">Regulated</div>
          <p className="text-xs text-[#626B78]">Calm in triggers & pressure</p>
        </div>
      </div>

      {/* Habits List */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E9E7] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#EEF1EF] pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#171D27]">Daily Non-Negotiables</h2>
            <p className="text-xs text-[#626B78] mt-0.5">
              Standards are default behaviors. Execute cleanly every single day.
            </p>
          </div>
          <span className="text-xs font-bold text-[#005F58] bg-[#F3FCF8] px-3 py-1 rounded-full border border-[#E5E9E7]">
            {completedCount}/{totalCount} Completed
          </span>
        </div>

        <div className="space-y-3">
          {habits.map((habit) => (
            <div
              key={habit.id}
              onClick={() => onToggleHabit(habit.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                habit.completed
                  ? 'bg-[#F3FCF8] border-[#2DD4BF] text-[#171D27]'
                  : 'bg-white border-[#E5E9E7] hover:bg-[#FAF9F6]'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  className="mt-0.5 text-[#009B87] hover:scale-110 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleHabit(habit.id);
                  }}
                >
                  {habit.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-[#15803D]" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#89919B]" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(habit.category)}
                    <h3
                      className={`text-sm font-bold ${
                        habit.completed ? 'line-through text-[#626B78]' : 'text-[#171D27]'
                      }`}
                    >
                      {habit.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#626B78] mt-1">{habit.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-[#005F58] bg-white px-2.5 py-1 rounded-lg border border-[#E5E9E7]">
                  🔥 {habit.streak}d streak
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E5E9E7] shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-[#171D27]">Add New Non-Negotiable Standard</h3>

            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#171D27] block mb-1">Standard Title</label>
                <input
                  type="text"
                  placeholder="e.g., Uncensored Strategic Communication"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#E5E9E7] rounded-lg focus:outline-none focus:border-[#009B87]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#171D27] block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g., Speak with clarity and grounded presence."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#E5E9E7] rounded-lg focus:outline-none focus:border-[#009B87]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#171D27] block mb-1">Pillar Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#E5E9E7] rounded-lg focus:outline-none focus:border-[#009B87]"
                >
                  <option value="training">Physical Training</option>
                  <option value="craft">Craft & Code Mastery</option>
                  <option value="speech">Uncensored Speech</option>
                  <option value="recovery">Deep Recovery & Nervous System</option>
                  <option value="mindset">Mindset & Insight Capture</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#626B78] hover:text-[#171D27]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#009B87] hover:bg-[#007F73] text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Save Standard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
