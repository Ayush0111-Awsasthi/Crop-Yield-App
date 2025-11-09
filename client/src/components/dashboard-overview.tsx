import { BarChart3, TrendingUp, Droplets, Thermometer, Sprout, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

// todo: remove mock data - this is for design prototype only
const mockYieldData = [
  { month: "Jan", yield: 2.3 },
  { month: "Feb", yield: 2.8 },
  { month: "Mar", yield: 3.2 },
  { month: "Apr", yield: 3.8 },
  { month: "May", yield: 4.1 },
  { month: "Jun", yield: 4.5 },
]

const mockCropComparison = [
  { crop: "Wheat", yield: 4.2, confidence: 85 },
  { crop: "Rice", yield: 6.1, confidence: 78 },
  { crop: "Corn", yield: 8.3, confidence: 92 },
  { crop: "Soybean", yield: 3.4, confidence: 71 },
]

const mockRecentPredictions = [
  { id: 1, crop: "Wheat", area: "12.5 ha", yield: "4.2 t/ha", confidence: 85, status: "completed" },
  { id: 2, crop: "Rice", area: "8.3 ha", yield: "6.1 t/ha", confidence: 78, status: "completed" },
  { id: 3, crop: "Corn", area: "15.2 ha", yield: "8.3 t/ha", confidence: 92, status: "processing" },
]

export function DashboardOverview() {
  const handleQuickPredict = () => {
    console.log("Quick prediction clicked")
  }

  const handleViewDetails = (predictionId: number) => {
    console.log("View details for prediction:", predictionId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">
            Crop Yield Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor your predictions and analyze farming data
          </p>
        </div>
        <Button onClick={handleQuickPredict} data-testid="button-quick-predict">
          <Sprout className="mr-2 h-4 w-4" />
          Quick Prediction
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="metric-total-predictions">147</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="metric-avg-confidence">84.2%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Fields</CardTitle>
            <Sprout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="metric-active-fields">23</div>
            <p className="text-xs text-muted-foreground">
              Across 156.7 hectares
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weather Status</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="metric-weather-status">Optimal</div>
            <p className="text-xs text-muted-foreground">
              25°C, 65% humidity
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yield Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Yield Trends</CardTitle>
            <CardDescription>
              Monthly yield predictions over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockYieldData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="yield" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Crop Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Crop Performance</CardTitle>
            <CardDescription>
              Yield comparison across different crops
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockCropComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="crop" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="yield" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Predictions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Predictions</CardTitle>
          <CardDescription>
            Your latest crop yield predictions and analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentPredictions.map((prediction) => (
              <div key={prediction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Sprout className="h-8 w-8 text-primary" />
                  <div>
                    <h4 className="font-semibold" data-testid={`prediction-crop-${prediction.id}`}>
                      {prediction.crop}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {prediction.area} • Predicted: {prediction.yield}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <Badge 
                      variant={prediction.status === "completed" ? "default" : "secondary"}
                      data-testid={`prediction-status-${prediction.id}`}
                    >
                      {prediction.status === "completed" ? "Completed" : "Processing"}
                    </Badge>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-muted-foreground mr-2">Confidence:</span>
                      <span className="text-sm font-medium">{prediction.confidence}%</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(prediction.id)}
                    data-testid={`button-view-details-${prediction.id}`}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}