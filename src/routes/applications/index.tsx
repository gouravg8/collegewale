import { HelpPanel } from "@/components/HelpPanel";
import { getCurrentUser, requirePrivilege } from "@/config/auth-utils";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Input, Select, Space, Table, Tag } from "antd";
import { useState } from "react";
import { MdAdd, MdSearch } from "react-icons/md";

// Allow STUDENT role to access, we filter inside
export const Route = createFileRoute("/applications/")({
  beforeLoad: requirePrivilege("STUDENT"),
  component: ApplicationsPage,
});

const statusColors: Record<string, string> = {
  DRAFT: "default",
  SUBMITTED: "processing",
  VERIFIED: "blue",
  APPROVED: "purple",
  ADMITTED: "success",
};

function ApplicationsPage() {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const userRole = currentUser.privilege;

  // Mock Data
  let allApplications = [
    {
      id: "1",
      studentName: "John Doe",
      email: "john@example.com",
      agentId: "agent1",
      course: "GNM",
      academicYear: "2024-25",
      status: "SUBMITTED",
      createdAt: "2024-01-10",
    },
    {
      id: "2",
      studentName: "Jane Smith",
      email: "jane@example.com",
      agentId: "agent2",
      course: "ANM",
      academicYear: "2024-25",
      status: "VERIFIED",
      createdAt: "2024-01-09",
    },
    {
      id: "3",
      studentName: "Admin User", // Simulating current user as student
      email: "admin@example.com",
      agentId: "agent1",
      course: "BSC",
      academicYear: "2024-25",
      status: "DRAFT",
      createdAt: "2024-01-11",
    },
  ];

  // Role-Based Filtering
  let visibleApplications = allApplications;

  if (userRole === "STUDENT") {
    // Filter by User Email (mocking 'own' application)
    visibleApplications = allApplications.filter(app => app.email === currentUser.email);
  } else if (userRole === "AGENT") {
    // Filter by Agent ID (mock) - assuming current user is 'agent1'
    visibleApplications = allApplications.filter(app => app.agentId === "agent1");
  }
  // COLLEGE and ADMIN see everything

  // Client-side text/status filtering
  const filteredApplications = visibleApplications.filter(app => {
    const matchesSearch = app.studentName.toLowerCase().includes(searchText.toLowerCase()) ||
      app.course.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter ? app.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: "Student Name",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
    },
    {
      title: "Academic Year",
      dataIndex: "academicYear",
      key: "academicYear",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Button
          type="link"
          size="small"
          onClick={() => navigate({ to: "/applications/$applicationId", params: { applicationId: record.id } })}
        >
          View Details
        </Button>
      ),
    },
  ];

  const canCreateApplication = ["COLLEGE", "ADMIN", "AGENT"].includes(userRole);

  return (
    <div>
      <HelpPanel context="applications" />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>
          {userRole === "STUDENT" ? "My Application" : "Applications"}
        </h1>
        {canCreateApplication && (
          <Button type="primary" icon={<MdAdd />} onClick={() => navigate({ to: "/applications/new" })}>
            New Application
          </Button>
        )}
      </div>

      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search applications..."
          prefix={<MdSearch />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Filter by status"
          style={{ width: 200 }}
          value={statusFilter}
          onChange={setStatusFilter}
          allowClear
        >
          <Select.Option value="DRAFT">Draft</Select.Option>
          <Select.Option value="SUBMITTED">Submitted</Select.Option>
          <Select.Option value="VERIFIED">Verified</Select.Option>
          <Select.Option value="APPROVED">Approved</Select.Option>
          <Select.Option value="ADMITTED">Admitted</Select.Option>
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredApplications}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} applications`,
        }}
        onRow={(record) => ({
          onClick: () => navigate({ to: "/applications/$applicationId", params: { applicationId: record.id } }),
          style: { cursor: 'pointer' }
        })}
      />
    </div>
  );
}
