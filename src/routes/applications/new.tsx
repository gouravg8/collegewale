import { requirePrivilege } from "@/config/auth-utils";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Card, DatePicker, Form, Input, message, Select } from "antd";
import { MdArrowBack } from "react-icons/md";

export const Route = createFileRoute("/applications/new")({
  beforeLoad: requirePrivilege("COLLEGE"),
  component: NewApplicationPage,
});

function NewApplicationPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    console.log("New Application:", values);
    message.loading("Creating application...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    message.success("Application created successfully!");
    // In a real app, we'd get the new ID and redirect to detail page
    // navigate({ to: "/applications/$applicationId", params: { applicationId: "new-id" } });
    navigate({ to: "/applications" });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button
          icon={<MdArrowBack />}
          type="text"
          onClick={() => navigate({ to: "/applications" })}
        />
        <h1 className="text-2xl font-bold text-gray-900 m-0">New Student Application</h1>
      </div>

      <Card className="shadow-sm border-gray-200">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            academicYear: "2024-2025",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Full Name" name="fullName" rules={[{ required: true }]}>
              <Input placeholder="Enter student's full name" size="large" />
            </Form.Item>

            <Form.Item label="Date of Birth" name="dob" rules={[{ required: true }]}>
              <DatePicker className="w-full" size="large" />
            </Form.Item>

            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
              <Input placeholder="student@example.com" size="large" />
            </Form.Item>

            <Form.Item label="Phone" name="phone" rules={[{ required: true, pattern: /^\d{10}$/, message: "Valid 10-digit number required" }]}>
              <Input placeholder="9876543210" size="large" maxLength={10} />
            </Form.Item>

            <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
              <Select placeholder="Select Gender" size="large">
                <Select.Option value="MALE">Male</Select.Option>
                <Select.Option value="FEMALE">Female</Select.Option>
                <Select.Option value="OTHER">Other</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="h-px bg-gray-100 my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Course Applied For" name="course" rules={[{ required: true }]}>
              <Select placeholder="Select Course" size="large">
                <Select.Option value="GNM">GNM</Select.Option>
                <Select.Option value="ANM">ANM</Select.Option>
                <Select.Option value="BSC">B.Sc Nursing</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Academic Year" name="academicYear" rules={[{ required: true }]}>
              <Select size="large">
                <Select.Option value="2024-2025">2024-2025</Select.Option>
                <Select.Option value="2025-2026">2025-2026</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item className="mb-0 mt-6 text-right">
            <Button type="default" className="mr-3" onClick={() => navigate({ to: "/applications" })}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" size="large" className="bg-blue-600 px-8">
              Create and Save as Draft
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
