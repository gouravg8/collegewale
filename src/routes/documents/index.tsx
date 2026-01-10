import { HelpPanel } from "@/components/HelpPanel";
import { createFileRoute } from "@tanstack/react-router";
import { Button, Card, List, Space, Tag, Upload } from "antd";
import { MdDelete, MdDescription, MdDownload, MdUpload } from "react-icons/md";

export const Route = createFileRoute("/documents/")({
  component: DocumentsPage,
});

interface DocumentItem {
  id: string;
  type: string;
  fileName: string;
  uploadedAt: string;
  size: string;
  status: "verified" | "pending" | "flagged";
}

function DocumentsPage() {
  // TODO: Fetch from API
  const documents: DocumentItem[] = [
    {
      id: "1",
      type: "Aadhaar Card",
      fileName: "aadhaar.pdf",
      uploadedAt: "2024-01-10",
      size: "2.3 MB",
      status: "verified",
    },
    {
      id: "2",
      type: "10+2 Marksheet",
      fileName: "marksheet.pdf",
      uploadedAt: "2024-01-09",
      size: "1.8 MB",
      status: "pending",
    },
  ];

  const statusColors = {
    verified: "success",
    pending: "processing",
    flagged: "error",
  };

  return (
    <div>
      <HelpPanel context="documents" />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>Documents</h1>
        <Upload>
          <Button type="primary" icon={<MdUpload />}>
            Upload Document
          </Button>
        </Upload>
      </div>

      <Card>
        <List
          itemLayout="horizontal"
          dataSource={documents}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button icon={<MdDownload />} size="small" key="download">
                  Download
                </Button>,
                <Button icon={<MdDelete />} size="small" danger key="delete">
                  Delete
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<MdDescription style={{ fontSize: 24 }} />}
                title={
                  <Space>
                    {item.type}
                    <Tag color={statusColors[item.status]}>{item.status}</Tag>
                  </Space>
                }
                description={
                  <Space split="|">
                    <span>{item.fileName}</span>
                    <span>{item.size}</span>
                    <span>Uploaded: {item.uploadedAt}</span>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
