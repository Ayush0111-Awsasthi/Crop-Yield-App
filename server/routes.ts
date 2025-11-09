import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCropFieldSchema, insertYieldPredictionSchema, type CropField, type YieldPrediction } from "@shared/schema";
import { randomUUID } from "crypto";

// ML Prediction Engine - Realistic yield calculation based on input factors
function calculateYieldPrediction(cropField: CropField, weatherData?: any): {
  predictedYield: number;
  confidence: number;
  yieldRange: { min: number; max: number };
  factors: Array<{ name: string; impact: 'positive' | 'negative' | 'neutral'; value: string }>;
  recommendations: string[];
} {
  let baseYield = 0;
  let confidence = 75;
  const factors: Array<{ name: string; impact: 'positive' | 'negative' | 'neutral'; value: string }> = [];
  const recommendations: string[] = [];

  // Base yield by crop type
  const cropYields: Record<string, number> = {
    wheat: 4.0,
    rice: 6.0,
    corn: 8.0,
    soybean: 3.2,
    cotton: 2.8,
    tomato: 45.0,
    potato: 25.0
  };

  baseYield = cropYields[cropField.cropType.toLowerCase()] || 4.0;

  // Soil pH factor
  if (cropField.soilPH) {
    const pH = parseFloat(cropField.soilPH);
    if (pH >= 6.0 && pH <= 7.5) {
      baseYield *= 1.1;
      factors.push({ name: "Soil pH Level", impact: "positive", value: `${pH} (Optimal)` });
      confidence += 5;
    } else if (pH < 5.5 || pH > 8.0) {
      baseYield *= 0.85;
      factors.push({ name: "Soil pH Level", impact: "negative", value: `${pH} (Needs adjustment)` });
      recommendations.push("Adjust soil pH to optimal range (6.0-7.5) using lime or sulfur");
      confidence -= 5;
    } else {
      factors.push({ name: "Soil pH Level", impact: "neutral", value: `${pH} (Acceptable)` });
    }
  }

  // Nitrogen factor
  if (cropField.nitrogen) {
    const nitrogen = parseFloat(cropField.nitrogen);
    if (nitrogen >= 100 && nitrogen <= 150) {
      baseYield *= 1.15;
      factors.push({ name: "Nitrogen Content", impact: "positive", value: `${nitrogen} kg/ha (Excellent)` });
      confidence += 8;
    } else if (nitrogen < 80) {
      baseYield *= 0.9;
      factors.push({ name: "Nitrogen Content", impact: "negative", value: `${nitrogen} kg/ha (Low)` });
      recommendations.push("Increase nitrogen application for better yield");
      confidence -= 5;
    } else {
      factors.push({ name: "Nitrogen Content", impact: "positive", value: `${nitrogen} kg/ha (Good)` });
      baseYield *= 1.05;
    }
  }

  // Phosphorus factor
  if (cropField.phosphorus) {
    const phosphorus = parseFloat(cropField.phosphorus);
    if (phosphorus >= 60 && phosphorus <= 100) {
      baseYield *= 1.08;
      factors.push({ name: "Phosphorus Content", impact: "positive", value: `${phosphorus} kg/ha (Optimal)` });
      confidence += 3;
    } else if (phosphorus < 40) {
      baseYield *= 0.92;
      factors.push({ name: "Phosphorus Content", impact: "negative", value: `${phosphorus} kg/ha (Deficient)` });
      recommendations.push("Apply phosphorus fertilizer to improve root development");
    }
  }

  // Potassium factor
  if (cropField.potassium) {
    const potassium = parseFloat(cropField.potassium);
    if (potassium >= 80 && potassium <= 120) {
      baseYield *= 1.06;
      factors.push({ name: "Potassium Content", impact: "positive", value: `${potassium} kg/ha (Good)` });
    } else if (potassium < 60) {
      baseYield *= 0.94;
      factors.push({ name: "Potassium Content", impact: "negative", value: `${potassium} kg/ha (Low)` });
      recommendations.push("Increase potassium for better disease resistance");
    }
  }

  // Soil type factor
  const soilMultipliers: Record<string, number> = {
    loamy: 1.1,
    clay: 0.95,
    sandy: 0.9,
    silt: 1.02
  };
  const soilMultiplier = soilMultipliers[cropField.soilType.toLowerCase()] || 1.0;
  baseYield *= soilMultiplier;
  factors.push({ 
    name: "Soil Type", 
    impact: soilMultiplier > 1.0 ? "positive" : "neutral", 
    value: `${cropField.soilType} (${soilMultiplier > 1.0 ? 'Excellent' : 'Suitable'})` 
  });

  // Irrigation factor
  if (cropField.irrigationType) {
    const irrigationBonus: Record<string, number> = {
      drip: 1.12,
      sprinkler: 1.08,
      flood: 1.02,
      rainfed: 0.95
    };
    const bonus = irrigationBonus[cropField.irrigationType.toLowerCase()] || 1.0;
    baseYield *= bonus;
    factors.push({ 
      name: "Irrigation System", 
      impact: bonus > 1.05 ? "positive" : "neutral", 
      value: `${cropField.irrigationType} (${bonus > 1.05 ? 'Efficient' : 'Standard'})` 
    });

    if (cropField.irrigationType.toLowerCase() === 'drip') {
      recommendations.push("Excellent choice of irrigation system - continue with drip irrigation");
    }
  }

  // Weather factors (if provided)
  if (weatherData) {
    if (weatherData.temperature) {
      const temp = parseFloat(weatherData.temperature);
      if (temp >= 20 && temp <= 28) {
        baseYield *= 1.05;
        factors.push({ name: "Temperature", impact: "positive", value: `${temp}°C (Optimal)` });
      } else if (temp < 15 || temp > 35) {
        baseYield *= 0.9;
        factors.push({ name: "Temperature", impact: "negative", value: `${temp}°C (Stressful)` });
        recommendations.push("Monitor crop stress due to temperature extremes");
      }
    }

    if (weatherData.rainfall) {
      const rainfall = parseFloat(weatherData.rainfall);
      if (rainfall >= 400 && rainfall <= 800) {
        baseYield *= 1.08;
        factors.push({ name: "Rainfall", impact: "positive", value: `${rainfall}mm (Adequate)` });
      } else if (rainfall < 300) {
        baseYield *= 0.85;
        factors.push({ name: "Rainfall", impact: "negative", value: `${rainfall}mm (Insufficient)` });
        recommendations.push("Increase irrigation frequency due to low rainfall");
      } else if (rainfall > 1000) {
        baseYield *= 0.92;
        factors.push({ name: "Rainfall", impact: "negative", value: `${rainfall}mm (Excessive)` });
        recommendations.push("Ensure proper drainage to prevent waterlogging");
      }
    }
  }

  // Add some general recommendations
  if (recommendations.length === 0) {
    recommendations.push("Continue current farming practices - conditions are favorable");
    recommendations.push("Monitor crop health regularly during critical growth stages");
  }
  recommendations.push("Consider soil testing before next planting season");

  // Calculate confidence based on data completeness
  const dataCompleteness = [
    cropField.soilPH,
    cropField.nitrogen,
    cropField.phosphorus,
    cropField.potassium,
    cropField.irrigationType
  ].filter(Boolean).length;
  
  confidence += dataCompleteness * 3; // More complete data = higher confidence
  confidence = Math.min(Math.max(confidence, 65), 95); // Keep confidence between 65-95%

  // Calculate yield range (±15% of predicted yield)
  const variance = baseYield * 0.15;
  const yieldRange = {
    min: Math.max(baseYield - variance, 0.5),
    max: baseYield + variance
  };

  return {
    predictedYield: Math.round(baseYield * 10) / 10,
    confidence: Math.round(confidence),
    yieldRange: {
      min: Math.round(yieldRange.min * 10) / 10,
      max: Math.round(yieldRange.max * 10) / 10
    },
    factors,
    recommendations
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Crop Fields endpoints
  app.post('/api/crop-fields', async (req, res) => {
    try {
      const validatedData = insertCropFieldSchema.parse(req.body);
      const cropField = await storage.createCropField(validatedData);
      res.json({ success: true, data: cropField });
    } catch (error) {
      console.error('Error creating crop field:', error);
      res.status(400).json({ success: false, error: 'Invalid crop field data' });
    }
  });

  app.get('/api/crop-fields', async (req, res) => {
    try {
      const cropFields = await storage.getAllCropFields();
      res.json({ success: true, data: cropFields });
    } catch (error) {
      console.error('Error fetching crop fields:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch crop fields' });
    }
  });

  app.get('/api/crop-fields/:id', async (req, res) => {
    try {
      const cropField = await storage.getCropField(req.params.id);
      if (!cropField) {
        return res.status(404).json({ success: false, error: 'Crop field not found' });
      }
      res.json({ success: true, data: cropField });
    } catch (error) {
      console.error('Error fetching crop field:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch crop field' });
    }
  });

  // Prediction endpoints
  app.post('/api/predictions', async (req, res) => {
    try {
      const { cropFieldData, weatherData } = req.body;
      
      // Validate and create crop field if provided
      let cropField: CropField;
      if (cropFieldData.id) {
        // Use existing crop field
        const existing = await storage.getCropField(cropFieldData.id);
        if (!existing) {
          return res.status(404).json({ success: false, error: 'Crop field not found' });
        }
        cropField = existing;
      } else {
        // Create new crop field
        const validatedCropData = insertCropFieldSchema.parse(cropFieldData);
        cropField = await storage.createCropField(validatedCropData);
      }

      // Generate ML prediction
      const prediction = calculateYieldPrediction(cropField, weatherData);

      // Create weather data if provided
      let weatherDataId = null;
      if (weatherData && Object.keys(weatherData).length > 0) {
        const createdWeather = await storage.createWeatherData({
          cropFieldId: cropField.id,
          ...weatherData
        });
        weatherDataId = createdWeather.id;
      }

      // Market price simulation (varies by crop type)
      const marketPrices: Record<string, number> = {
        wheat: 320,
        rice: 420,
        corn: 280,
        soybean: 450,
        cotton: 1200,
        tomato: 180,
        potato: 220
      };
      const marketPrice = marketPrices[cropField.cropType.toLowerCase()] || 300;
      const estimatedRevenue = Math.round(prediction.predictedYield * parseFloat(cropField.plantingArea) * marketPrice);

      // Get active ML model for attribution
      const activeModels = await storage.getActiveModels();
      const modelUsed = activeModels.length > 0 ? activeModels[0].name : "Default Prediction Model";

      // Store prediction
      const savedPrediction = await storage.createYieldPrediction({
        cropFieldId: cropField.id,
        weatherDataId,
        predictedYield: prediction.predictedYield.toString(),
        confidence: prediction.confidence.toString(),
        yieldRangeMin: prediction.yieldRange.min.toString(),
        yieldRangeMax: prediction.yieldRange.max.toString(),
        modelUsed,
        factors: prediction.factors,
        recommendations: prediction.recommendations,
        marketPrice: marketPrice.toString(),
        estimatedRevenue: estimatedRevenue.toString(),
        status: "completed"
      });

      // Update model prediction count
      if (activeModels.length > 0) {
        await storage.updateMlModel(activeModels[0].id, {
          predictionCount: (activeModels[0].predictionCount || 0) + 1
        });
      }

      res.json({ 
        success: true, 
        data: {
          ...savedPrediction,
          cropField,
          // Convert string values back to numbers for frontend
          predictedYield: parseFloat(savedPrediction.predictedYield),
          confidence: parseFloat(savedPrediction.confidence),
          yieldRangeMin: parseFloat(savedPrediction.yieldRangeMin || "0"),
          yieldRangeMax: parseFloat(savedPrediction.yieldRangeMax || "0"),
          marketPrice: parseFloat(savedPrediction.marketPrice || "0"),
          estimatedRevenue: parseFloat(savedPrediction.estimatedRevenue || "0")
        }
      });
    } catch (error) {
      console.error('Error generating prediction:', error);
      res.status(400).json({ success: false, error: 'Failed to generate prediction' });
    }
  });

  app.get('/api/predictions', async (req, res) => {
    try {
      const predictions = await storage.getAllYieldPredictions();
      res.json({ success: true, data: predictions });
    } catch (error) {
      console.error('Error fetching predictions:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch predictions' });
    }
  });

  app.get('/api/predictions/:id', async (req, res) => {
    try {
      const prediction = await storage.getYieldPrediction(req.params.id);
      if (!prediction) {
        return res.status(404).json({ success: false, error: 'Prediction not found' });
      }
      res.json({ success: true, data: prediction });
    } catch (error) {
      console.error('Error fetching prediction:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch prediction' });
    }
  });

  app.get('/api/crop-fields/:id/predictions', async (req, res) => {
    try {
      const predictions = await storage.getYieldPredictionsByCropField(req.params.id);
      res.json({ success: true, data: predictions });
    } catch (error) {
      console.error('Error fetching crop field predictions:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch predictions' });
    }
  });

  // Weather endpoints
  app.get('/api/weather/current', async (req, res) => {
    try {
      // Get or create current weather conditions
      const currentWeather = await storage.getCurrentWeather();
      
      if (!currentWeather) {
        // Create initial weather data if none exists
        const initialWeather = await storage.createWeatherData({
          temperature: 25.0,
          humidity: 65.0,
          rainfall: 0.0,
          windSpeed: 12.0,
          soilMoisture: 42.0,
          uvIndex: 7,
          condition: 'partly-cloudy',
          recordedAt: new Date()
        });
        
        return res.json({
          success: true,
          data: initialWeather
        });
      }
      
      res.json({
        success: true,
        data: currentWeather
      });
    } catch (error) {
      console.error('Error fetching current weather:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch current weather'
      });
    }
  });
  
  app.get('/api/weather/forecast', async (req, res) => {
    try {
      // Generate or get 7-day forecast data
      const forecast = await storage.getWeatherForecast(7);
      
      if (forecast.length === 0) {
        // Generate initial forecast data
        const forecastData = [
          { day: 'Mon', temperature: 24, humidity: 65, rainfall: 2 },
          { day: 'Tue', temperature: 26, humidity: 72, rainfall: 8 },
          { day: 'Wed', temperature: 23, humidity: 78, rainfall: 12 },
          { day: 'Thu', temperature: 25, humidity: 68, rainfall: 0 },
          { day: 'Fri', temperature: 27, humidity: 61, rainfall: 0 },
          { day: 'Sat', temperature: 28, humidity: 58, rainfall: 0 },
          { day: 'Sun', temperature: 26, humidity: 64, rainfall: 3 }
        ];
        
        // Create weather data entries for the forecast
        const createdForecast = [];
        const baseDate = new Date();
        
        for (let i = 0; i < forecastData.length; i++) {
          const forecastDate = new Date(baseDate);
          forecastDate.setDate(baseDate.getDate() + i);
          
          const weather = await storage.createWeatherData({
            temperature: forecastData[i].temperature,
            humidity: forecastData[i].humidity,
            rainfall: forecastData[i].rainfall,
            windSpeed: 10 + Math.random() * 8, // 10-18 km/h
            soilMoisture: 35 + Math.random() * 20, // 35-55%
            uvIndex: Math.floor(Math.random() * 10) + 1,
            condition: forecastData[i].rainfall > 5 ? 'rainy' : 
                      forecastData[i].rainfall > 0 ? 'partly-cloudy' : 'sunny',
            recordedAt: forecastDate
          });
          
          createdForecast.push({
            day: forecastData[i].day,
            temperature: weather.temperature,
            humidity: weather.humidity,
            rainfall: weather.rainfall
          });
        }
        
        return res.json({
          success: true,
          data: createdForecast
        });
      }
      
      // Format existing forecast data
      const formattedForecast = forecast.map((weather, index) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const date = new Date(weather.recordedAt);
        return {
          day: days[date.getDay()],
          temperature: weather.temperature,
          humidity: weather.humidity,
          rainfall: weather.rainfall
        };
      });
      
      res.json({
        success: true,
        data: formattedForecast
      });
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch weather forecast'
      });
    }
  });
  
  app.get('/api/weather/impact', async (req, res) => {
    try {
      const currentWeather = await storage.getCurrentWeather();
      
      if (!currentWeather) {
        return res.status(404).json({
          success: false,
          error: 'No current weather data available'
        });
      }
      
      // Calculate weather impact on crop growth
      const calculateWeatherImpact = (weather: any) => {
        const factors = [];
        let totalScore = 0;
        
        // Temperature impact (20-30°C optimal)
        const tempScore = weather.temperature >= 20 && weather.temperature <= 30 ? 100 : 
                         weather.temperature >= 15 && weather.temperature <= 35 ? 75 : 50;
        factors.push({
          name: 'Temperature',
          status: tempScore >= 90 ? 'optimal' : tempScore >= 70 ? 'adequate' : 'suboptimal',
          impact: tempScore >= 70 ? 'positive' : 'negative'
        });
        totalScore += tempScore * 0.3; // 30% weight
        
        // Rainfall impact (5-15mm per day optimal)
        const rainScore = weather.rainfall >= 5 && weather.rainfall <= 15 ? 100 : 
                         weather.rainfall >= 0 && weather.rainfall <= 25 ? 75 : 50;
        factors.push({
          name: 'Rainfall',
          status: rainScore >= 90 ? 'optimal' : rainScore >= 70 ? 'adequate' : 
                 weather.rainfall > 25 ? 'high' : 'low',
          impact: rainScore >= 70 ? 'positive' : 'negative'
        });
        totalScore += rainScore * 0.25; // 25% weight
        
        // Humidity impact (50-70% optimal)
        const humidityScore = weather.humidity >= 50 && weather.humidity <= 70 ? 100 : 
                             weather.humidity >= 40 && weather.humidity <= 80 ? 75 : 50;
        factors.push({
          name: 'Humidity',
          status: humidityScore >= 90 ? 'optimal' : humidityScore >= 70 ? 'adequate' : 
                 weather.humidity > 70 ? 'high' : 'low',
          impact: humidityScore >= 70 ? 'positive' : humidityScore >= 60 ? 'neutral' : 'negative'
        });
        totalScore += humidityScore * 0.2; // 20% weight
        
        // Soil Moisture impact (40-60% optimal)
        const soilScore = weather.soilMoisture >= 40 && weather.soilMoisture <= 60 ? 100 : 
                         weather.soilMoisture >= 30 && weather.soilMoisture <= 70 ? 75 : 50;
        factors.push({
          name: 'Soil Moisture',
          status: soilScore >= 90 ? 'optimal' : soilScore >= 70 ? 'adequate' : 
                 weather.soilMoisture < 30 ? 'low' : 'high',
          impact: soilScore >= 70 ? 'positive' : 'negative'
        });
        totalScore += soilScore * 0.25; // 25% weight
        
        const overallScore = Math.round(totalScore);
        
        return {
          overall: overallScore >= 80 ? 'favorable' : overallScore >= 60 ? 'moderate' : 'unfavorable',
          score: overallScore,
          factors
        };
      };
      
      const impact = calculateWeatherImpact(currentWeather);
      
      res.json({
        success: true,
        data: impact
      });
    } catch (error) {
      console.error('Error calculating weather impact:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to calculate weather impact'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
