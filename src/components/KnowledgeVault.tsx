import React, { useState } from 'react';
import { ActionItem } from '../types';
import { Plus, CheckCircle2, Circle, Clock, Trash2, Library, Sparkles } from 'lucide-react';

interface KnowledgeVaultProps {
  actionItems: ActionItem[];
  onAddActionItem: (title: string, priority?: ActionItem['priority']) => void;
  onUpdateStatus: (id: string, status: ActionItem['status']) => void;
  onDeleteActionItem: (id: string) => void;
}

export const KnowledgeVault: React.FC<KnowledgeVaultProps> = ({
  actionItems,
  onAddActionItem,
  onUpdateStatus,
  onDeleteActionItem,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<ActionItem['priority']>('high');
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'in_progress' | 'done'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddActionItem(newTitle, newPriority);
    setNewTitle('');
  };

  const filteredItems = actionItems.filter((item) => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  const todoCount = actionItems.filter((i) => i.status === 'todo').length;
  const inProgressCount = actionItems.filter((i) => i.status === 'in_progress').length;
  const doneCount = actionItems.filter((i) => i.status === 'done').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div>
        <span className="text-xs font-semibold text-[#009B87] uppercase tracking-wider">
          Insight & Execution System
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171D27] mt-0.5">
          Knowledge & Action Vault
        </h1>
        <p className="text-sm text-[#626B78]">
          "I capture insights and turn them into action. I do not let powerful thoughts vanish."
        </p>
      </div>

      {/* Quick Add Insight Form */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E9E7] shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[#171D27] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#009B87]" />
          Capture New Insight or Executable Action Item
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="e.g. Schedule 90-min uninterrupted deep work block for founder strategy..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 w-full px-4 py-2.5 text-xs bg-[#FAF9F6] border border-[#E5E9E7] rounded-xl focus:outline-none focus:border-[#009B87] text-[#171D27]"
            required
          />

          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as any)}
            className="w-full sm:w-40 px-3 py-2.5 text-xs bg-[#FAF9F6] border border-[#E5E9E7] rounded-xl focus:outline-none focus:border-[#009B87] text-[#171D27]"
          >
            <option value="high">🔥 High Priority</option>
            <option value="medium">⚡ Medium Priority</option>
            <option value="low">🌱 Low Priority</option>
          </select>

          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-[#009B87] hover:bg-[#007F73] text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            Capture Action
          </button>
        </form>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EEF1EF] pb-4 overflow-x-auto">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            statusFilter === 'all'
              ? 'bg-[#009B87] text-white shadow-sm'
              : 'bg-white text-[#626B78] hover:bg-[#F7FAF8] border border-[#E5E9E7]'
          }`}
        >
          All Items ({actionItems.length})
        </button>

        <button
          onClick={() => setStatusFilter('todo')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            statusFilter === 'todo'
              ? 'bg-[#009B87] text-white shadow-sm'
              : 'bg-white text-[#626B78] hover:bg-[#F7FAF8] border border-[#E5E9E7]'
          }`}
        >
          To Do ({todoCount})
        </button>

        <button
          onClick={() => setStatusFilter('in_progress')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            statusFilter === 'in_progress'
              ? 'bg-[#009B87] text-white shadow-sm'
              : 'bg-white text-[#626B78] hover:bg-[#F7FAF8] border border-[#E5E9E7]'
          }`}
        >
          In Progress ({inProgressCount})
        </button>

        <button
          onClick={() => setStatusFilter('done')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            statusFilter === 'done'
              ? 'bg-[#009B87] text-white shadow-sm'
              : 'bg-white text-[#626B78] hover:bg-[#F7FAF8] border border-[#E5E9E7]'
          }`}
        >
          Executed ({doneCount})
        </button>
      </div>

      {/* Action Items List */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E9E7] shadow-sm space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-[#626B78] space-y-2">
            <Library className="w-10 h-10 text-[#009B87] mx-auto opacity-40" />
            <p className="text-sm font-semibold">No action items in this filter.</p>
            <p className="text-xs">Capture your insights above to ensure zero lost potential.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                item.status === 'done'
                  ? 'bg-[#F3FCF8] border-[#2DD4BF]/50 opacity-75'
                  : 'bg-white border-[#E5E9E7] hover:bg-[#FAF9F6]'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onUpdateStatus(item.id, item.status === 'done' ? 'todo' : 'done')}
                  className="mt-0.5 text-[#009B87]"
                >
                  {item.status === 'done' ? (
                    <CheckCircle2 className="w-5 h-5 text-[#15803D]" />
                  ) : item.status === 'in_progress' ? (
                    <Clock className="w-5 h-5 text-[#B45309]" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#89919B]" />
                  )}
                </button>

                <div>
                  <h3
                    className={`text-sm font-bold ${
                      item.status === 'done' ? 'line-through text-[#626B78]' : 'text-[#171D27]'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-[#626B78] mt-0.5">Created on {item.createdAt}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {/* Priority Badge */}
                <span
                  className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                    item.priority === 'high'
                      ? 'bg-[#DC2626]/10 text-[#DC2626]'
                      : item.priority === 'medium'
                      ? 'bg-[#B45309]/10 text-[#B45309]'
                      : 'bg-[#0284C7]/10 text-[#0284C7]'
                  }`}
                >
                  {item.priority}
                </span>

                {/* Status Switcher Buttons */}
                <button
                  onClick={() => onUpdateStatus(item.id, 'todo')}
                  className={`px-2 py-1 text-[10px] font-bold rounded transition-colors ${
                    item.status === 'todo' ? 'bg-[#005F58] text-white' : 'bg-[#FAF9F6] text-[#626B78]'
                  }`}
                >
                  To Do
                </button>
                <button
                  onClick={() => onUpdateStatus(item.id, 'in_progress')}
                  className={`px-2 py-1 text-[10px] font-bold rounded transition-colors ${
                    item.status === 'in_progress' ? 'bg-[#B45309] text-white' : 'bg-[#FAF9F6] text-[#626B78]'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => onUpdateStatus(item.id, 'done')}
                  className={`px-2 py-1 text-[10px] font-bold rounded transition-colors ${
                    item.status === 'done' ? 'bg-[#15803D] text-white' : 'bg-[#FAF9F6] text-[#626B78]'
                  }`}
                >
                  Executed
                </button>

                <button
                  onClick={() => onDeleteActionItem(item.id)}
                  title="Delete item"
                  className="p-1.5 text-[#89919B] hover:text-[#DC2626] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
