
interface Description {
    overview: string;
    steps: string[];
    expectedOutcome: string;
}

interface TestCase {
    _id:string;
    applicationId: string; 
    requirementId: string; 
    usecaseId: string;
    description: Description; 
    summary: string; 
    priority: string; 
    comments?: string; 
    components: string; 
    label: string; 
    createdDate: Date; 
    lastModifiedDate: Date; 
}

