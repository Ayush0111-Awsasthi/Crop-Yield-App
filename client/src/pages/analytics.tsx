import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Download, Calendar } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Area, AreaChart } from "recharts"
import { useState } from "react"


const mockHistoricalData = [
  { month: "Jan", wheat: 4.2, rice: 6.1, corn: 8.3, avgYield: 6.2 },
  { month: "Feb", wheat: 4.5, rice: 5.8, corn: 8.1, avgYield: 6.1 },
  { month: "Mar", wheat: 4.1, rice: 6.3, corn: 8.5, avgYield: 6.3 },
  { month: "Apr", wheat: 4.7, rice: 6.0, corn: 8.2, avgYield: 6.3 },
  { month: "May", wheat: 4.3, rice: 6.4, corn: 8.8, avgYield: 6.5 },
  { month: "Jun", wheat: 4.6, rice: 6.2, corn: 8.4, avgYield: 6.4 },
]

const mockAccuracyData = [
  { model: "Random Forest", accuracy: 92, predictions: 147 },
  { model: "Linear Regression", accuracy: 78, predictions: 134 },
  { model: "Neural Network", accuracy: 88, predictions: 98 },
  { model: "SVM", accuracy: 82, predictions: 156 },
]

const mockSeasonalTrends = [
  { season: "Spring", yield: 6.8, confidence: 87 },
  { season: "Summer", yield: 7.2, confidence: 91 },
  { season: "Fall", yield: 5.9, confidence: 83 },
  { season: "Winter", yield: 4.3, confidence: 79 },
]

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("6months")
  const [cropFilter, setCropFilter] = useState("all")

  const handleExport = () => {
    console.log("Exporting analytics data")
    alert("Analytics data exported successfully!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-analytics-title">
            Historical Analytics
          </h1>
          <p className="text-muted-foreground">
            Analyze your crop prediction performance and trends
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40" data-testid="select-time-range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} data-testid="button-export">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-total-predictions">347</div>
            <p className="text-xs text-muted-foreground">
              +23% from previous period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-avg-accuracy">87.3%</div>
            <p className="text-xs text-muted-foreground">
              +1.2% from previous period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Performing Crop</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-best-crop">Corn</div>
            <p className="text-xs text-muted-foreground">
              8.4 t/ha average yield
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Impact</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-revenue-impact">$2.4M</div>
            <p className="text-xs text-muted-foreground">
              Total estimated revenue
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yield Trends Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Yield Trends by Crop</CardTitle>
            <CardDescription>
              Historical yield performance across different crops
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockHistoricalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="wheat" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Wheat" />
                <Line type="monotone" dataKey="rice" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Rice" />
                <Line type="monotone" dataKey="corn" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Corn" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Model Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Model Performance</CardTitle>
            <CardDescription>
              Accuracy comparison across ML models
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockAccuracyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="model" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="accuracy" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Seasonal Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Seasonal Performance Analysis</CardTitle>
          <CardDescription>
            Yield performance and prediction confidence by season
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {mockSeasonalTrends.map((season, index) => (
              <div key={index} className="p-4 border rounded-lg text-center">
                <h3 className="font-semibold text-lg" data-testid={`season-${index}`}>
                  {season.season}
                </h3>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-primary">
                    {season.yield} t/ha
                  </p>
                  <Badge 
                    variant={season.confidence >= 85 ? "default" : "secondary"}
                    className="mt-2"
                  >
                    {season.confidence}% confidence
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Average Yield Trends</CardTitle>
          <CardDescription>
            Overall yield performance with confidence intervals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={mockHistoricalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="avgYield"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}