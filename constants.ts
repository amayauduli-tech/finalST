
export const INITIAL_SUBJECTS = [
  "Physical Optics",
  "Basic Optometry",
  "Ophthalmic Dispensing",
  "Systemic Conditions with Ocular Changes",
  "Contact Lenses",
  "Low Vision",
  "Orthoptics",
  "Pathology",
  "Microbiology and Parasitology",
  "Pharmacology",
  "Ethics",
  "Ophthalmology"
];

export const SUBJECT_COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#10b981", // emerald
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
  "#6366f1", // indigo
  "#14b8a6", // teal
  "#a855f7", // purple
  "#0ea5e9", // sky
];

export const BADGES = [
  { id: 'first_topic', name: 'First Milestone', description: 'Complete your first topic target', icon: 'Star', color: 'bg-amber-400' },
  { id: 'repetition_pro', name: 'Study Machine', description: 'Reach 50 total repetitions', icon: 'Zap', color: 'bg-blue-500' },
  { id: 'century_club', name: 'Century Club', description: 'Reach 100 total repetitions', icon: 'Award', color: 'bg-purple-600' },
  { id: 'subject_master', name: 'Course Specialist', description: 'Complete 100% of a subject', icon: 'BookOpen', color: 'bg-emerald-500' },
  { id: 'high_achiever', name: 'High Achiever', description: 'Average >90% in assessments for a subject', icon: 'Trophy', color: 'bg-orange-500' },
  { id: 'dedicated_student', name: 'Dedication', description: 'Add more than 20 topics across all subjects', icon: 'Heart', color: 'bg-rose-400' },
  { id: 'completionist', name: 'The Visionary', description: 'Complete 5 different subjects', icon: 'Crown', color: 'bg-yellow-400' },
];

export const STORAGE_KEY = "optometry_study_tracker_data";
