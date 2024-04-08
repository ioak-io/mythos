export type ProjectResponse = {
  projectId: string;
  participantEmail: string;
  status: boolean;
  score: string;
  id: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  createdDate?: string;
};
