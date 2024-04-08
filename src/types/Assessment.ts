export type Project = {
  name: string;
  jobDescription?: string;
  duration?: string;
  id?: string;
  status?: "New" | "Active" | "Closed";
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  createdDate?: string;
};
