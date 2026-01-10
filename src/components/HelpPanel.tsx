import { Card, Typography } from "antd";
import { useState } from "react";
import { MdHelp, MdInfo } from "react-icons/md";

const { Text, Paragraph } = Typography;

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
    const [expanded, setExpanded] = useState(true);
    const help = contextualHelp[context] || contextualHelp.dashboard;

    if (!expanded) {
        return (
            <Card
                size="small"
                style={{
                    position: "fixed",
                    right: 16,
                    top: 100,
                    width: 48,
                    cursor: "pointer",
                    zIndex: 100,
                }}
                onClick={() => setExpanded(true)}
            >
                <MdHelp size={24} style={{ color: "#1890ff" }} />
            </Card>
        );
    }

    return (
        <Card
            title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <MdInfo style={{ color: "#1890ff" }} />
                    <span>{help.title}</span>
                </div>
            }
            size="small"
            style={{
                position: "fixed",
                right: 16,
                top: 100,
                width: 320,
                maxHeight: "calc(100vh - 200px)",
                overflow: "auto",
                zIndex: 100,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
            extra={
                <Text
                    type="secondary"
                    style={{ cursor: "pointer", fontSize: 20 }}
                    onClick={() => setExpanded(false)}
                >
                    ×
                </Text>
            }
        >
            <div style={{ fontSize: 13 }}>
                <Paragraph style={{ marginBottom: 8, fontWeight: 500 }}>
                    Instructions:
                </Paragraph>
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                    {help.instructions.map((instruction, idx) => (
                        <li key={idx} style={{ marginBottom: 6 }}>
                            <Text>{instruction}</Text>
                        </li>
                    ))}
                </ul>

                {help.tips && help.tips.length > 0 && (
                    <>
                        <Paragraph style={{ marginTop: 16, marginBottom: 8, fontWeight: 500 }}>
                            💡 Tips:
                        </Paragraph>
                        <ul style={{ paddingLeft: 20, margin: 0 }}>
                            {help.tips.map((tip, idx) => (
                                <li key={idx} style={{ marginBottom: 6 }}>
                                    <Text type="secondary">{tip}</Text>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </Card>
    );
}
