import { createFileRoute } from "@tanstack/react-router";
import { Button, Card, Form, Input, Select, Upload } from "antd";
import { MdUpload } from "react-icons/md";

export const Route = createFileRoute("/settings/")({
  component: SettingsPage,
});

function SettingsPage() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Settings updated:", values);
    // TODO: Call API to update settings
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Settings</h1>

      <Card title="College Information">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            collegeName: "Sample College",
            collegeCode: "SC001",
            email: "admin@samplecollege.edu",
            phone: "+91 9876543210",
            seatCapacity: 100,
          }}
        >
          <Form.Item label="College Logo">
            <Upload>
              <Button icon={<MdUpload />}>Upload Logo</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="College Name"
            name="collegeName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="College Code" name="collegeCode">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Course Types" name="courseTypes">
            <Select mode="multiple" placeholder="Select course types">
              <Select.Option value="GNM">GNM</Select.Option>
              <Select.Option value="ANM">ANM</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Seat Capacity" name="seatCapacity">
            <Input type="number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
