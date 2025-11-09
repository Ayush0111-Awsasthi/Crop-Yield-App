import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Crop Fields table
export const cropFields = pgTable("crop_fields", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cropType: text("crop_type").notNull(),
  variety: text("variety").notNull(),
  plantingArea: decimal("planting_area", { precision: 10, scale: 2 }).notNull(),
  soilType: text("soil_type").notNull(),
  soilPH: decimal("soil_ph", { precision: 3, scale: 1 }),
  nitrogen: decimal("nitrogen", { precision: 8, scale: 2 }),
  phosphorus: decimal("phosphorus", { precision: 8, scale: 2 }),
  potassium: decimal("potassium", { precision: 8, scale: 2 }),
  irrigationType: text("irrigation_type"),
  fertilizer: text("fertilizer"),
  pesticides: text("pesticides"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Weather Data table
export const weatherData = pgTable("weather_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cropFieldId: varchar("crop_field_id").references(() => cropFields.id),
  rainfall: decimal("rainfall", { precision: 8, scale: 2 }),
  temperature: decimal("temperature", { precision: 5, scale: 2 }),
  humidity: decimal("humidity", { precision: 5, scale: 2 }),
  sunlight: decimal("sunlight", { precision: 4, scale: 1 }),
  windSpeed: decimal("wind_speed", { precision: 5, scale: 2 }),
  soilMoisture: decimal("soil_moisture", { precision: 5, scale: 2 }),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

// Yield Predictions table
export const yieldPredictions = pgTable("yield_predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cropFieldId: varchar("crop_field_id").notNull().references(() => cropFields.id),
  weatherDataId: varchar("weather_data_id").references(() => weatherData.id),
  predictedYield: decimal("predicted_yield", { precision: 8, scale: 2 }).notNull(),
  confidence: decimal("confidence", { precision: 5, scale: 2 }).notNull(),
  yieldRangeMin: decimal("yield_range_min", { precision: 8, scale: 2 }),
  yieldRangeMax: decimal("yield_range_max", { precision: 8, scale: 2 }),
  modelUsed: text("model_used"),
  factors: jsonb("factors"), // Store factor analysis as JSON
  recommendations: jsonb("recommendations"), // Store recommendations as JSON array
  marketPrice: decimal("market_price", { precision: 8, scale: 2 }),
  estimatedRevenue: decimal("estimated_revenue", { precision: 12, scale: 2 }),
  status: text("status").default("completed"), // completed, processing, failed
  createdAt: timestamp("created_at").defaultNow(),
});

// ML Models table
export const mlModels = pgTable("ml_models", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // Random Forest, Neural Network, etc.
  accuracy: decimal("accuracy", { precision: 5, scale: 2 }),
  status: text("status").default("inactive"), // active, inactive, training
  lastTrained: timestamp("last_trained"),
  predictionCount: integer("prediction_count").default(0),
  features: jsonb("features"), // Store feature list as JSON array
  trainingProgress: decimal("training_progress", { precision: 5, scale: 2 }).default(sql`0`),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for validation
export const insertCropFieldSchema = createInsertSchema(cropFields).omit({
  id: true,
  createdAt: true,
});

export const insertWeatherDataSchema = createInsertSchema(weatherData).omit({
  id: true,
  recordedAt: true,
});

export const insertYieldPredictionSchema = createInsertSchema(yieldPredictions).omit({
  id: true,
  createdAt: true,
});

export const insertMlModelSchema = createInsertSchema(mlModels).omit({
  id: true,
  createdAt: true,
  lastTrained: true,
  predictionCount: true,
});

// Types
export type InsertCropField = z.infer<typeof insertCropFieldSchema>;
export type CropField = typeof cropFields.$inferSelect;

export type InsertWeatherData = z.infer<typeof insertWeatherDataSchema>;
export type WeatherData = typeof weatherData.$inferSelect;

export type InsertYieldPrediction = z.infer<typeof insertYieldPredictionSchema>;
export type YieldPrediction = typeof yieldPredictions.$inferSelect;

export type InsertMlModel = z.infer<typeof insertMlModelSchema>;
export type MlModel = typeof mlModels.$inferSelect;
