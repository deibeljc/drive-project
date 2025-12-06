// Create schema for the relationships between partners, companies, and employees

import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, index } from "drizzle-orm/sqlite-core";

// Partners - Drive Capital employees
export const Partner = sqliteTable("partners", {
  id: integer("id").primaryKey().notNull(),
  name: text("name").unique().notNull(),
  createdAt: text().default(sql`(CURRENT_DATE)`),
  updatedAt: text().default(sql`(CURRENT_DATE)`),
});

// Companies
export const Company = sqliteTable("companies", {
  id: integer("id").primaryKey().notNull(),
  name: text("name").unique().notNull(),
  createdAt: text().default(sql`(CURRENT_DATE)`),
  updatedAt: text().default(sql`(CURRENT_DATE)`),
});

// Employees
export const Employee = sqliteTable("employees", {
  id: integer("id").primaryKey().notNull(),
  name: text("name").unique().notNull(),
  companyId: integer("company_id")
    .references(() => Company.id)
    .notNull(),
  createdAt: text().default(sql`(CURRENT_DATE)`),
  updatedAt: text().default(sql`(CURRENT_DATE)`),
});

// Connection
export const Connection = sqliteTable("connections", {
  id: integer("id").primaryKey().notNull(),
  partnerId: integer("partner_id")
    .references(() => Partner.id)
    .notNull(),
  employeeId: integer("employee_id")
    .references(() => Employee.id)
    .notNull(),
  type: text({ enum: ["email", "call", "coffee"] }).notNull(),
  notes: text().default(""),
  createdAt: text().default(sql`(CURRENT_DATE)`),
  updatedAt: text().default(sql`(CURRENT_DATE)`),
});
