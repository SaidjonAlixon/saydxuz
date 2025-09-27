import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Lead table for storing client requests
export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  telegram: text("telegram"),
  email: text("email"),
  serviceType: text("service_type").notNull(),
  budget: text("budget"),
  timeline: text("timeline"),
  description: text("description"),
  fileUrl: text("file_url"),
  source: text("source").notNull().default("website"), // website, calculator
  createdAt: timestamp("created_at").defaultNow(),
  status: text("status").notNull().default("new"), // new, contacted, in_progress, completed
});

// Services table for dynamic service management
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull(),
  category: text("category").notNull(),
  basePrice: integer("base_price").notNull(),
  duration: text("duration").notNull(),
  rating: text("rating").default("4.8"),
  features: text("features").array().notNull(),
  calculatorParams: json("calculator_params"),
  isActive: text("is_active").notNull().default("true"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Portfolio table for case studies
export const portfolio = pgTable("portfolio", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  technologies: text("technologies").array().notNull(),
  problemStatement: text("problem_statement"),
  solution: text("solution"),
  results: json("results"), // Array of {metric, value, icon}
  images: text("images").array(),
  duration: text("duration"),
  clientName: text("client_name"),
  isPublic: text("is_public").notNull().default("true"),
  createdAt: timestamp("created_at").defaultNow(),
});

// News/Blog articles
export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  author: text("author").notNull().default("SAYD.X Team"),
  readTime: text("read_time"),
  views: integer("views").default(0),
  tags: text("tags").array(),
  imageUrl: text("image_url"),
  isPublished: text("is_published").notNull().default("true"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod schemas
export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  status: true,
}).extend({
  name: z.string().min(2, "Ism kamida 2 ta harf bo'lishi kerak"),
  phone: z.string().min(10, "To'g'ri telefon raqam kiriting"),
  serviceType: z.string().min(1, "Xizmat turini tanlang"),
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
});

export const insertPortfolioSchema = createInsertSchema(portfolio).omit({
  id: true,
  createdAt: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  views: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type Portfolio = typeof portfolio.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;
