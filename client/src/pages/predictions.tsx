import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sprout, Search, Calendar, TrendingUp } from "lucide-react"
import { PredictionResults } from "@/components/prediction-results"

// todo: remove mock data - this is for design prototype only
const mockPredictions = [
  {
    id: 1,
    cropType: "Wheat",
    date: "2024-01-15",
    predictedYield: 4.2,
    confidence: 87,
    status: "completed",
    area: "12.5 ha",
    yieldRange: { min: 3.8, max: 4.6 },
    factors: [
      { name: "Soil pH Level", impact: "positive" as const, value: "6.8 (Optimal)" },
      { name: "Nitrogen Content", impact: "positive" as const, value: "120 kg/ha (Good)" },
      { name: "Rainfall", impact: "neutral" as const, value: "480mm (Adequate)" },
      { name: "Temperature", impact: "positive" as const, value: "24°C (Optimal)" },
    ],
    recommendations: [
      "Increase irrigation frequency to improve soil moisture levels",
      "Monitor weather conditions for optimal harvesting timing"
    ],
    marketPrice: 350,
    estimatedRevenue: 18375
  },
  {
    id: 2,
    cropType: "Rice",
    date: "2024-01-12",
    predictedYield: 6.1,
    confidence: 78,
    status: "completed",
    area: "8.3 ha",
    yieldRange: { min: 5.5, max: 6.7 },
    factors: [
      { name: "Water Management", impact: "positive" as const, value: "Excellent" },
      { name: "Temperature", impact: "positive" as const, value: "28°C (Ideal)" },
      { name: "Humidity", impact: "neutral" as const, value: "78% (High)" },
    ],
    recommendations: [
      "Maintain consistent water levels",
      "Monitor for pest activity during heading stage"
    ],
    marketPrice: 420,
    estimatedRevenue: 21252
  },
  {
    id: 3,
    cropType: "Corn",
    date: "2024-01-10",
    predictedYield: 8.3,
    confidence: 92,
    status: "completed",
    area: "15.2 ha",
    yieldRange: { min: 7.8, max: 8.8 },
    factors: [
      { name: "Soil Fertility", impact: "positive" as const, value: "Excellent" },
      { name: "Spacing", impact: "positive" as const, value: "Optimal density" },
    ],
    recommendations: [
      "Continue current fertilization program",
      "Prepare for timely harvest"
    ],
    marketPrice: 280,
    estimatedRevenue: 35318
  }
]

export default function Predictions() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCrop, setFilterCrop] = useState("")
  const [selectedPrediction, setSelectedPrediction] = useState<any>(null)

  const filteredPredictions = mockPredictions.filter(prediction => {
    const matchesSearch = prediction.cropType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterCrop === "" || prediction.cropType === filterCrop
    return matchesSearch && matchesFilter
  })

  const handleViewPrediction = (prediction: any) => {
    console.log("Viewing prediction:", prediction.id)
    setSelectedPrediction(prediction)
  }

  const handleBackToList = () => {
    setSelectedPrediction(null)
  }

  if (selectedPrediction) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBackToList} data-testid="button-back">
            ← Back to Predictions
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Prediction Details</h1>
            <p className="text-muted-foreground">
              {selectedPrediction.cropType} • {selectedPrediction.area} • {selectedPrediction.date}
            </p>
          </div>
        </div>
        <PredictionResults data={selectedPrediction} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-predictions-title">
            Yield Predictions
          </h1>
          <p className="text-muted-foreground">
            View and manage your crop yield prediction history
          </p>
        </div>
        <Button data-testid="button-new-prediction">
          <Sprout className="mr-2 h-4 w-4" />
          New Prediction
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search predictions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Select value={filterCrop} onValueChange={setFilterCrop}>
              <SelectTrigger className="w-48" data-testid="select-filter-crop">
                <SelectValue placeholder="All crops" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All crops</SelectItem>
                <SelectItem value="Wheat">Wheat</SelectItem>
                <SelectItem value="Rice">Rice</SelectItem>
                <SelectItem value="Corn">Corn</SelectItem>
                <SelectItem value="Soybean">Soybean</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Predictions List */}
      <div className="space-y-4">
        {filteredPredictions.map((prediction) => (
          <Card key={prediction.id} className="hover-elevate">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Sprout className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold" data-testid={`prediction-title-${prediction.id}`}>
                        {prediction.cropType}
                      </h3>
                      <Badge 
                        variant={prediction.confidence >= 85 ? "default" : prediction.confidence >= 70 ? "secondary" : "destructive"}
                        data-testid={`prediction-confidence-${prediction.id}`}
                      >
                        {prediction.confidence}% confidence
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{prediction.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{prediction.predictedYield} t/ha</span>
                      </div>
                      <span>Area: {prediction.area}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">
                      ${prediction.estimatedRevenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Est. revenue
                    </p>
                  </div>
                  <Button 
                    onClick={() => handleViewPrediction(prediction)}
                    data-testid={`button-view-${prediction.id}`}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPredictions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Sprout className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No predictions found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterCrop ? "Try adjusting your search filters" : "Start by creating your first crop prediction"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}