import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function WeatherAnalysis() {
  const queryClient = useQueryClient();

  // Fetch current weather data
  const { data: currentWeatherData, isLoading: currentLoading, error: currentError } = useQuery({
    queryKey: ['/api/weather/current'],
  });

  // Fetch weather forecast data
  const { data: forecastData, isLoading: forecastLoading, error: forecastError } = useQuery({
    queryKey: ['/api/weather/forecast'],
  });

  // Fetch weather impact data (only after current weather is available)
  const { data: impactData, isLoading: impactLoading, error: impactError } = useQuery({
    queryKey: ['/api/weather/impact'],
    enabled: !!currentWeatherData?.data, // Only fetch impact after current weather is available
  });

  const currentWeather = currentWeatherData?.data;
  const weatherForecast = forecastData?.data || [];
  const weatherImpact = impactData?.data;

  const isLoading = currentLoading || forecastLoading || impactLoading;
  const hasError = currentError || forecastError || impactError;
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-6 w-6 text-yellow-500" />
      case "partly-cloudy":
        return <Cloud className="h-6 w-6 text-gray-500" />
      case "rainy":
        return <CloudRain className="h-6 w-6 text-blue-500" />
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "adequate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "high":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "positive":
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">Positive</Badge>
      case "negative":
        return <Badge variant="destructive">Negative</Badge>
      default:
        return <Badge variant="secondary">Neutral</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-weather-title">
          Weather Analysis
        </h1>
        <p className="text-muted-foreground">
          Current conditions and forecast impact on crop growth
        </p>
      </div>

      {/* Error Alert with Retry */}
      {hasError && (
        <Alert variant="destructive" data-testid="status-weather-error">
          <AlertDescription>
            Failed to load weather data. Please try again.
            <div className="mt-2 flex gap-2">
              <Button size="sm" onClick={() => {
                if (currentError) queryClient.invalidateQueries({ queryKey: ['/api/weather/current'] })
                if (forecastError) queryClient.invalidateQueries({ queryKey: ['/api/weather/forecast'] })
                if (impactError) queryClient.invalidateQueries({ queryKey: ['/api/weather/impact'] })
              }} data-testid="button-retry-weather">
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Current Weather */}
      {currentLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-10 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : currentError ? (
        <Card>
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load current weather data.
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-4"
                  data-testid="button-retry-current"
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/weather/current'] })}
                >
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="metric-temperature">
              {currentWeather?.temperature}°C
            </div>
            <p className="text-xs text-muted-foreground">Optimal range</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Humidity</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="metric-humidity">
              {currentWeather?.humidity}%
            </div>
            <p className="text-xs text-muted-foreground">Slightly high</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wind Speed</CardTitle>
            <Wind className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="metric-wind">
              {currentWeather?.windSpeed} km/h
            </div>
            <p className="text-xs text-muted-foreground">Light breeze</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Soil Moisture</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="metric-soil-moisture">
              {currentWeather?.soilMoisture}%
            </div>
            <p className="text-xs text-muted-foreground">Needs irrigation</p>
          </CardContent>
        </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>7-Day Forecast</CardTitle>
            <CardDescription>
              Temperature and precipitation trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            {forecastLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weatherForecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  stackId="1"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="rainfall"
                  stackId="2"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.6}
                />
              </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Weather Impact Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Impact on Crop Growth</CardTitle>
            <CardDescription>
              How current weather affects your crops
            </CardDescription>
          </CardHeader>
          <CardContent>
            {impactLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-2 w-full" />
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : impactError ? (
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to load weather impact data.
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4"
                    data-testid="button-retry-impact"
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/weather/impact'] })}
                  >
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Impact Score</span>
                <Badge 
                  variant="default" 
                  className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
                  data-testid="badge-overall-impact"
                >
                  {weatherImpact?.overall} ({weatherImpact?.score}%)
                </Badge>
              </div>
              <Progress value={weatherImpact?.score} className="h-2" />
              
              <div className="space-y-3 mt-4">
                {(weatherImpact?.factors || []).map((factor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">{factor.name}</span>
                      <Badge 
                        className={`ml-2 ${getStatusColor(factor.status)}`}
                        data-testid={`factor-status-${index}`}
                      >
                        {factor.status}
                      </Badge>
                    </div>
                    {getImpactBadge(factor.impact)}
                  </div>
                ))}
              </div>
            </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Weather Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Weather Metrics</CardTitle>
          <CardDescription>
            Temperature, humidity, and rainfall patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {forecastLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
            <LineChart data={weatherForecast}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
                name="Temperature (°C)"
              />
              <Line 
                type="monotone" 
                dataKey="humidity" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                name="Humidity (%)"
              />
              <Line 
                type="monotone" 
                dataKey="rainfall" 
                stroke="hsl(var(--chart-3))" 
                strokeWidth={2}
                name="Rainfall (mm)"
              />
            </LineChart>
          </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}