import { PredictionResults } from '../prediction-results'

export default function PredictionResultsExample() {
  // todo: remove mock data - this is for design prototype only
  const mockData = {
    cropType: "Wheat",
    predictedYield: 4.2,
    confidence: 87,
    yieldRange: { min: 3.8, max: 4.6 },
    factors: [
      { name: "Soil pH Level", impact: "positive" as const, value: "6.8 (Optimal)" },
      { name: "Nitrogen Content", impact: "positive" as const, value: "120 kg/ha (Good)" },
      { name: "Rainfall", impact: "neutral" as const, value: "480mm (Adequate)" },
      { name: "Temperature", impact: "positive" as const, value: "24°C (Optimal)" },
      { name: "Soil Moisture", impact: "negative" as const, value: "35% (Low)" },
    ],
    recommendations: [
      "Increase irrigation frequency to improve soil moisture levels",
      "Consider applying potassium fertilizer for better root development",
      "Monitor weather conditions for optimal harvesting timing",
      "Implement precision farming techniques in low-yield areas"
    ],
    marketPrice: 350,
    estimatedRevenue: 5880
  }

  return (
    <div className="p-6">
      <PredictionResults data={mockData} />
    </div>
  )
}