import { requirePrivilege } from "@/config/auth-utils";
import { createFileRoute } from "@tanstack/react-router";
import { Button, Form, Input, Select, Upload } from "antd";
import { MdUpload } from "react-icons/md";

export const Route = createFileRoute("/settings/")({
  beforeLoad: requirePrivilege("COLLEGE"),
  component: SettingsPage,
});

function SettingsPage() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Settings updated:", values);
    // TODO: Call API to update settings
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 m-0">College Settings</h1>
        <p className="text-gray-500 mt-1">Manage your college profile, roles, and compliance.</p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          collegeName: "Sample College",
          collegeCode: "SC001",
          email: "admin@samplecollege.edu",
          phone: "+91 9876543210",
        }}
        className="space-y-8"
      >
        {/* Section 1: General Information & Branding */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">Generation Information & Branding</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo Upload Column */}
            <div className="col-span-1">
              <Form.Item label="College Logo" name="logo">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors bg-gray-50">
                  <div className="h-24 w-24 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-4 overflow-hidden">
                    {/* Placeholder or Image Preview */}
                    <MdUpload size={32} className="text-gray-400" />
                  </div>
                  <Upload showUploadList={false}>
                    <Button type="default" size="small">Change Logo</Button>
                  </Upload>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Recommended: 512x512px <br /> PNG or JPG
                  </p>
                </div>
              </Form.Item>
            </div>

            {/* Fields Column */}
            <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item label="College Name" name="collegeName" rules={[{ required: true }]} className="col-span-2">
                <Input size="large" />
              </Form.Item>

              <Form.Item label="College Code" name="collegeCode">
                <Input size="large" disabled className="bg-gray-50 text-gray-500" />
              </Form.Item>

              <Form.Item label="Seat Capacity" name="seatCapacity">
                <Input type="number" size="large" />
              </Form.Item>

              <Form.Item label="Official Email" name="email" rules={[{ required: true, type: "email" }]}>
                <Input size="large" prefix={<MdUpload className="rotate-90 hidden" />} />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[{ required: true, pattern: /^\d{10}$/, message: "Please enter a valid phone number" }]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item label="Course Types" name="courseTypes" className="col-span-2">
                <Select mode="multiple" placeholder="Select course types" size="large">
                  <Select.Option value="GNM">GNM</Select.Option>
                  <Select.Option value="ANM">ANM</Select.Option>
                  <Select.Option value="BSC">B.Sc Nursing</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>
        </div>

        {/* Section 2: Internal Roles */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">Internal Roles</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Principal */}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Principal
              </h3>
              <Form.Item label="Name" name={["principal", "name"]} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Email" name={["principal", "email"]} rules={[{ required: true, type: 'email' }]}>
                <Input />
              </Form.Item>
              <Form.Item
                label="Phone"
                name={["principal", "phone"]}
                rules={[{ required: true, pattern: /^\d{10}$/, message: "Please enter a valid phone number" }]}
              >
                <Input />
              </Form.Item>
            </div>

            {/* Admission Officer */}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Admission Officer
              </h3>
              <Form.Item label="Name" name={["admissionOfficer", "name"]} rules={[{ required: true, }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Email" name={["admissionOfficer", "email"]} rules={[{ required: true, type: 'email' }]}>
                <Input />
              </Form.Item>
              <Form.Item
                label="Phone"
                name={["admissionOfficer", "phone"]}
                rules={[{ required: true, pattern: /^\d{10}$/, message: "Please enter a valid phone number" }]}
              >
                <Input />
              </Form.Item>
            </div>

            {/* Accountant */}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span> Accountant <span className="text-xs text-gray-500 font-normal ml-auto">(Optional)</span>
              </h3>
              <Form.Item label="Name" name={["accountant", "name"]}>
                <Input />
              </Form.Item>
              <Form.Item label="Email" name={["accountant", "email"]}>
                <Input />
              </Form.Item>
              <Form.Item label="Phone" name={["accountant", "phone"]}
                rules={[{ required: true, pattern: /^\d{10}$/, message: "Please enter a valid phone number" }]}
              >
                <Input />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* Section 3: Compliance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Declaration</h2>
          <Form.Item
            name="compliance"
            valuePropName="checked"
            rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('You must accept the declaration')) }]}
          >
            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-md border border-yellow-100 text-yellow-800">
              <input type="checkbox" className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <span className="text-sm leading-relaxed">
                I hereby declare that all the information provided above is true and correct to the best of my knowledge.
                I understand that any false information may lead to the cancellation of our college's registration on this platform.
                We agree to comply with all the terms and conditions of CollegeWale.
              </span>
            </div>
          </Form.Item>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="primary" htmlType="submit" size="large" className="bg-blue-600 w-full md:w-auto px-8">
            Save All Changes
          </Button>
        </div>
      </Form>
    </div>
  );
}
