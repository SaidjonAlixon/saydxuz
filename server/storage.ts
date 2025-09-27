import { 
  type Lead, 
  type InsertLead, 
  type Service, 
  type InsertService,
  type Portfolio, 
  type InsertPortfolio,
  type Article, 
  type InsertArticle 
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Lead management
  createLead(lead: InsertLead): Promise<Lead>;
  getLead(id: string): Promise<Lead | undefined>;
  getLeads(): Promise<Lead[]>;
  updateLeadStatus(id: string, status: string): Promise<Lead | undefined>;

  // Service management
  createService(service: InsertService): Promise<Service>;
  getService(slug: string): Promise<Service | undefined>;
  getServices(): Promise<Service[]>;
  getActiveServices(): Promise<Service[]>;

  // Portfolio management
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  getPortfolio(id: string): Promise<Portfolio | undefined>;
  getPortfolios(): Promise<Portfolio[]>;
  getPublicPortfolios(): Promise<Portfolio[]>;

  // Article management
  createArticle(article: InsertArticle): Promise<Article>;
  getArticle(slug: string): Promise<Article | undefined>;
  getArticles(): Promise<Article[]>;
  getPublishedArticles(): Promise<Article[]>;
  incrementArticleViews(slug: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private leads: Map<string, Lead> = new Map();
  private services: Map<string, Service> = new Map();
  private portfolios: Map<string, Portfolio> = new Map();
  private articles: Map<string, Article> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize with sample services
    const defaultServices: Service[] = [
      {
        id: randomUUID(),
        name: "Telegram Bot",
        slug: "telegram-bot", 
        shortDescription: "Biznesingiz uchun maxsus Telegram bot yaratamiz",
        fullDescription: "Buyurtma qabul qilish, to'lov va mijozlar bilan muloqot qilish uchun professional Telegram bot.",
        category: "Avtomatlashtirish",
        basePrice: 500000,
        duration: "5-7 kun",
        rating: "4.8",
        features: ["Buyurtma qabul qilish", "To'lov integratsiyasi", "Admin panel", "Mijozlar bazasi"],
        calculatorParams: null,
        isActive: "true",
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Veb-sayt",
        slug: "veb-sayt",
        shortDescription: "Zamonaviy, tezkor va SEO optimallashtirilgan veb-sayt",
        fullDescription: "Mobil qurilmalarga moslashgan dizayn va professional brending bilan veb-sayt yaratish.",
        category: "Veb-dasturlash",
        basePrice: 800000,
        duration: "7-14 kun", 
        rating: "4.9",
        features: ["Responsive dizayn", "SEO optimizatsiya", "CMS tizimi", "Analitika"],
        calculatorParams: null,
        isActive: "true",
        createdAt: new Date()
      }
    ];

    defaultServices.forEach(service => {
      this.services.set(service.slug, service);
    });
  }

  // Lead methods
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const lead: Lead = { 
      ...insertLead,
      telegram: insertLead.telegram || null,
      email: insertLead.email || null,
      budget: insertLead.budget || null,
      timeline: insertLead.timeline || null,
      description: insertLead.description || null,
      fileUrl: insertLead.fileUrl || null,
      source: insertLead.source || "website",
      id, 
      createdAt: new Date(),
      status: "new"
    };
    this.leads.set(id, lead);
    return lead;
  }

  async getLead(id: string): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  async updateLeadStatus(id: string, status: string): Promise<Lead | undefined> {
    const lead = this.leads.get(id);
    if (lead) {
      lead.status = status;
      this.leads.set(id, lead);
    }
    return lead;
  }

  // Service methods
  async createService(insertService: InsertService): Promise<Service> {
    const id = randomUUID();
    const service: Service = { 
      ...insertService,
      rating: insertService.rating || "4.8",
      calculatorParams: insertService.calculatorParams || null,
      isActive: insertService.isActive || "true",
      id, 
      createdAt: new Date()
    };
    this.services.set(service.slug, service);
    return service;
  }

  async getService(slug: string): Promise<Service | undefined> {
    return this.services.get(slug);
  }

  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getActiveServices(): Promise<Service[]> {
    return Array.from(this.services.values()).filter(s => s.isActive === "true");
  }

  // Portfolio methods
  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const id = randomUUID();
    const portfolio: Portfolio = { 
      ...insertPortfolio,
      problemStatement: insertPortfolio.problemStatement || null,
      solution: insertPortfolio.solution || null,
      results: insertPortfolio.results || null,
      images: insertPortfolio.images || null,
      duration: insertPortfolio.duration || null,
      clientName: insertPortfolio.clientName || null,
      isPublic: insertPortfolio.isPublic || "true",
      id, 
      createdAt: new Date()
    };
    this.portfolios.set(id, portfolio);
    return portfolio;
  }

  async getPortfolio(id: string): Promise<Portfolio | undefined> {
    return this.portfolios.get(id);
  }

  async getPortfolios(): Promise<Portfolio[]> {
    return Array.from(this.portfolios.values());
  }

  async getPublicPortfolios(): Promise<Portfolio[]> {
    return Array.from(this.portfolios.values()).filter(p => p.isPublic === "true");
  }

  // Article methods
  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = randomUUID();
    const article: Article = { 
      ...insertArticle,
      author: insertArticle.author || "SAYD.X Team",
      readTime: insertArticle.readTime || null,
      tags: insertArticle.tags || null,
      imageUrl: insertArticle.imageUrl || null,
      isPublished: insertArticle.isPublished || "true",
      id, 
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.articles.set(article.slug, article);
    return article;
  }

  async getArticle(slug: string): Promise<Article | undefined> {
    return this.articles.get(slug);
  }

  async getArticles(): Promise<Article[]> {
    return Array.from(this.articles.values());
  }

  async getPublishedArticles(): Promise<Article[]> {
    return Array.from(this.articles.values()).filter(a => a.isPublished === "true");
  }

  async incrementArticleViews(slug: string): Promise<void> {
    const article = this.articles.get(slug);
    if (article) {
      article.views = (article.views || 0) + 1;
      this.articles.set(slug, article);
    }
  }
}

export const storage = new MemStorage();
