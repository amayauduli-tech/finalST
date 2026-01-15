
import React, { useState } from 'react';
import { Assessment } from '../types';
import { Trash2, Plus, LineChart } from 'lucide-react';

interface AssessmentTrackerProps {
  assessments: Assessment[];
  onUpdate: (assessments: Assessment[]) => void;
}

export const AssessmentTracker: React.FC<AssessmentTrackerProps> = ({ assessments, onUpdate }) => {
  const [name, setName] = useState('');
  const [mark, setMark] = useState(0);
  const [total, setTotal] = useState(100);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const addAssessment = () => {
    if (!name.trim()) return;
    const newAssessment: Assessment = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      mark,
      total,
      date
    };
    onUpdate([...assessments, newAssessment]);
    setName('');
    setMark(0);
    setTotal(100);
  };

  const removeAssessment = (id: string) => {
    onUpdate(assessments.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
          <Plus size={18} className="mr-2 text-blue-600" /> Add Assessment Mark
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Assessment Name</label>
            <input 
              type="text" 
              className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              placeholder="e.g. Midterm 1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Mark obtained</label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={mark}
                onChange={(e) => setMark(parseFloat(e.target.value) || 0)}
              />
              <span className="text-slate-400">/</span>
              <input 
                type="number" 
                className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={total}
                onChange={(e) => setTotal(parseFloat(e.target.value) || 1)}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Date</label>
            <input 
              type="date" 
              className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        <button 
          onClick={addAssessment}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto"
        >
          Add Result
        </button>
      </div>

      <div className="space-y-3">
        {assessments.length === 0 ? (
          <div className="text-center py-10 bg-white border border-dashed border-slate-200 rounded-xl text-slate-400">
            No assessments recorded yet.
          </div>
        ) : (
          assessments.map((a) => (
            <div key={a.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <LineChart size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800">{a.name}</h5>
                  <p className="text-xs text-slate-500">{new Date(a.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="text-xl font-bold text-slate-800">{a.mark} <span className="text-sm font-normal text-slate-400">/ {a.total}</span></div>
                  <div className="text-xs font-semibold text-blue-600">{Math.round((a.mark/a.total)*100)}%</div>
                </div>
                <button 
                  onClick={() => removeAssessment(a.id)}
                  className="text-slate-400 hover:text-red-500 p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
