
import React, { useState, useEffect, useMemo } from 'react';
import { Subject, AppState, Chapter, Badge } from './types';
import { INITIAL_SUBJECTS, SUBJECT_COLORS, STORAGE_KEY, BADGES } from './constants';
import { SubjectCard } from './components/SubjectCard';
import { ChapterList } from './components/ChapterList';
import { AssessmentTracker } from './components/AssessmentTracker';
import { 
  Plus, 
  ChevronLeft, 
  Settings, 
  BarChart3, 
  BookOpen, 
  CheckCircle2, 
  Calendar,
  LayoutDashboard,
  LogOut,
  Target,
  GraduationCap,
  Trophy,
  Star,
  Zap,
  Award,
  Crown,
  Heart,
  User,
  Medal,
  Clock,
  Flag
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';

const IconMap: any = { Star, Zap, Award, BookOpen, Trophy, Heart, Crown };

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({ subjects: [], username: 'Student' });
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chapters' | 'assessments' | 'settings'>('chapters');
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setAppState(JSON.parse(stored));
      } catch (e) {
        initializeDefault();
      }
    } else {
      initializeDefault();
    }
  }, []);

  useEffect(() => {
    if (appState.subjects.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    }
  }, [appState]);

  const initializeDefault = () => {
    const defaults: Subject[] = INITIAL_SUBJECTS.map((name, idx) => ({
      id: Math.random().toString(36).substr(2, 9),
      name,
      chapters: [],
      assessments: [],
      color: SUBJECT_COLORS[idx % SUBJECT_COLORS.length],
    }));
    setAppState({ subjects: defaults, username: 'Student' });
  };

  const selectedSubject = useMemo(() => 
    appState.subjects.find(s => s.id === selectedSubjectId), 
    [appState.subjects, selectedSubjectId]
  );

  const gamificationStats = useMemo(() => {
    let totalReps = 0;
    let masteredChapters = 0;
    let completedSubjects = 0;
    let totalChaptersCount = 0;
    let highAvgSubjects = 0;

    appState.subjects.forEach(s => {
      const masteredInSub = s.chapters.filter(c => c.repetitions >= c.targetRepetitions).length;
      masteredChapters += masteredInSub;
      totalChaptersCount += s.chapters.length;
      totalReps += s.chapters.reduce((sum, c) => sum + c.repetitions, 0);
      
      if (s.chapters.length > 0 && masteredInSub === s.chapters.length) {
        completedSubjects += 1;
      }

      if (s.assessments.length > 0) {
        const avg = s.assessments.reduce((acc, curr) => acc + (curr.mark / curr.total), 0) / s.assessments.length;
        if (avg >= 0.9) highAvgSubjects += 1;
      }
    });

    const points = (totalReps * 10) + (masteredChapters * 50) + (completedSubjects * 200);
    const level = Math.floor(points / 500) + 1;
    const pointsToNext = 500 - (points % 500);

    const earnedIds = new Set<string>();
    if (masteredChapters >= 1) earnedIds.add('first_topic');
    if (totalReps >= 50) earnedIds.add('repetition_pro');
    if (totalReps >= 100) earnedIds.add('century_club');
    if (completedSubjects >= 1) earnedIds.add('subject_master');
    if (highAvgSubjects >= 1) earnedIds.add('high_achiever');
    if (totalChaptersCount >= 20) earnedIds.add('dedicated_student');
    if (completedSubjects >= 5) earnedIds.add('completionist');

    return { 
      points, 
      level, 
      pointsToNext, 
      earnedIds, 
      totalReps, 
      masteredChapters, 
      completedSubjects, 
      totalChaptersCount 
    };
  }, [appState.subjects]);

  const stats = useMemo(() => {
    const totalChapters = gamificationStats.totalChaptersCount;
    const completedChapters = gamificationStats.masteredChapters;
    const totalReps = gamificationStats.totalReps;
    
    const chartData = appState.subjects.map(s => ({
      name: s.name.substring(0, 15) + (s.name.length > 15 ? '...' : ''),
      progress: s.chapters.length === 0 ? 0 : Math.round((s.chapters.filter(c => c.repetitions >= c.targetRepetitions).length / s.chapters.length) * 100),
      color: s.color
    })).filter(d => d.progress > 0 || appState.subjects.length < 5);

    return { totalChapters, completedChapters, totalReps, chartData };
  }, [appState.subjects, gamificationStats]);

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setAppState(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
  };

  const addSubject = () => {
    if (!newSubjectName.trim()) return;
    const newSub: Subject = {
      id: Math.random().toString(36).substr(2, 9),
      name: newSubjectName,
      chapters: [],
      assessments: [],
      color: SUBJECT_COLORS[appState.subjects.length % SUBJECT_COLORS.length]
    };
    setAppState(prev => ({ ...prev, subjects: [...prev.subjects, newSub] }));
    setNewSubjectName('');
    setShowSubjectForm(false);
  };

  const deleteSubject = (id: string) => {
    if (confirm("Are you sure you want to delete this subject and all its data?")) {
      setAppState(prev => ({ ...prev, subjects: prev.subjects.filter(s => s.id !== id) }));
      setSelectedSubjectId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
            <Target size={20} />
          </div>
          <h1 className="font-bold text-slate-800">OptoStudy</h1>
        </div>
        <button 
          onClick={() => setShowProfile(true)}
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-blue-600 border border-slate-200"
        >
          <User size={20} />
        </button>
      </div>

      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Target size={24} />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 tracking-tight">OptoStudy</h1>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Mastering Vision</p>
          </div>
        </div>

        <div className="p-4 mx-4 my-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white shadow-lg shadow-blue-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <p className="text-xs text-blue-100 font-medium">Rank: Visionary</p>
              <p className="text-sm font-bold">Level {gamificationStats.level}</p>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold">
              <span>{gamificationStats.points} PTS</span>
              <span>Next Lvl: {gamificationStats.pointsToNext}</span>
            </div>
            <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-700"
                style={{ width: `${((500 - gamificationStats.pointsToNext) / 500) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <button 
            onClick={() => { setSelectedSubjectId(null); setShowProfile(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${!selectedSubjectId && !showProfile ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button 
            onClick={() => { setShowProfile(true); setSelectedSubjectId(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${showProfile ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Medal size={20} />
            My Achievements
          </button>
          
          <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Subjects
          </div>
          
          {appState.subjects.map(subject => (
            <button 
              key={subject.id}
              onClick={() => { setSelectedSubjectId(subject.id); setShowProfile(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm ${selectedSubjectId === subject.id ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }} />
              <span className="truncate">{subject.name}</span>
            </button>
          ))}
          
          <button 
            onClick={() => setShowSubjectForm(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all text-sm italic"
          >
            <Plus size={18} />
            Add New Subject
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={initializeDefault} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-600 transition-all text-sm">
            <LogOut size={18} />
            Reset All Data
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        {showProfile ? (
          <div className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
               <div>
                  <h2 className="text-3xl font-black text-slate-900">Achievements</h2>
                  <p className="text-slate-500">You've earned {gamificationStats.earnedIds.size} out of {BADGES.length} badges.</p>
               </div>
               <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Study Points</p>
                  <p className="text-3xl font-black text-blue-600">{gamificationStats.points} <span className="text-sm font-medium text-slate-400">PTS</span></p>
               </div>
            </header>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {BADGES.map(badge => {
                const isEarned = gamificationStats.earnedIds.has(badge.id);
                const Icon = IconMap[badge.icon];
                return (
                  <div 
                    key={badge.id} 
                    className={`p-6 rounded-3xl border transition-all duration-500 text-center flex flex-col items-center group ${isEarned ? 'bg-white border-slate-200 shadow-md scale-100' : 'bg-slate-100/50 border-slate-100 opacity-60 grayscale scale-95'}`}
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg ${badge.color} ${isEarned ? 'animate-bounce-short' : ''}`}>
                      <Icon size={32} />
                    </div>
                    <h4 className={`font-bold text-sm mb-1 ${isEarned ? 'text-slate-800' : 'text-slate-400'}`}>{badge.name}</h4>
                    <p className="text-[10px] text-slate-500 leading-tight">{badge.description}</p>
                    {!isEarned && (
                      <div className="mt-3 bg-slate-200 h-1.5 w-12 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 w-1/3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="bg-blue-600 p-8 rounded-3xl text-white relative overflow-hidden shadow-2xl shadow-blue-200">
               <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="text-center md:text-left">
                     <h3 className="text-2xl font-black mb-2">Keep it up, {appState.username}!</h3>
                     <p className="text-blue-100 max-w-md">You're in the top 15% of students this month. Every repetition brings you closer to clinical excellence.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                       <p className="text-3xl font-black">{gamificationStats.level}</p>
                       <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Level</p>
                    </div>
                    <div className="w-px h-12 bg-white/20" />
                    <div className="text-center">
                       <p className="text-3xl font-black">{gamificationStats.totalReps}</p>
                       <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Reps</p>
                    </div>
                    <div className="w-px h-12 bg-white/20" />
                    <div className="text-center">
                       <p className="text-3xl font-black">{gamificationStats.completedSubjects}</p>
                       <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Masters</p>
                    </div>
                  </div>
               </div>
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />
            </div>
          </div>
        ) : !selectedSubjectId ? (
          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900">Study Dashboard</h2>
                <p className="text-slate-500">Welcome back! You have {gamificationStats.points} total study points.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowSubjectForm(true)}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
                >
                  <Plus size={20} /> New Subject
                </button>
              </div>
            </header>

            <section>
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recent Achievements</h3>
                 <button onClick={() => setShowProfile(true)} className="text-xs font-bold text-blue-600 hover:underline">View All</button>
               </div>
               <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {BADGES.filter(b => gamificationStats.earnedIds.has(b.id)).length > 0 ? (
                    BADGES.filter(b => gamificationStats.earnedIds.has(b.id)).map(badge => {
                      const Icon = IconMap[badge.icon];
                      return (
                        <div key={badge.id} className="flex-none bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-sm hover:shadow-md transition-all">
                           <div className={`w-10 h-10 rounded-xl ${badge.color} flex items-center justify-center text-white`}>
                              <Icon size={20} />
                           </div>
                           <span className="font-bold text-slate-700 text-sm whitespace-nowrap">{badge.name}</span>
                        </div>
                      )
                    })
                  ) : (
                    <div className="w-full bg-slate-50 border border-dashed border-slate-200 rounded-2xl py-8 text-center text-slate-400 italic text-sm">
                      No badges earned yet. Complete your first topic to unlock!
                    </div>
                  )}
               </div>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'Total Topics', value: stats.totalChapters, icon: BookOpen, color: 'blue' },
                { label: 'Completed', value: stats.completedChapters, icon: CheckCircle2, color: 'emerald' },
                { label: 'Total Repetitions', value: stats.totalReps, icon: Zap, color: 'amber' },
                { label: 'Mastery Level', value: stats.totalChapters === 0 ? '0%' : `${Math.round((stats.completedChapters / stats.totalChapters) * 100)}%`, icon: Trophy, color: 'purple' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
                  <div className={`p-3 rounded-xl bg-${stat.color === 'amber' ? 'amber-50' : stat.color + '-50'} text-${stat.color === 'amber' ? 'amber-500' : stat.color + '-600'}`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <BarChart3 className="text-blue-600" size={20} /> Course Mastery Breakdown
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                      <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: '#f8fafc' }}
                      />
                      <Bar dataKey="progress" radius={[4, 4, 0, 0]} barSize={40}>
                        {stats.chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Calendar className="text-red-500" size={20} /> Upcoming Exams
                </h3>
                <div className="flex-1 space-y-4">
                  {appState.subjects
                    .filter(s => s.examDate)
                    .sort((a, b) => new Date(a.examDate!).getTime() - new Date(b.examDate!).getTime())
                    .slice(0, 5)
                    .map(s => {
                      const daysLeft = Math.ceil((new Date(s.examDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      return (
                        <div key={s.id} className="flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                            <div>
                              <p className="text-sm font-bold text-slate-800 truncate max-w-[120px]">{s.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{new Date(s.examDate!).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className={`text-xs font-bold px-2 py-1 rounded-lg ${daysLeft < 7 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                            {daysLeft}d left
                          </div>
                        </div>
                      );
                    })}
                  {appState.subjects.filter(s => s.examDate).length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 italic text-sm py-10">
                      No exam dates set yet.
                      <p className="text-xs mt-2 not-italic text-slate-500">Go to subject settings to set goals.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Your Subjects</h3>
                <div className="text-xs font-medium text-slate-400 bg-slate-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  Total: {appState.subjects.length}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {appState.subjects.map(subject => (
                  <SubjectCard 
                    key={subject.id} 
                    subject={subject} 
                    onClick={() => { setSelectedSubjectId(subject.id); setShowProfile(false); }} 
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1 h-screen overflow-hidden">
            <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-6 sticky top-0 z-40">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedSubjectId(null)}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedSubject?.color }} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Course Mastery</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                      {selectedSubject?.name}
                    </h2>
                  </div>
                </div>

                <div className="flex p-1 bg-slate-100 rounded-2xl w-full md:w-auto overflow-x-auto scrollbar-hide">
                  {[
                    { id: 'chapters', label: 'Topics', icon: BookOpen },
                    { id: 'assessments', label: 'Assessments', icon: GraduationCap },
                    { id: 'settings', label: 'Settings', icon: Settings },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <tab.icon size={18} />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
              <div className="max-w-5xl mx-auto">
                {activeTab === 'chapters' && selectedSubject && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm col-span-1 flex flex-col items-center justify-center text-center">
                         <div className="relative w-32 h-32 mb-4">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-slate-100"
                                strokeDasharray="100, 100"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                              />
                              <path
                                className="transition-all duration-1000"
                                style={{ color: selectedSubject.color }}
                                strokeDasharray={`${selectedSubject.chapters.length === 0 ? 0 : Math.round((selectedSubject.chapters.filter(c => c.repetitions >= c.targetRepetitions).length / selectedSubject.chapters.length) * 100)}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                              <span className="text-2xl font-black text-slate-800">
                                {selectedSubject.chapters.length === 0 ? 0 : Math.round((selectedSubject.chapters.filter(c => c.repetitions >= c.targetRepetitions).length / selectedSubject.chapters.length) * 100)}%
                              </span>
                              <span className="text-[10px] uppercase font-bold text-slate-400">Mastery</span>
                            </div>
                         </div>
                         <h4 className="font-bold text-slate-800">Course Progress</h4>
                         <p className="text-xs text-slate-500 mt-1">{selectedSubject.chapters.filter(c => c.repetitions >= c.targetRepetitions).length} of {selectedSubject.chapters.length} topics fully studied</p>
                      </div>

                      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm col-span-1 md:col-span-2 space-y-4">
                         <div className="flex justify-between items-start">
                           <h4 className="font-bold text-slate-800 flex items-center gap-2">
                             <Target className="text-blue-500" size={18} /> Master Goals
                           </h4>
                           {selectedSubject.examDate && (
                             <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-100 animate-pulse">
                               <Clock size={12} />
                               <span className="text-[10px] font-black uppercase tracking-wider">
                                 {Math.max(0, Math.ceil((new Date(selectedSubject.examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} Days to Exam
                               </span>
                             </div>
                           )}
                         </div>

                         {selectedSubject.studyGoal && (
                           <div className="p-4 bg-slate-50 rounded-2xl border border-blue-100 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-2 opacity-10">
                                <Flag size={40} className="text-blue-600" />
                              </div>
                              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Primary Objective</p>
                              <p className="text-sm font-medium text-slate-700 leading-relaxed italic">"{selectedSubject.studyGoal}"</p>
                           </div>
                         )}

                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Points Earned</p>
                               <div className="flex items-center gap-2">
                                  <Star size={16} className="text-amber-500" />
                                  <p className="text-2xl font-black text-slate-800">
                                    {(selectedSubject.chapters.reduce((sum, c) => sum + c.repetitions, 0) * 10) + (selectedSubject.chapters.filter(c => c.repetitions >= c.targetRepetitions).length * 50)}
                                  </p>
                               </div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Repetition Level</p>
                               <div className="flex items-center gap-2">
                                  <Zap size={16} className="text-blue-500" />
                                  <p className="text-2xl font-black text-slate-800">
                                    {selectedSubject.chapters.reduce((sum, c) => sum + c.repetitions, 0)}
                                  </p>
                               </div>
                            </div>
                         </div>
                      </div>
                    </div>

                    <ChapterList 
                      chapters={selectedSubject.chapters} 
                      onUpdate={(chapters) => updateSubject(selectedSubject.id, { chapters })}
                    />
                  </div>
                )}

                {activeTab === 'assessments' && selectedSubject && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <AssessmentTracker 
                      assessments={selectedSubject.assessments}
                      onUpdate={(assessments) => updateSubject(selectedSubject.id, { assessments })}
                    />
                  </div>
                )}

                {activeTab === 'settings' && selectedSubject && (
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-6">Subject Settings & Goals</h3>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Upcoming Exam Date</label>
                            <div className="relative">
                              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                              <input 
                                type="date" 
                                className="w-full border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                                value={selectedSubject.examDate || ''}
                                onChange={(e) => updateSubject(selectedSubject.id, { examDate: e.target.value })}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Subject Name</label>
                            <input 
                              type="text" 
                              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                              value={selectedSubject.name}
                              onChange={(e) => updateSubject(selectedSubject.id, { name: e.target.value })}
                            />
                          </div>
                        </div>

                        <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">Subject Study Goal</label>
                           <textarea 
                            rows={3}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 text-sm"
                            placeholder="Set a clear goal for this course (e.g. Master all pathology slides before week 10)"
                            value={selectedSubject.studyGoal || ''}
                            onChange={(e) => updateSubject(selectedSubject.id, { studyGoal: e.target.value })}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Subject Theme Color</label>
                          <div className="flex flex-wrap gap-3">
                            {SUBJECT_COLORS.map(color => (
                              <button 
                                key={color}
                                onClick={() => updateSubject(selectedSubject.id, { color })}
                                className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${selectedSubject.color === color ? 'ring-4 ring-offset-2 ring-blue-200' : ''}`}
                                style={{ backgroundColor: color }}
                              >
                                {selectedSubject.color === color && <div className="w-2 h-2 bg-white rounded-full shadow-sm" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                      <div className="text-sm text-slate-500">
                        <p className="font-bold text-slate-700">Dangerous Zone</p>
                        <p>Removing this subject will permanently erase all its data.</p>
                      </div>
                      <button 
                        onClick={() => deleteSubject(selectedSubject.id)}
                        className="bg-red-50 text-red-600 px-6 py-2.5 rounded-xl hover:bg-red-100 transition-all font-semibold"
                      >
                        Delete Subject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {showSubjectForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-slate-900 mb-2">New Subject</h3>
            <p className="text-slate-500 mb-6">Enter the name of the optometry subject you want to track.</p>
            <input 
              autoFocus
              type="text" 
              className="w-full border-2 border-slate-100 rounded-2xl px-5 py-4 focus:border-blue-500 outline-none mb-6 text-lg font-medium transition-all"
              placeholder="e.g. Ocular Anatomy"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSubject()}
            />
            <div className="flex gap-3">
              <button 
                onClick={() => setShowSubjectForm(false)}
                className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={addSubject}
                className="flex-2 bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                Create Subject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
