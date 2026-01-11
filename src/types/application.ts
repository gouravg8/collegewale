export type ApplicationStatus = "DRAFT" | "SUBMITTED" | "VERIFIED" | "APPROVED" | "ADMITTED";

export interface Student {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    dob?: string;
    gender?: "MALE" | "FEMALE" | "OTHER";
    address?: string;
}

export interface ApplicationDocument {
    id: string;
    name: string;
    type: string; // e.g., "AADHAR", "MARKSHEET_10", "MARKSHEET_12"
    url?: string;
    status: "PENDING" | "UPLOADED" | "VERIFIED" | "REJECTED";
    uploadedBy?: string; // "COLLEGE" | "STUDENT" (though only College can upload for now)
    uploadedAt?: string;
}

export interface Application {
    id: string;
    studentId: string;
    student: Student;
    course: string; // "GNM" | "ANM" | "BSC"
    academicYear: string;
    status: ApplicationStatus;
    documents: ApplicationDocument[];
    timeline: {
        status: ApplicationStatus;
        timestamp: string;
        updatedBy: string;
        comment?: string;
    }[];
    createdAt: string;
    updatedAt: string;
}
