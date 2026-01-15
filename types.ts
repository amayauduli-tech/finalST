
export interface Chapter {
  id: string;
  name: string;
  repetitions: number;
  targetRepetitions: number;
}

export interface Assessment {
  id: string;
  name: string;
  mark: number;
  total: number;
  date: string;
}

export interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
  assessments: Assessment[];
  examDate?: string;
  studyGoal?: string;
  color: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface AppState {
  subjects: Subject[];
  username?: string;
  level?: number;
}
