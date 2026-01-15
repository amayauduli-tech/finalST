
import React, { useState } from 'react';
import { Chapter } from '../types';
import { Plus, Minus, Trash2, CheckCircle2, AlertCircle, PlusCircle } from 'lucide-react';

interface ChapterListProps {
  chapters: Chapter[];
  onUpdate: (chapters: Chapter[]) => void;
}

export const ChapterList: React.FC<ChapterListProps> = ({ chapters, onUpdate }) => {
  const [newChapterName, setNewChapterName] = useState('');
  const [newChapterTarget, setNewChapterTarget] = useState(5);

  const addChapter = () => {
    if (!newChapterName.trim()) return;
    const newChapter: Chapter = {
      id: Math.random().toString(36).substr(2, 9),
      name: newChapterName,
      repetitions: 0,
      targetRepetitions: newChapterTarget
    };
    onUpdate([...chapters, newChapter]);
    setNewChapterName('');
  };

  const updateRepetition = (id: string, delta: number) => {
    onUpdate(chapters.map(c => 
      c.id === id ? { ...c, repetitions: Math.max(0, c.repetitions + delta) } : c
    ));
  };

  const removeChapter = (id: string) => {
    onUpdate(chapters.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-3">
        <input 
          type="text" 
          placeholder="New Topic Name..."
          className="flex-1 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          value={newChapterName}
          onChange={(e) => setNewChapterName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addChapter()}
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 whitespace-nowrap">Target Reps:</span>
          <input 
            type="number" 
            className="w-16 border border-slate-200 rounded-lg px-2 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={newChapterTarget}
            onChange={(e) => setNewChapterTarget(parseInt(e.target.value) || 1)}
          />
          <button 
            onClick={addChapter}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <PlusCircle size={18} /> Add
          </button>
        </div>
      </div>

      <div className="overflow-hidden bg-white border border-slate-200 rounded-xl">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-medium">
            <tr>
              <th className="px-6 py-4">Topic / Chapter</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Reps</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {chapters.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                  No topics added yet. Start by adding one above.
                </td>
              </tr>
            ) : (
              chapters.map((chapter) => {
                const isMet = chapter.repetitions >= chapter.targetRepetitions;
                const isExceeded = chapter.repetitions > chapter.targetRepetitions;
                
                return (
                  <tr key={chapter.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{chapter.name}</div>
                      <div className="text-xs text-slate-500">Target: {chapter.targetRepetitions} reps</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isExceeded ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Exceeded
                        </span>
                      ) : isMet ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle2 size={12} className="mr-1" /> Met
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <AlertCircle size={12} className="mr-1" /> {chapter.targetRepetitions - chapter.repetitions} Left
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => updateRepetition(chapter.id, -1)}
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-bold w-6 text-center">{chapter.repetitions}</span>
                        <button 
                          onClick={() => updateRepetition(chapter.id, 1)}
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => removeChapter(chapter.id)}
                        className="text-slate-400 hover:text-red-500 p-2 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
