import { getCurrentUser, requirePrivilege } from "@/config/auth-utils";
import type { Application, ApplicationStatus } from "@/types/application";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Alert, Button, Card, Descriptions, message, Modal, Tag, Timeline, Upload } from "antd";
import { useState } from "react";
import { MdArrowBack, MdDescription, MdHistory, MdPerson, MdUpload } from "react-icons/md";

export const Route = createFileRoute("/applications/$applicationId")({
  beforeLoad: requirePrivilege("STUDENT"), // Both Student and College can access
  component: ApplicationDetailPage,
});

const statusColors: Record<ApplicationStatus, string> = {
  DRAFT: "default",
  SUBMITTED: "processing",
  VERIFIED: "blue",
  APPROVED: "purple",
  ADMITTED: "success",
};

function ApplicationDetailPage() {
  const navigate = useNavigate();
  const { applicationId } = Route.useParams();
  const currentUser = getCurrentUser();
  const isCollege = currentUser.privilege === "COLLEGE" || currentUser.privilege === "ADMIN";

  // Mock Data - In real app, fetch by ID
  const [application, setApplication] = useState<Application>({
    id: applicationId,
    studentId: "student-123",
    student: {
      id: "student-123",
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+91 9876543210",
      gender: "MALE",
      dob: "2000-01-01",
    },
    course: "GNM",
    academicYear: "2024-2025",
    status: "SUBMITTED",
    documents: [
      { id: "doc1", name: "10th Marksheet", type: "MARKSHEET_10", status: "PENDING", url: "" },
      { id: "doc2", name: "12th Marksheet", type: "MARKSHEET_12", status: "UPLOADED", url: "https://example.com/doc.pdf" },
      { id: "doc3", name: "Aadhar Card", type: "AADHAR", status: "VERIFIED", url: "https://example.com/aadhar.pdf" },
    ],
    timeline: [
      { status: "DRAFT", timestamp: "2024-01-01", updatedBy: "System" },
      { status: "SUBMITTED", timestamp: "2024-01-02", updatedBy: "Agent" },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-02",
  });

  const updateStatus = (newStatus: ApplicationStatus) => {
    Modal.confirm({
      title: `Mark application as ${newStatus}?`,
      content: newStatus === "ADMITTED" ? "This will occupy a seat in the selected course. This action cannot be undone." : "Are you sure you want to change the status?",
      onOk: () => {
        setApplication(prev => ({ ...prev, status: newStatus }));
        message.success(`Application marked as ${newStatus}`);
      }
    });
  };

  const getNextActions = () => {
    if (!isCollege) return null;

    switch (application.status) {
      case "DRAFT":
        return <Button type="primary" onClick={() => updateStatus("SUBMITTED")}>Submit Application</Button>;
      case "SUBMITTED":
        return (
          <div className="flex gap-2">
            <Button onClick={() => updateStatus("DRAFT")}>Revert to Draft</Button>
            <Button type="primary" onClick={() => updateStatus("VERIFIED")}>Verify Documents</Button>
          </div>
        );
      case "VERIFIED":
        return <Button type="primary" className="bg-purple-600" onClick={() => updateStatus("APPROVED")}>Approve Application</Button>;
      case "APPROVED":
        return <Button type="primary" className="bg-green-600" onClick={() => updateStatus("ADMITTED")}>Admit Student</Button>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button icon={<MdArrowBack />} type="text" onClick={() => navigate({ to: "/applications" })} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 m-0 flex items-center gap-3">
              {application.student.fullName}
              <Tag color={statusColors[application.status]} className="text-sm font-normal m-0 px-2 py-0.5 rounded-full">
                {application.status}
              </Tag>
            </h1>
            <p className="text-gray-500 m-0">Application ID: {application.id} • {application.course} ({application.academicYear})</p>
          </div>
        </div>
        <div>
          {getNextActions()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Documents */}
        <div className="lg:col-span-2 space-y-6">
          <Card title={<span className="flex items-center gap-2"><MdPerson /> Student Details</span>} className="shadow-sm">
            <Descriptions column={2} size="small">
              <Descriptions.Item label="Full Name">{application.student.fullName}</Descriptions.Item>
              <Descriptions.Item label="Email">{application.student.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{application.student.phone}</Descriptions.Item>
              <Descriptions.Item label="Gender">{application.student.gender}</Descriptions.Item>
              <Descriptions.Item label="Date of Birth">{application.student.dob}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title={<span className="flex items-center gap-2"><MdDescription /> Documents</span>} className="shadow-sm">
            {!isCollege && application.status !== "ADMITTED" && (
              <Alert message="Only college staff can upload documents. Please contact administration for corrections." type="info" showIcon className="mb-4" />
            )}

            <div className="space-y-4">
              {application.documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${doc.status === 'VERIFIED' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                      <MdDescription />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 m-0">{doc.name}</p>
                      <p className="text-xs text-gray-500 m-0">Status: <span className="uppercase">{doc.status}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {doc.url && <Button size="small" type="link" href={doc.url} target="_blank">View</Button>}

                    {isCollege && application.status !== "ADMITTED" && (
                      <Upload showUploadList={false}>
                        <Button size="small" icon={<MdUpload />}>Upload</Button>
                      </Upload>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Timeline */}
        <div className="lg:col-span-1">
          <Card title={<span className="flex items-center gap-2"><MdHistory /> Application History</span>} className="shadow-sm">
            <Timeline
              items={application.timeline.map((event, index) => ({
                color: index === application.timeline.length - 1 ? 'blue' : 'gray',
                children: (
                  <div className="pb-4">
                    <p className="font-medium text-gray-900 m-0">{event.status}</p>
                    <p className="text-xs text-gray-500 m-0">{event.timestamp} by {event.updatedBy}</p>
                  </div>
                )
              }))}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
