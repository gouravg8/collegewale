import { MdHelp, MdInfo } from "react-icons/md";

interface HelpPanelProps {
    context: "dashboard" | "students" | "applications" | "documents" | "payments" | "settings" | "reports" | "activity-logs";
}

const contextualHelp: Record<string, { title: string; instructions: string[]; tips?: string[] }> = {
    dashboard: {
        title: "Dashboard Overview",
        instructions: [
            "View key statistics about your institution",
            "Monitor total students and applications",
            "Track pending payments and approvals",
        ],
        tips: ["Check this daily for important updates"],
    },
    students: {
        title: "Manage Your Students",
        instructions: [
            "Add new students to the system",
            "Update student information as needed",
            "Search and filter students by course or status",
        ],
        tips: ["Keep student information up to date for accurate records"],
    },
    applications: {
        title: "Application Management",
        instructions: [
            "Track application status: Draft → Submitted → Verified → Approved → Admitted",
            "Review and approve student applications",
            "Monitor application progress for each academic year",
        ],
        tips: [
            "Applications must be verified before approval",
            "Seats are auto-allocated when status changes to 'Admitted'",
        ],
    },
    documents: {
        title: "Document Upload & Verification",
        instructions: [
            "Upload Aadhaar card, 10+2 marksheet, and Transfer Certificate",
            "Ensure all names match exactly across documents",
            "Verify documents match council records",
            "Accepted formats: PDF, JPG, PNG (max 5MB per file)",
        ],
        tips: [
            "Name mismatches will be flagged automatically",
            "Documents can be flagged for review if issues are found",
        ],
    },
    payments: {
        title: "Fee Collection & Tracking",
        instructions: [
            "Initiate payment collection for students",
            "Track payment status and history",
            "Generate receipts for completed payments",
        ],
        tips: ["All payments are processed securely through Razorpay"],
    },
    settings: {
        title: "College Settings",
        instructions: [
            "Update college information and logo",
            "Manage course types (GNM/ANM)",
            "Set seat capacity for each course",
            "Configure internal roles",
        ],
        tips: ["Changes to seat capacity affect future admissions"],
    },
    reports: {
        title: "Reports & Analytics",
        instructions: [
            "View enrollment statistics by course",
            "Track application trends",
            "Generate payment reports",
            "Export data for external use",
        ],
    },
    "activity-logs": {
        title: "Activity Logs (Admin)",
        instructions: [
            "Monitor all system activities",
            "Track who made what changes",
            "Filter by date, user, or action type",
        ],
        tips: ["Activity logs provide dispute protection and audit trail"],
    },
};

export function HelpPanel({ context }: HelpPanelProps) {
    const help = contextualHelp[context] || contextualHelp.dashboard;

    return (
        <div className="fixed right-4 bottom-24 z-50 group flex flex-col items-end">
            {/* Icon Trigger */}
            <div className="bg-white p-3 rounded-full shadow-md cursor-pointer hover:shadow-lg transition-shadow text-blue-500 border border-gray-100 flex items-center justify-center w-12 h-12">
                <MdHelp size={24} />
            </div>

            {/* Tooltip Content */}
            <div className="absolute bottom-14 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 z-50 pointer-events-none group-hover:pointer-events-auto">
                {/* Header */}
                <div className="flex items-center gap-2 p-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
                    <MdInfo className="text-blue-500" size={18} />
                    <span className="font-medium text-gray-800">{help.title}</span>
                </div>

                {/* Content */}
                <div className="p-4 text-sm">
                    <div className="mb-2 font-medium text-gray-700">Instructions:</div>
                    <ul className="list-disc pl-5 mb-4 text-gray-600 space-y-1">
                        {help.instructions.map((instruction, idx) => (
                            <li key={idx}>{instruction}</li>
                        ))}
                    </ul>

                    {help.tips && help.tips.length > 0 && (
                        <>
                            <div className="mb-2 font-medium text-gray-700 mt-4 flex items-center gap-2">
                                <span>💡</span> Tips:
                            </div>
                            <ul className="list-disc pl-5 text-gray-500 space-y-1">
                                {help.tips.map((tip, idx) => (
                                    <li key={idx}>{tip}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
