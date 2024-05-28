export type  TestCase = {
    id: string;
    suiteId: string;
    useCaseId: string;
    description: any;
    summary: string;
    priority: string;
    comments: string;
    components: string;
    labels: string;
    createdBy: string | null;
    createdDate: string;
    lastModifiedBy: string | null;
    lastModifiedDate: string;
    serializedDescription:string;
  }
  