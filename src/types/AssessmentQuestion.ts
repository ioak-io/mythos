export type AssessmentQuestion = {
  assessmentId: string;
  type: string;
  question: string;
  answer: string;
  choices: string[];
  id: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  createdDate?: string;
};
