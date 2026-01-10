import { createFileRoute } from "@tanstack/react-router";
import { Button, Input, Space, Table, Tag } from "antd";
import { useState } from "react";
import { MdAdd, MdSearch } from "react-icons/md";

export const Route = createFileRoute("/students/")({
  component: StudentsPage,
});

function StudentsPage() {
  const [searchText, setSearchText] = useState("");

  // TODO: Fetch from API
  const students = [
    {
      id: "1",
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+91 9876543210",
      course: "GNM",
      status: "Active",
    },
    {
      id: "2",
      fullName: "Jane Smith",
      email: "jane@example.com",
      phone: "+91 9876543211",
      course: "ANM",
      status: "Active",
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" size="small">
            View
          </Button>
          <Button type="link" size="small">
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>Students</h1>
        <Button type="primary" icon={<MdAdd />}>
          Add Student
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
