import { HelpPanel } from "@/components/HelpPanel";
import { requirePrivilege } from "@/config/auth-utils";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Input, Select, Space, Table, Tag } from "antd";
import { useState } from "react";
import { MdAdd, MdSearch } from "react-icons/md";

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

  // TODO: Fetch from API
  const applications = [
    {
      id: "1",
      studentName: "John Doe",
      course: "GNM",
      academicYear: "2024-25",
      status: "SUBMITTED",
      createdAt: "2024-01-10",
    },
    {
      id: "2",
      studentName: "Jane Smith",
      course: "ANM",
      academicYear: "2024-25",
      status: "VERIFIED",
      createdAt: "2024-01-09",
    },
  ];

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
        <h1 style={{ margin: 0 }}>Applications</h1>
        <Button type="primary" icon={<MdAdd />} onClick={() => navigate({ to: "/applications/new" })}>
          New Application
        </Button>
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
        dataSource={applications}
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
