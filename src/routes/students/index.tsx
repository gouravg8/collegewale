import { HelpPanel } from "@/components/HelpPanel";
import { requirePrivilege } from "@/config/auth-utils";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Input, Space, Table, Tag } from "antd";
import { useState } from "react";
import { MdAdd, MdSearch } from "react-icons/md";

export const Route = createFileRoute("/students/")({
  beforeLoad: requirePrivilege("COLLEGE"),
  component: StudentsPage,
});

function StudentsPage() {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  // For now, this mimics a list of Admitted students
  const students = [
    {
      id: "1",
      fullName: "Admitted Student 1",
      email: "student1@example.com",
      phone: "+91 9876543210",
      course: "GNM",
      status: "ADMITTED",
      admissionDate: "2024-01-15",
    },
    {
      id: "2",
      fullName: "Admitted Student 2",
      email: "student2@example.com",
      phone: "+91 9876543211",
      course: "ANM",
      status: "ADMITTED",
      admissionDate: "2024-01-12",
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a: any, b: any) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
      filters: [
        { text: "GNM", value: "GNM" },
        { text: "ANM", value: "ANM" },
      ],
      onFilter: (value: any, record: any) => record.course === value,
    },
    {
      title: "Admission Date",
      dataIndex: "admissionDate",
      key: "admissionDate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color="green">{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, _record: any) => (
        <Space>
          <Button type="link" size="small">
            View Profile
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <HelpPanel context="students" />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>Enrolled Students</h1>
        <Button
          type="primary"
          icon={<MdAdd />}
          onClick={() => navigate({ to: "/applications/new" })}
        >
          Add New Student
        </Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search students..."
          prefix={<MdSearch />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={students}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} students`,
        }}
      />
    </div>
  );
}
