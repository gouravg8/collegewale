import { createFileRoute } from "@tanstack/react-router";
import { Button, Form, Input, InputNumber, Select, message } from "antd";
import { useState } from "react";
import { MdAppRegistration, MdEmail, MdPhone, MdSchool } from "react-icons/md";

// Create the route
export const Route = createFileRoute("/auth/college-signup")({
    component: CollegeSignupPage,
});

function CollegeSignupPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            // Simulate API call
            console.log("Signup Values:", values);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            message.success("College registration successful!");
            // Navigate to login or dashboard?
        } catch (error) {
            message.error("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* <div className="flex justify-center">
                    <div className="h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        C
                    </div>
                </div> */}
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Register your College
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Join the CollegeWale network today
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        size="large"
                        requiredMark="optional"
                    >
                        {/* College Name */}
                        <Form.Item
                            label={<span className="font-medium text-gray-700">College Name</span>}
                            name="collegeName"
                            rules={[
                                { required: true, message: "Please enter your college name" },
                                { min: 3, message: "Name must be at least 3 characters" },
                            ]}
                        >
                            <Input
                                prefix={<MdSchool className="text-gray-400" />}
                                placeholder="e.g. National Institute of Technology"
                                className="rounded-md"
                            />
                        </Form.Item>

                        {/* College Code & Phone Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item
                                label={<span className="font-medium text-gray-700">College Code</span>}
                                name="collegeCode"
                                rules={[{ required: true, message: "Required" }]}
                            >
                                <Input
                                    prefix={<MdAppRegistration className="text-gray-400" />}
                                    placeholder="e.g. NIT001"
                                    className="rounded-md"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-medium text-gray-700">Phone Number</span>}
                                name="phone"
                                rules={[
                                    { required: true, message: "Required" },
                                    { pattern: /^\d{10}$/, message: "Valid 10-digit number required" },
                                ]}
                            >
                                <Input
                                    prefix={<MdPhone className="text-gray-400" />}
                                    placeholder="9876543210"
                                    className="rounded-md"
                                    maxLength={10}
                                />
                            </Form.Item>
                        </div>

                        {/* Email */}
                        <Form.Item
                            label={<span className="font-medium text-gray-700">Official Email</span>}
                            name="email"
                            rules={[
                                { required: true, message: "Please enter official email" },
                                { type: "email", message: "Please enter a valid email" },
                            ]}
                        >
                            <Input
                                prefix={<MdEmail className="text-gray-400" />}
                                placeholder="admin@college.edu"
                                className="rounded-md"
                            />
                        </Form.Item>

                        {/* Course Types & Capacity Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item
                                label={<span className="font-medium text-gray-700">Course Types</span>}
                                name="courseTypes"
                                rules={[{ required: true, message: "Select at least one course" }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Select courses"
                                    className="rounded-md"
                                    options={[
                                        { label: "GNM", value: "GNM" },
                                        { label: "ANM", value: "ANM" },
                                        { label: "B.Sc Nursing", value: "BSC_NURSING" },
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-medium text-gray-700">Seat Capacity</span>}
                                name="seatCapacity"
                                rules={[{ required: true, message: "Required" }]}
                            >
                                <InputNumber
                                    placeholder="100"
                                    className="w-full rounded-md"
                                    min={1}
                                    max={10000}
                                />
                            </Form.Item>
                        </div>

                        <Form.Item className="mb-0 mt-4">
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base font-medium rounded-lg shadow-sm border-none"
                            >
                                Register College
                            </Button>
                        </Form.Item>
                    </Form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Already have an account?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <a
                                href="/login"
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Sign in here
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
