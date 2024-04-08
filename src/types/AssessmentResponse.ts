export type AssessmentResponse = {
  assessmentId: string;
  participantEmail: string;
  status: boolean;
  score: string;
  id: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  createdDate?: string;
};
