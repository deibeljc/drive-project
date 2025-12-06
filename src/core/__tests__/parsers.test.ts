import { describe, it, expect, beforeEach, afterEach, mock } from "bun:test";
import { db } from "@db/client";
import { Partner, Company, Employee, Connection } from "@db/schema";
import {
  parsePartner,
  parseCompany,
  parseEmployee,
  parseContact,
  parseAndStoreInputLine,
  ParseError,
} from "../parsers";

describe("parsers", () => {
  beforeEach(async () => {
    // Clean up tables before each test
    await db.delete(Connection).run();
    await db.delete(Employee).run();
    await db.delete(Company).run();
    await db.delete(Partner).run();
  });

  describe("parsePartner", () => {
    it("should insert a partner with valid args", async () => {
      await parsePartner(["Alice"]);

      const partners = await db.select().from(Partner).all();
      expect(partners).toHaveLength(1);
      expect(partners[0]?.name).toBe("Alice");
    });

    it("should throw ParseError when given wrong number of args", async () => {
      expect(parsePartner([])).rejects.toThrow(ParseError);
      expect(parsePartner(["a", "b"])).rejects.toThrow(ParseError);
    });

    it("should not duplicate partners on conflict", async () => {
      await parsePartner(["Alice"]);
      await parsePartner(["Alice"]);

      const partners = await db.select().from(Partner).all();
      expect(partners).toHaveLength(1);
    });
  });

  describe("parseCompany", () => {
    it("should insert a company with valid args", async () => {
      await parseCompany(["Acme"]);

      const companies = await db.select().from(Company).all();
      expect(companies).toHaveLength(1);
      expect(companies[0]?.name).toBe("Acme");
    });

    it("should throw ParseError when given wrong number of args", async () => {
      expect(parseCompany([])).rejects.toThrow(ParseError);
      expect(parseCompany(["a", "b"])).rejects.toThrow(ParseError);
    });

    it("should not duplicate companies on conflict", async () => {
      await parseCompany(["Acme"]);
      await parseCompany(["Acme"]);

      const companies = await db.select().from(Company).all();
      expect(companies).toHaveLength(1);
    });
  });

  describe("parseEmployee", () => {
    beforeEach(async () => {
      await parseCompany(["Acme"]);
    });

    it("should insert an employee with valid args", async () => {
      await parseEmployee(["Bob", "Acme"]);

      const employees = await db.select().from(Employee).all();
      expect(employees).toHaveLength(1);
      expect(employees[0]?.name).toBe("Bob");
    });

    it("should throw ParseError when given wrong number of args", async () => {
      expect(parseEmployee([])).rejects.toThrow(ParseError);
      expect(parseEmployee(["a"])).rejects.toThrow(ParseError);
      expect(parseEmployee(["a", "b", "c"])).rejects.toThrow(ParseError);
    });

    it("should throw ParseError when company not found", async () => {
      expect(parseEmployee(["Bob", "NonExistent"])).rejects.toThrow(ParseError);
    });
  });

  describe("parseContact", () => {
    beforeEach(async () => {
      await parseCompany(["Acme"]);
      await parseEmployee(["Bob", "Acme"]);
      await parsePartner(["Alice"]);
    });

    it("should insert a contact with valid args", async () => {
      await parseContact(["Bob", "Alice", "email"]);

      const connections = await db.select().from(Connection).all();
      expect(connections).toHaveLength(1);
      expect(connections[0]?.type).toBe("email");
    });

    it("should throw ParseError when given wrong number of args", async () => {
      expect(parseContact([])).rejects.toThrow(ParseError);
      expect(parseContact(["a", "b"])).rejects.toThrow(ParseError);
    });

    it("should throw ParseError for invalid contact type", async () => {
      expect(parseContact(["Bob", "Alice", "invalid"])).rejects.toThrow(
        ParseError
      );
    });

    it("should throw ParseError when employee not found", async () => {
      expect(parseContact(["NonExistent", "Alice", "email"])).rejects.toThrow(
        ParseError
      );
    });

    it("should throw ParseError when partner not found", async () => {
      expect(parseContact(["Bob", "NonExistent", "email"])).rejects.toThrow(
        ParseError
      );
    });

    it("should accept all valid contact types", async () => {
      await parseContact(["Bob", "Alice", "email"]);
      await parseContact(["Bob", "Alice", "call"]);
      await parseContact(["Bob", "Alice", "coffee"]);

      const connections = await db.select().from(Connection).all();
      expect(connections).toHaveLength(3);
    });
  });

  describe("parseAndStoreInputLine", () => {
    it("should skip empty lines", async () => {
      await parseAndStoreInputLine("");
      await parseAndStoreInputLine("   ");

      const partners = await db.select().from(Partner).all();
      expect(partners).toHaveLength(0);
    });

    it("should skip comment lines", async () => {
      await parseAndStoreInputLine("# This is a comment");

      const partners = await db.select().from(Partner).all();
      expect(partners).toHaveLength(0);
    });

    it("should parse Partner command", async () => {
      await parseAndStoreInputLine("Partner Alice");

      const partners = await db.select().from(Partner).all();
      expect(partners).toHaveLength(1);
    });

    it("should parse Company command", async () => {
      await parseAndStoreInputLine("Company Acme");

      const companies = await db.select().from(Company).all();
      expect(companies).toHaveLength(1);
    });

    it("should throw ParseError for unknown command", async () => {
      expect(parseAndStoreInputLine("Unknown arg")).rejects.toThrow(ParseError);
    });

    it("should include line number in error when provided", async () => {
      try {
        await parseAndStoreInputLine("Unknown arg", 5);
      } catch (e) {
        expect(e).toBeInstanceOf(ParseError);
        expect((e as ParseError).message).toContain("Line 5");
      }
    });
  });
});
