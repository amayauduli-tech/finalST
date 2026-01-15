
import React from 'react';
import { Subject } from '../types';
import { BookOpen, GraduationCap, Calendar, CheckCircle } from 'lucide-react';

interface SubjectCardProps {
  subject: Subject;
  onClick: () => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onClick }) => {
  const completedChapters = subject.chapters.filter(c => c.repetitions >= c.targetRepetitions).length;
  const totalChapters = subject.chapters.length;
  const progressPercent = totalChapters === 0 ? 0 : Math.round((completedChapters / totalChapters) * 100);

  const averageAssessment = subject.assessments.length > 0
    ? Math.round((subject.assessments.reduce((acc, curr) => acc + (curr.mark / curr.total), 0) / subject.assessments.length) * 100)
    : null;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${subject.color}15` }}>
          <BookOpen size={24} style={{ color: subject.color }} />
        </div>
        {subject.examDate && (
          <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            <Calendar size={12} className="mr-1" />
            {new Date(subject.examDate).toLocaleDateString()}
          </div>
        )}
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
        {subject.name}
      </h3>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
            <span>Study Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%`, backgroundColor: subject.color }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="flex items-center">
            <CheckCircle size={14} className="mr-1 text-emerald-500" />
            {completedChapters}/{totalChapters} Topics
          </div>
          {averageAssessment !== null && (
            <div className="flex items-center">
              <GraduationCap size={14} className="mr-1 text-blue-500" />
              {averageAssessment}% Avg Mark
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
