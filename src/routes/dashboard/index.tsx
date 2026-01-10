import { HelpPanel } from "@/components/HelpPanel";
import { createFileRoute } from "@tanstack/react-router";
import { Card, Col, Row, Statistic } from "antd";
import { MdCheckCircle, MdDescription, MdPayment, MdPeople } from "react-icons/md";

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
});

function Dashboard() {
  // TODO: Fetch real data from API
  const stats = {
    totalStudents: 245,
    totalApplications: 312,
    approvedApplications: 198,
    pendingPayments: 47,
  };

  return (
    <div>
      <HelpPanel context="dashboard" />

      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={stats.totalStudents}
              prefix={<MdPeople style={{ color: "#3f8600" }} />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Applications"
              value={stats.totalApplications}
              prefix={<MdDescription style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Approved"
              value={stats.approvedApplications}
              prefix={<MdCheckCircle style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Payments"
              value={stats.pendingPayments}
              prefix={<MdPayment style={{ color: "#faad14" }} />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Recent Applications" bordered={false}>
            <p>No recent applications</p>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Quick Actions" bordered={false}>
            <p>Quick action buttons will go here</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
