import { type User, type InsertUser, type CropField, type InsertCropField, type WeatherData, type InsertWeatherData, type YieldPrediction, type InsertYieldPrediction, type MlModel, type InsertMlModel } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Crop Field methods
  getCropField(id: string): Promise<CropField | undefined>;
  getAllCropFields(): Promise<CropField[]>;
  createCropField(cropField: InsertCropField): Promise<CropField>;
  updateCropField(id: string, updates: Partial<InsertCropField>): Promise<CropField | undefined>;
  deleteCropField(id: string): Promise<boolean>;
  
  // Weather Data methods
  getWeatherData(id: string): Promise<WeatherData | undefined>;
  getWeatherDataByCropField(cropFieldId: string): Promise<WeatherData[]>;
  createWeatherData(weatherData: InsertWeatherData): Promise<WeatherData>;
  getCurrentWeather(): Promise<WeatherData | undefined>;
  getWeatherForecast(days: number): Promise<WeatherData[]>;
  
  // Yield Prediction methods
  getYieldPrediction(id: string): Promise<YieldPrediction | undefined>;
  getAllYieldPredictions(): Promise<YieldPrediction[]>;
  getYieldPredictionsByCropField(cropFieldId: string): Promise<YieldPrediction[]>;
  createYieldPrediction(prediction: InsertYieldPrediction): Promise<YieldPrediction>;
  updateYieldPrediction(id: string, updates: Partial<InsertYieldPrediction>): Promise<YieldPrediction | undefined>;
  
  // ML Model methods
  getMlModel(id: string): Promise<MlModel | undefined>;
  getAllMlModels(): Promise<MlModel[]>;
  createMlModel(model: InsertMlModel): Promise<MlModel>;
  updateMlModel(id: string, updates: Partial<InsertMlModel> & { predictionCount?: number }): Promise<MlModel | undefined>;
  getActiveModels(): Promise<MlModel[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private cropFields: Map<string, CropField>;
  private weatherData: Map<string, WeatherData>;
  private yieldPredictions: Map<string, YieldPrediction>;
  private mlModels: Map<string, MlModel>;

  constructor() {
    this.users = new Map();
    this.cropFields = new Map();
    this.weatherData = new Map();
    this.yieldPredictions = new Map();
    this.mlModels = new Map();
    
    // Initialize with some default ML models
    this.initializeDefaultModels();
  }
  
  private initializeDefaultModels() {
    const defaultModels: MlModel[] = [
      {
        id: randomUUID(),
        name: "Random Forest Regressor",
        type: "Ensemble",
        accuracy: "92.3",
        status: "active",
        lastTrained: new Date("2024-01-15"),
        predictionCount: 1247,
        features: ["Soil pH", "NPK levels", "Weather", "Crop variety"],
        trainingProgress: "100",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Neural Network",
        type: "Deep Learning",
        accuracy: "88.7",
        status: "training",
        lastTrained: new Date("2024-01-14"),
        predictionCount: 892,
        features: ["Soil conditions", "Weather patterns", "Historical yield"],
        trainingProgress: "73",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Linear Regression",
        type: "Linear",
        accuracy: "78.4",
        status: "inactive",
        lastTrained: new Date("2024-01-10"),
        predictionCount: 2156,
        features: ["Basic soil data", "Temperature", "Rainfall"],
        trainingProgress: "100",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Support Vector Machine",
        type: "SVM",
        accuracy: "82.1",
        status: "active",
        lastTrained: new Date("2024-01-12"),
        predictionCount: 1089,
        features: ["Multi-feature analysis", "Weather data", "Soil composition"],
        trainingProgress: "100",
        createdAt: new Date(),
      },
    ];
    
    defaultModels.forEach(model => {
      this.mlModels.set(model.id, model);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Crop Field methods
  async getCropField(id: string): Promise<CropField | undefined> {
    return this.cropFields.get(id);
  }
  
  async getAllCropFields(): Promise<CropField[]> {
    return Array.from(this.cropFields.values());
  }
  
  async createCropField(insertCropField: InsertCropField): Promise<CropField> {
    const id = randomUUID();
    const cropField: CropField = {
      ...insertCropField,
      id,
      createdAt: new Date(),
      // Ensure null values instead of undefined for nullable fields
      soilPH: insertCropField.soilPH ?? null,
      nitrogen: insertCropField.nitrogen ?? null,
      phosphorus: insertCropField.phosphorus ?? null,
      potassium: insertCropField.potassium ?? null,
      irrigationType: insertCropField.irrigationType ?? null,
      fertilizer: insertCropField.fertilizer ?? null,
      pesticides: insertCropField.pesticides ?? null,
      notes: insertCropField.notes ?? null,
    };
    this.cropFields.set(id, cropField);
    return cropField;
  }
  
  async updateCropField(id: string, updates: Partial<InsertCropField>): Promise<CropField | undefined> {
    const existing = this.cropFields.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.cropFields.set(id, updated);
    return updated;
  }
  
  async deleteCropField(id: string): Promise<boolean> {
    return this.cropFields.delete(id);
  }
  
  // Weather Data methods
  async getWeatherData(id: string): Promise<WeatherData | undefined> {
    return this.weatherData.get(id);
  }
  
  async getWeatherDataByCropField(cropFieldId: string): Promise<WeatherData[]> {
    return Array.from(this.weatherData.values())
      .filter(data => data.cropFieldId === cropFieldId);
  }
  
  async createWeatherData(insertWeatherData: InsertWeatherData): Promise<WeatherData> {
    const id = randomUUID();
    const weatherData: WeatherData = {
      ...insertWeatherData,
      id,
      recordedAt: new Date(),
      // Ensure null values instead of undefined for nullable fields
      cropFieldId: insertWeatherData.cropFieldId ?? null,
      rainfall: insertWeatherData.rainfall ?? null,
      temperature: insertWeatherData.temperature ?? null,
      humidity: insertWeatherData.humidity ?? null,
      sunlight: insertWeatherData.sunlight ?? null,
      windSpeed: insertWeatherData.windSpeed ?? null,
      soilMoisture: insertWeatherData.soilMoisture ?? null,
    };
    this.weatherData.set(id, weatherData);
    return weatherData;
  }

  async getCurrentWeather(): Promise<WeatherData | undefined> {
    // Get most recent weather data
    const weatherArray = Array.from(this.weatherData.values());
    if (weatherArray.length === 0) return undefined;
    
    return weatherArray
      .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())[0];
  }

  async getWeatherForecast(days: number): Promise<WeatherData[]> {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    // Get weather data for the next 'days' days
    const weatherArray = Array.from(this.weatherData.values());
    const forecast = weatherArray
      .filter(w => {
        const recordDate = new Date(w.recordedAt);
        recordDate.setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((recordDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff >= 0 && daysDiff < days;
      })
      .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());
    
    return forecast;
  }
  
  // Yield Prediction methods
  async getYieldPrediction(id: string): Promise<YieldPrediction | undefined> {
    return this.yieldPredictions.get(id);
  }
  
  async getAllYieldPredictions(): Promise<YieldPrediction[]> {
    return Array.from(this.yieldPredictions.values())
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }
  
  async getYieldPredictionsByCropField(cropFieldId: string): Promise<YieldPrediction[]> {
    return Array.from(this.yieldPredictions.values())
      .filter(prediction => prediction.cropFieldId === cropFieldId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }
  
  async createYieldPrediction(insertPrediction: InsertYieldPrediction): Promise<YieldPrediction> {
    const id = randomUUID();
    const prediction: YieldPrediction = {
      ...insertPrediction,
      id,
      createdAt: new Date(),
      // Ensure null values instead of undefined for nullable fields
      weatherDataId: insertPrediction.weatherDataId ?? null,
      yieldRangeMin: insertPrediction.yieldRangeMin ?? null,
      yieldRangeMax: insertPrediction.yieldRangeMax ?? null,
      modelUsed: insertPrediction.modelUsed ?? null,
      factors: insertPrediction.factors ?? null,
      recommendations: insertPrediction.recommendations ?? null,
      marketPrice: insertPrediction.marketPrice ?? null,
      estimatedRevenue: insertPrediction.estimatedRevenue ?? null,
      status: insertPrediction.status ?? "completed",
    };
    this.yieldPredictions.set(id, prediction);
    return prediction;
  }
  
  async updateYieldPrediction(id: string, updates: Partial<InsertYieldPrediction>): Promise<YieldPrediction | undefined> {
    const existing = this.yieldPredictions.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.yieldPredictions.set(id, updated);
    return updated;
  }
  
  // ML Model methods
  async getMlModel(id: string): Promise<MlModel | undefined> {
    return this.mlModels.get(id);
  }
  
  async getAllMlModels(): Promise<MlModel[]> {
    return Array.from(this.mlModels.values());
  }
  
  async createMlModel(insertModel: InsertMlModel): Promise<MlModel> {
    const id = randomUUID();
    const model: MlModel = {
      ...insertModel,
      id,
      predictionCount: 0,
      lastTrained: null,
      createdAt: new Date(),
      // Ensure null values instead of undefined for nullable fields
      accuracy: insertModel.accuracy ?? null,
      status: insertModel.status ?? "inactive",
      features: insertModel.features ?? null,
      trainingProgress: insertModel.trainingProgress ?? "0",
    };
    this.mlModels.set(id, model);
    return model;
  }
  
  async updateMlModel(id: string, updates: Partial<InsertMlModel> & { predictionCount?: number }): Promise<MlModel | undefined> {
    const existing = this.mlModels.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.mlModels.set(id, updated);
    return updated;
  }
  
  async getActiveModels(): Promise<MlModel[]> {
    return Array.from(this.mlModels.values())
      .filter(model => model.status === 'active');
  }
}

export const storage = new MemStorage();
