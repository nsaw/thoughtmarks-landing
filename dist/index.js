var __defProp = Object.defineProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  bins: () => bins,
  insertBinSchema: () => insertBinSchema,
  insertThoughtmarkSchema: () => insertThoughtmarkSchema,
  insertUserSchema: () => insertUserSchema,
  thoughtmarks: () => thoughtmarks,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  firebaseUid: text("firebase_uid").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var bins = pgTable("bins", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").notNull().default("#C6D600"),
  icon: text("icon").notNull().default("folder"),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var thoughtmarks = pgTable("thoughtmarks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags").array().notNull().default([]),
  attachments: json("attachments").default([]),
  // Array of file metadata objects
  binId: integer("bin_id").references(() => bins.id, { onDelete: "set null" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  isDeleted: boolean("is_deleted").notNull().default(false),
  deletedAt: timestamp("deleted_at"),
  embedding: text("embedding"),
  // JSON string of embedding vector
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertBinSchema = createInsertSchema(bins).omit({
  id: true,
  createdAt: true,
  userId: true
});
var insertThoughtmarkSchema = createInsertSchema(thoughtmarks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  isDeleted: true,
  deletedAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage-final.ts
import { eq, and, desc, asc, or, ilike, sql } from "drizzle-orm";
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByFirebaseUid(firebaseUid) {
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values({
      ...insertUser,
      displayName: insertUser.displayName || null
    }).returning();
    await this.createDefaultBins(user.id);
    return user;
  }
  async createDefaultBins(userId) {
    const defaultBins = [
      {
        name: "\u{1F4A1} Quick Ideas",
        description: "Capture spontaneous thoughts and inspiration",
        color: "#3B82F6",
        // Blue
        icon: "\u{1F4A1}",
        userId
      },
      {
        name: "\u{1F4DA} Learning",
        description: "Knowledge, insights, and things to remember",
        color: "#10B981",
        // Green
        icon: "\u{1F4DA}",
        userId
      },
      {
        name: "\u{1F3AF} Goals & Projects",
        description: "Long-term objectives and project planning",
        color: "#F59E0B",
        // Yellow
        icon: "\u{1F3AF}",
        userId
      },
      {
        name: "\u{1F50D} Research",
        description: "Interesting findings and things to explore",
        color: "#8B5CF6",
        // Purple
        icon: "\u{1F50D}",
        userId
      },
      {
        name: "\u{1F4DD} Notes",
        description: "General notes and miscellaneous thoughts",
        color: "#6B7280",
        // Gray
        icon: "\u{1F4DD}",
        userId
      }
    ];
    await db.insert(bins).values(defaultBins);
  }
  async getBinsByUserId(userId) {
    const result = await db.select({
      id: bins.id,
      name: bins.name,
      description: bins.description,
      color: bins.color,
      icon: bins.icon,
      userId: bins.userId,
      createdAt: bins.createdAt,
      thoughtmarkCount: sql`count(${thoughtmarks.id})::int`.as("thoughtmarkCount")
    }).from(bins).leftJoin(thoughtmarks, and(eq(bins.id, thoughtmarks.binId), eq(thoughtmarks.isDeleted, false))).where(eq(bins.userId, userId)).groupBy(bins.id, bins.name, bins.description, bins.color, bins.icon, bins.userId, bins.createdAt).orderBy(asc(bins.createdAt));
    return result;
  }
  async getBin(id) {
    const [bin] = await db.select().from(bins).where(eq(bins.id, id));
    return bin || void 0;
  }
  async createBin(binData) {
    const [bin] = await db.insert(bins).values({
      ...binData,
      description: binData.description || null,
      color: binData.color || "#6B7280",
      icon: binData.icon || "\u{1F4DD}"
    }).returning();
    return bin;
  }
  async updateBin(id, binData) {
    const result = await db.update(bins).set(binData).where(eq(bins.id, id)).returning();
    if (!result || result.length === 0) {
      return void 0;
    }
    return result[0];
  }
  async deleteBin(id) {
    const result = await db.delete(bins).where(eq(bins.id, id));
    return (result.rowCount || 0) > 0;
  }
  async getThoughtmarksByUserId(userId, includeDeleted = false) {
    const result = await db.select({
      id: thoughtmarks.id,
      title: thoughtmarks.title,
      content: thoughtmarks.content,
      tags: thoughtmarks.tags,
      attachments: thoughtmarks.attachments,
      binId: thoughtmarks.binId,
      userId: thoughtmarks.userId,
      isDeleted: thoughtmarks.isDeleted,
      deletedAt: thoughtmarks.deletedAt,
      embedding: thoughtmarks.embedding,
      createdAt: thoughtmarks.createdAt,
      updatedAt: thoughtmarks.updatedAt,
      binName: bins.name
    }).from(thoughtmarks).leftJoin(bins, eq(thoughtmarks.binId, bins.id)).where(
      includeDeleted ? eq(thoughtmarks.userId, userId) : and(eq(thoughtmarks.userId, userId), eq(thoughtmarks.isDeleted, false))
    ).orderBy(desc(thoughtmarks.createdAt));
    return result;
  }
  async getThoughtmarksByBinId(binId) {
    const result = await db.select({
      id: thoughtmarks.id,
      title: thoughtmarks.title,
      content: thoughtmarks.content,
      tags: thoughtmarks.tags,
      attachments: thoughtmarks.attachments,
      binId: thoughtmarks.binId,
      userId: thoughtmarks.userId,
      isDeleted: thoughtmarks.isDeleted,
      deletedAt: thoughtmarks.deletedAt,
      embedding: thoughtmarks.embedding,
      createdAt: thoughtmarks.createdAt,
      updatedAt: thoughtmarks.updatedAt,
      binName: bins.name
    }).from(thoughtmarks).leftJoin(bins, eq(thoughtmarks.binId, bins.id)).where(and(eq(thoughtmarks.binId, binId), eq(thoughtmarks.isDeleted, false))).orderBy(desc(thoughtmarks.createdAt));
    return result;
  }
  async getThoughtmark(id) {
    const [thoughtmark] = await db.select().from(thoughtmarks).where(eq(thoughtmarks.id, id));
    return thoughtmark || void 0;
  }
  async createThoughtmark(thoughtmarkData) {
    const [thoughtmark] = await db.insert(thoughtmarks).values({
      ...thoughtmarkData,
      tags: thoughtmarkData.tags || [],
      attachments: thoughtmarkData.attachments || null,
      embedding: thoughtmarkData.embedding || null,
      binId: thoughtmarkData.binId || null,
      isDeleted: false,
      deletedAt: null,
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    return thoughtmark;
  }
  async updateThoughtmark(id, thoughtmarkData) {
    const result = await db.update(thoughtmarks).set({
      ...thoughtmarkData,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(thoughtmarks.id, id)).returning();
    return result[0] || void 0;
  }
  async deleteThoughtmark(id) {
    const result = await db.update(thoughtmarks).set({ isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }).where(eq(thoughtmarks.id, id));
    return (result.rowCount || 0) > 0;
  }
  async restoreThoughtmark(id) {
    const result = await db.update(thoughtmarks).set({ isDeleted: false, deletedAt: null }).where(eq(thoughtmarks.id, id));
    return (result.rowCount || 0) > 0;
  }
  async searchThoughtmarks(userId, query, tags) {
    const result = await db.select({
      id: thoughtmarks.id,
      title: thoughtmarks.title,
      content: thoughtmarks.content,
      tags: thoughtmarks.tags,
      attachments: thoughtmarks.attachments,
      binId: thoughtmarks.binId,
      userId: thoughtmarks.userId,
      isDeleted: thoughtmarks.isDeleted,
      deletedAt: thoughtmarks.deletedAt,
      embedding: thoughtmarks.embedding,
      createdAt: thoughtmarks.createdAt,
      updatedAt: thoughtmarks.updatedAt,
      binName: bins.name
    }).from(thoughtmarks).leftJoin(bins, eq(thoughtmarks.binId, bins.id)).where(and(
      eq(thoughtmarks.userId, userId),
      eq(thoughtmarks.isDeleted, false),
      or(
        ilike(thoughtmarks.title, `%${query}%`),
        ilike(thoughtmarks.content, `%${query}%`)
      )
    )).orderBy(desc(thoughtmarks.createdAt));
    return result;
  }
  async getDeletedThoughtmarks(userId) {
    const result = await db.select({
      id: thoughtmarks.id,
      title: thoughtmarks.title,
      content: thoughtmarks.content,
      tags: thoughtmarks.tags,
      attachments: thoughtmarks.attachments,
      binId: thoughtmarks.binId,
      userId: thoughtmarks.userId,
      isDeleted: thoughtmarks.isDeleted,
      deletedAt: thoughtmarks.deletedAt,
      embedding: thoughtmarks.embedding,
      createdAt: thoughtmarks.createdAt,
      updatedAt: thoughtmarks.updatedAt,
      binName: bins.name
    }).from(thoughtmarks).leftJoin(bins, eq(thoughtmarks.binId, bins.id)).where(and(eq(thoughtmarks.userId, userId), eq(thoughtmarks.isDeleted, true))).orderBy(desc(thoughtmarks.createdAt));
    return result;
  }
};
var storage = new DatabaseStorage();

// server/ai-categorization.ts
import OpenAI from "openai";
var openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
async function categorizethoughtmark(content, title, availableBins) {
  try {
    const binList = availableBins.map((bin) => `${bin.name}: ${bin.description || "No description"}`).join("\n");
    const prompt = `Analyze this thoughtmark and suggest the most appropriate bins for categorization:

Title: ${title}
Content: ${content}

Available bins:
${binList}

Provide suggestions in JSON format with the following structure:
{
  "suggestions": [
    {
      "binName": "exact bin name from the list",
      "confidence": 0.95,
      "reasoning": "brief explanation of why this bin fits"
    }
  ]
}

Rules:
- Only suggest bins that exist in the available bins list
- Provide 1-3 suggestions maximum
- Confidence should be between 0.0 and 1.0
- Order by confidence (highest first)
- Be concise in reasoning`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert at categorizing notes and thoughts into appropriate organizational bins. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });
    const result = JSON.parse(response.choices[0].message.content || '{"suggestions": []}');
    return result.suggestions || [];
  } catch (error) {
    console.error("AI categorization error:", error);
    return [];
  }
}
async function generateEmbedding(text2) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text2,
      encoding_format: "float"
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("Embedding generation error:", error);
    return [];
  }
}
function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
async function findSimilarThoughtmarks(queryText, thoughtmarks2, threshold = 0.7, limit = 5) {
  try {
    const queryEmbedding = await generateEmbedding(queryText);
    if (queryEmbedding.length === 0) return [];
    const similarities = thoughtmarks2.filter((tm) => tm.embedding && tm.embedding.length > 0).map((tm) => ({
      id: tm.id,
      similarity: cosineSimilarity(queryEmbedding, tm.embedding)
    })).filter((result) => result.similarity >= threshold).sort((a, b) => b.similarity - a.similarity).slice(0, limit);
    return similarities;
  } catch (error) {
    console.error("Similarity search error:", error);
    return [];
  }
}

// server/routes.ts
function requireAuth(req, res, next) {
  const userId = req.headers["x-user-id"];
  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  req.userId = parseInt(userId);
  next();
}
async function registerRoutes(app2) {
  app2.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      const defaultBins = [
        { name: "Product Ideas", description: "Innovative product concepts", color: "#C6D600", icon: "lightbulb", userId: user.id },
        { name: "To-Do", description: "Tasks and reminders", color: "#3B82F6", icon: "checklist", userId: user.id },
        { name: "Projects", description: "Work and personal projects", color: "#8B5CF6", icon: "folder", userId: user.id },
        { name: "Life Insights", description: "Personal reflections", color: "#10B981", icon: "heart", userId: user.id },
        { name: "Lessons Learned", description: "Key takeaways", color: "#F59E0B", icon: "book", userId: user.id }
      ];
      const createdBins = [];
      for (const binData of defaultBins) {
        const bin = await storage.createBin(binData);
        createdBins.push(bin);
      }
      const sampleThoughtmarks = [
        {
          title: "AI-powered note organization",
          content: "Develop an AI system that automatically categorizes and tags notes based on content analysis.",
          tags: ["Product", "AI", "Innovation"],
          binId: createdBins[0].id,
          userId: user.id
        },
        {
          title: "Complete project documentation",
          content: "Finish writing the technical documentation for the mobile app project before the deadline.",
          tags: ["To-Do", "Project"],
          binId: createdBins[1].id,
          userId: user.id
        },
        {
          title: "Morning routine optimization",
          content: "Discovered that meditation before coffee increases focus by 40%. Implementing this as a daily habit.",
          tags: ["Life", "Habits", "Process"],
          binId: createdBins[3].id,
          userId: user.id
        },
        {
          title: "User feedback implementation",
          content: "Always validate assumptions with real users before building features. Saved 2 weeks of development time.",
          tags: ["Lesson", "Product"],
          binId: createdBins[4].id,
          userId: user.id
        }
      ];
      for (const thoughtmarkData of sampleThoughtmarks) {
        await storage.createThoughtmark(thoughtmarkData);
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });
  app2.get("/api/users/by-firebase/:uid", async (req, res) => {
    try {
      const user = await storage.getUserByFirebaseUid(req.params.uid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  app2.get("/api/bins", requireAuth, async (req, res) => {
    try {
      const bins2 = await storage.getBinsByUserId(req.userId);
      res.json(bins2);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  app2.get("/api/bins/:id", requireAuth, async (req, res) => {
    try {
      const binId = parseInt(req.params.id);
      const bin = await storage.getBin(binId);
      if (!bin) {
        return res.status(404).json({ message: "Bin not found" });
      }
      if (bin.userId !== req.userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      const binsWithCount = await storage.getBinsByUserId(req.userId);
      const binWithCount = binsWithCount.find((b) => b.id === binId);
      res.json(binWithCount || { ...bin, thoughtmarkCount: 0 });
    } catch (error) {
      console.error("Error fetching bin:", error);
      res.status(500).json({ message: "Failed to fetch bin" });
    }
  });
  app2.post("/api/bins", requireAuth, async (req, res) => {
    try {
      const binData = insertBinSchema.parse(req.body);
      const bin = await storage.createBin({ ...binData, userId: req.userId });
      res.json(bin);
    } catch (error) {
      res.status(400).json({ message: "Invalid bin data", error });
    }
  });
  app2.put("/api/bins/:id", requireAuth, async (req, res) => {
    try {
      const binData = insertBinSchema.partial().parse(req.body);
      const bin = await storage.updateBin(parseInt(req.params.id), binData);
      if (!bin) {
        return res.status(404).json({ message: "Bin not found" });
      }
      res.json(bin);
    } catch (error) {
      res.status(400).json({ message: "Invalid bin data", error });
    }
  });
  app2.patch("/api/bins/:id", requireAuth, async (req, res) => {
    try {
      const binData = insertBinSchema.partial().parse(req.body);
      const bin = await storage.updateBin(parseInt(req.params.id), binData);
      if (!bin) {
        return res.status(404).json({ message: "Bin not found" });
      }
      res.json(bin);
    } catch (error) {
      res.status(400).json({ message: "Invalid bin data", error });
    }
  });
  app2.delete("/api/bins/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteBin(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Bin not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  app2.patch("/api/bins/reorder", requireAuth, async (req, res) => {
    try {
      const { updates } = req.body;
      if (!Array.isArray(updates)) {
        return res.status(400).json({ message: "Invalid updates format" });
      }
      for (const update of updates) {
        await storage.updateBin(update.id, { order: update.order });
      }
      res.json({ message: "Bins reordered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  app2.get("/api/thoughtmarks", requireAuth, async (req, res) => {
    try {
      const thoughtmarks2 = await storage.getThoughtmarksByUserId(req.userId);
      res.json(thoughtmarks2);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  app2.get("/api/thoughtmarks/bin/:binId", requireAuth, async (req, res) => {
    try {
      const thoughtmarks2 = await storage.getThoughtmarksByBinId(parseInt(req.params.binId));
      res.json(thoughtmarks2);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  app2.get("/api/thoughtmarks/deleted", requireAuth, async (req, res) => {
    try {
      const thoughtmarks2 = await storage.getDeletedThoughtmarks(req.userId);
      res.json(thoughtmarks2);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  app2.post("/api/thoughtmarks", requireAuth, async (req, res) => {
    try {
      const thoughtmarkData = insertThoughtmarkSchema.parse(req.body);
      const embeddingText = `${thoughtmarkData.title} ${thoughtmarkData.content}`;
      const embedding = await generateEmbedding(embeddingText);
      const thoughtmark = await storage.createThoughtmark({
        ...thoughtmarkData,
        userId: req.userId,
        embedding: embedding.length > 0 ? JSON.stringify(embedding) : null
      });
      res.json(thoughtmark);
    } catch (error) {
      res.status(400).json({ message: "Invalid thoughtmark data", error });
    }
  });
  app2.put("/api/thoughtmarks/:id", requireAuth, async (req, res) => {
    try {
      const thoughtmarkData = insertThoughtmarkSchema.partial().parse(req.body);
      const thoughtmark = await storage.updateThoughtmark(parseInt(req.params.id), thoughtmarkData);
      if (!thoughtmark) {
        return res.status(404).json({ message: "Thoughtmark not found" });
      }
      res.json(thoughtmark);
    } catch (error) {
      res.status(400).json({ message: "Invalid thoughtmark data", error });
    }
  });
  app2.delete("/api/thoughtmarks/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteThoughtmark(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Thoughtmark not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  app2.post("/api/thoughtmarks/:id/restore", requireAuth, async (req, res) => {
    try {
      const restored = await storage.restoreThoughtmark(parseInt(req.params.id));
      if (!restored) {
        return res.status(404).json({ message: "Thoughtmark not found or not deleted" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  app2.post("/api/upload", requireAuth, async (req, res) => {
    try {
      res.json({
        url: "/placeholder-file.jpg",
        originalName: "placeholder.jpg",
        size: 1024,
        mimetype: "image/jpeg"
      });
    } catch (error) {
      res.status(500).json({ message: "Upload not yet implemented", error });
    }
  });
  app2.get("/api/search", requireAuth, async (req, res) => {
    try {
      const { q: query, tags } = req.query;
      const tagArray = tags ? Array.isArray(tags) ? tags : [tags] : void 0;
      const thoughtmarks2 = await storage.searchThoughtmarks(
        req.userId,
        query || "",
        tagArray
      );
      res.json(thoughtmarks2);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  app2.post("/api/ai/categorize", requireAuth, async (req, res) => {
    try {
      const { title, content } = req.body;
      if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
      }
      const bins2 = await storage.getBinsByUserId(req.userId);
      const binData = bins2.map((bin) => ({
        name: bin.name,
        description: bin.description || ""
      }));
      const suggestions = await categorizethoughtmark(content, title, binData);
      res.json({ suggestions });
    } catch (error) {
      res.status(500).json({ message: "AI categorization failed", error });
    }
  });
  app2.post("/api/ai/similar", requireAuth, async (req, res) => {
    try {
      const { query, limit = 5 } = req.body;
      if (!query) {
        return res.status(400).json({ message: "Query is required" });
      }
      const allThoughtmarks = await storage.getThoughtmarksByUserId(req.userId);
      const thoughtmarksWithEmbeddings = allThoughtmarks.filter((tm) => tm.embedding).map((tm) => ({
        ...tm,
        embedding: tm.embedding ? JSON.parse(tm.embedding) : null
      }));
      const similarThoughtmarks = await findSimilarThoughtmarks(
        query,
        thoughtmarksWithEmbeddings,
        0.6,
        // similarity threshold
        limit
      );
      const results = similarThoughtmarks.map((result) => {
        const thoughtmark = allThoughtmarks.find((tm) => tm.id === result.id);
        return {
          ...thoughtmark,
          similarity: result.similarity
        };
      });
      res.json({ results });
    } catch (error) {
      res.status(500).json({ message: "Semantic search failed", error });
    }
  });
  app2.post("/api/create-subscription", requireAuth, async (req, res) => {
    try {
      const { priceId, amount } = req.body;
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(503).json({
          error: "Stripe configuration required"
        });
      }
      const Stripe = __require("stripe");
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        metadata: {
          priceId,
          userId: req.user.id
        }
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/ai/analyze", requireAuth, async (req, res) => {
    try {
      const { query, thoughtmarks: thoughtmarks2 } = req.body;
      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({
          error: "AI analysis requires OpenAI API key configuration"
        });
      }
      const OpenAI2 = __require("openai");
      const openai2 = new OpenAI2({
        apiKey: process.env.OPENAI_API_KEY
      });
      const thoughtmarkContext = thoughtmarks2.map(
        (tm) => `Title: ${tm.title}
Content: ${tm.content}
Tags: ${tm.tags?.join(", ") || "none"}
Bin: ${tm.binName || "uncategorized"}`
      ).join("\n\n");
      const prompt = `You are an AI assistant analyzing a user's personal thoughtmarks (ideas, notes, and thoughts). 

User Query: "${query}"

Thoughtmarks:
${thoughtmarkContext}

Please provide insights in the following JSON format:
{
  "insights": [
    {
      "type": "summary",
      "title": "Thoughtmark Summary",
      "content": "A comprehensive overview of the user's thoughtmarks, identifying key themes and patterns."
    },
    {
      "type": "connections",
      "title": "Hidden Connections",
      "content": "Unexpected relationships and connections between different ideas in the thoughtmarks."
    },
    {
      "type": "recommendations",
      "title": "Content Recommendations",
      "content": "Based on the analysis, here are relevant resources:",
      "items": [
        {
          "title": "Resource Title",
          "description": "Brief description of why this resource is relevant",
          "type": "book|podcast|article",
          "url": "https://example.com (if available)"
        }
      ]
    }
  ]
}

Focus on providing genuine insights based on the actual content. Be specific about patterns you observe in the user's thinking and interests.`;
      const completion = await openai2.chat.completions.create({
        model: "gpt-4o",
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an expert at analyzing personal knowledge and identifying patterns in thinking. Provide thoughtful, actionable insights based on the user's thoughtmarks. Always respond with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 2e3
      });
      const aiResponse = JSON.parse(completion.choices[0].message.content);
      res.json(aiResponse);
    } catch (error) {
      console.error("OpenAI API Error:", error);
      res.status(500).json({
        error: "Failed to generate AI analysis. Please try again."
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
