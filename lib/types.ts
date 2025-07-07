// lib/types.ts

export enum QuestionType {
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  TEXT = "TEXT",
  FILL_IN_THE_BLANK = "FILL_IN_THE_BLANK",
  WRITING = "WRITING",
  IMAGE_CHOICE = "IMAGE_CHOICE",
  DRAWING = "DRAWING",
  PATTERN = "PATTERN",
  MATCHING = "MATCHING",
  CLOCK = "CLOCK",
  COMPARISON = "COMPARISON",
  GRAMMAR = "GRAMMAR",
  WORD_SORT = "WORD_SORT",
  FRACTION = "FRACTION",
}

export type Subject = "ELA" | "Math";
export type Grade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface Question {
  id: string;
  id_prisma?: string;
  type: QuestionType;
  question: string;
  passage?: string;
  image?: string;
  options?: string[];
  correctAnswer?: string | string[];
  category?: string;
  blanks?: string[];
  columns?: any[];
  dataAihint?: string;
  isDrawing?: boolean;
  drawingQuestion?: boolean;
}

export interface AssessmentAnswer {
  questionId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  correctAnswer?: string | string[];
}

export interface AssessmentResult {
  id: string;
  score: number;
  totalQuestions: number;
  answers: AssessmentAnswer[];
  subject: Subject;
  grade: Grade;
  takenAt: string;
}

export interface ChildInformation {
  id: string;
  childName: string;
  grade: Grade;
  accessCode: string;
}

export interface ParentUser {
  id: string;
  email: string;
  children: ChildInformation[];
}

export interface DrawingData {
  circles?: Array<{
    x: number;
    y: number;
    radius: number;
    type?: 'circle' | 'oval';
  }>;
  lines?: Array<{
    points: number[];
    color: string;
  }>;
  shapes?: Array<{
    x: number;
    y: number;
    type: 'circle' | 'triangle' | 'square';
    size: number;
  }>;
}

export interface AnalysisResult {
  score: number;
  feedback: string;
  details?: any;
  imagePath?: string;
}