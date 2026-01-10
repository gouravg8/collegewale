import { relations } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Enums
export const roleEnum = pgEnum("role", ["STUDENT", "AGENT", "COLLEGE", "ADMIN"]);
export const applicationStatusEnum = pgEnum("application_status", [
    "DRAFT",
    "SUBMITTED",
    "VERIFIED",
    "APPROVED",
    "ADMITTED",
]);
export const courseTypeEnum = pgEnum("course_type", ["GNM", "ANM"]);
export const documentTypeEnum = pgEnum("document_type", [
    "AADHAAR",
    "MARKSHEET_10_2",
    "TRANSFER_CERTIFICATE",
    "PHOTO",
    "OTHER",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
    "PENDING",
    "PROCESSING",
    "COMPLETED",
    "FAILED",
    "REFUNDED",
]);

// Colleges Table
export const colleges = pgTable("colleges", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    code: text("code").notNull().unique(),
    email: text("email").notNull().unique(),
    phone: text("phone").notNull(),
    logo: text("logo"),
    courseTypes: text("course_types").array().notNull().default([]),
    seatCapacity: integer("seat_capacity").notNull().default(0),
    principalId: uuid("principal_id"),
    admissionOfficerId: uuid("admission_officer_id"),
    accountantId: uuid("accountant_id"),
    complianceAccepted: boolean("compliance_accepted").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Users Table
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: roleEnum("role").notNull(),
    collegeId: uuid("college_id").references(() => colleges.id),
    fullName: text("full_name").notNull(),
    phone: text("phone"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Sessions Table
export const sessions = pgTable("sessions", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Students Table
export const students = pgTable("students", {
    id: uuid("id").defaultRandom().primaryKey(),
    collegeId: uuid("college_id")
        .notNull()
        .references(() => colleges.id),
    userId: uuid("user_id").references(() => users.id),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    aadhaarNumber: text("aadhaar_number").notNull(),
    dateOfBirth: timestamp("date_of_birth"),
    address: text("address"),
    guardianName: text("guardian_name"),
    guardianPhone: text("guardian_phone"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Applications Table
export const applications = pgTable("applications", {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
        .notNull()
        .references(() => students.id, { onDelete: "cascade" }),
    collegeId: uuid("college_id")
        .notNull()
        .references(() => colleges.id),
    courseType: courseTypeEnum("course_type").notNull(),
    academicYear: text("academic_year").notNull(),
    status: applicationStatusEnum("status").notNull().default("DRAFT"),
    statusHistory: text("status_history").array().default([]),
    reviewNotes: text("review_notes"),
    createdById: uuid("created_by_id").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Documents Table
export const documents = pgTable("documents", {
    id: uuid("id").defaultRandom().primaryKey(),
    applicationId: uuid("application_id")
        .notNull()
        .references(() => applications.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
        .notNull()
        .references(() => students.id),
    type: documentTypeEnum("type").notNull(),
    fileName: text("file_name").notNull(),
    fileSize: integer("file_size").notNull(),
    mimeType: text("mime_type").notNull(),
    storageKey: text("storage_key").notNull(),
    uploadedById: uuid("uploaded_by_id").references(() => users.id),
    isFlagged: boolean("is_flagged").notNull().default(false),
    flagReason: text("flag_reason"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Seats Table
export const seats = pgTable("seats", {
    id: uuid("id").defaultRandom().primaryKey(),
    collegeId: uuid("college_id")
        .notNull()
        .references(() => colleges.id),
    courseType: courseTypeEnum("course_type").notNull(),
    academicYear: text("academic_year").notNull(),
    studentId: uuid("student_id").references(() => students.id),
    rollNumber: text("roll_number"),
    isOccupied: boolean("is_occupied").notNull().default(false),
    allocatedAt: timestamp("allocated_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Payments Table
export const payments = pgTable("payments", {
    id: uuid("id").defaultRandom().primaryKey(),
    applicationId: uuid("application_id")
        .notNull()
        .references(() => applications.id),
    studentId: uuid("student_id")
        .notNull()
        .references(() => students.id),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull().default("INR"),
    razorpayOrderId: text("razorpay_order_id"),
    razorpayPaymentId: text("razorpay_payment_id"),
    razorpaySignature: text("razorpay_signature"),
    status: paymentStatusEnum("status").notNull().default("PENDING"),
    failureReason: text("failure_reason"),
    receiptUrl: text("receipt_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Invitations Table
export const invitations = pgTable("invitations", {
    id: uuid("id").defaultRandom().primaryKey(),
    collegeId: uuid("college_id").references(() => colleges.id),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    token: text("token").notNull().unique(),
    collegeName: text("college_name").notNull(),
    collegeCode: text("college_code").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    isUsed: boolean("is_used").notNull().default(false),
    usedAt: timestamp("used_at"),
    createdById: uuid("created_by_id").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Activity Logs Table
export const activityLogs = pgTable("activity_logs", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id),
    collegeId: uuid("college_id").references(() => colleges.id),
    action: text("action").notNull(),
    entityType: text("entity_type"),
    entityId: uuid("entity_id"),
    details: text("details"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const collegesRelations = relations(colleges, ({ many, one }) => ({
    users: many(users),
    students: many(students),
    applications: many(applications),
    seats: many(seats),
    principal: one(users, {
        fields: [colleges.principalId],
        references: [users.id],
    }),
    admissionOfficer: one(users, {
        fields: [colleges.admissionOfficerId],
        references: [users.id],
    }),
    accountant: one(users, {
        fields: [colleges.accountantId],
        references: [users.id],
    }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
    college: one(colleges, {
        fields: [users.collegeId],
        references: [colleges.id],
    }),
    sessions: many(sessions),
    activityLogs: many(activityLogs),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
    college: one(colleges, {
        fields: [students.collegeId],
        references: [colleges.id],
    }),
    user: one(users, {
        fields: [students.userId],
        references: [users.id],
    }),
    applications: many(applications),
    documents: many(documents),
    seat: one(seats),
    payments: many(payments),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
    student: one(students, {
        fields: [applications.studentId],
        references: [students.id],
    }),
    college: one(colleges, {
        fields: [applications.collegeId],
        references: [colleges.id],
    }),
    createdBy: one(users, {
        fields: [applications.createdById],
        references: [users.id],
    }),
    documents: many(documents),
    payments: many(payments),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
    application: one(applications, {
        fields: [documents.applicationId],
        references: [applications.id],
    }),
    student: one(students, {
        fields: [documents.studentId],
        references: [students.id],
    }),
    uploadedBy: one(users, {
        fields: [documents.uploadedById],
        references: [users.id],
    }),
}));

export const seatsRelations = relations(seats, ({ one }) => ({
    college: one(colleges, {
        fields: [seats.collegeId],
        references: [colleges.id],
    }),
    student: one(students, {
        fields: [seats.studentId],
        references: [students.id],
    }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
    application: one(applications, {
        fields: [payments.applicationId],
        references: [applications.id],
    }),
    student: one(students, {
        fields: [payments.studentId],
        references: [payments.id],
    }),
}));

// Type exports
export type College = typeof colleges.$inferSelect;
export type NewCollege = typeof colleges.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
export type Seat = typeof seats.$inferSelect;
export type NewSeat = typeof seats.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
