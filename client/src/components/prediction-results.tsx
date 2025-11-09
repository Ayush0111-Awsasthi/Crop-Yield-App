import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface PredictionData {
  cropType: string
  predictedYield: number
  confidence: number
  yieldRange: { min: number; max: number }
  factors: {
    name: string
    impact: "positive" | "negative" | "neutral"
    value: string
  }[]
  recommendations: string[]
  marketPrice?: number
  estimatedRevenue?: number
}

interface PredictionResultsProps {
  data: PredictionData
}

export function PredictionResults({ data }: PredictionResultsProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "text-green-600"
    if (confidence >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 85) return { variant: "default" as const, text: "High Confidence" }
    if (confidence >= 70) return { variant: "secondary" as const, text: "Medium Confidence" }
    return { variant: "destructive" as const, text: "Low Confidence" }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    }
  }

  const confidenceBadge = getConfidenceBadge(data.confidence)

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      {/* Main Prediction Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl" data-testid="text-prediction-title">
                {data.cropType} Yield Prediction
              </CardTitle>
              <CardDescription>
                Based on your field data and weather conditions
              </CardDescription>
            </div>
            <Badge variant={confidenceBadge.variant} data-testid="badge-confidence">
              {confidenceBadge.text}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Predicted Yield</h3>
              <p className="text-3xl font-bold" data-testid="text-predicted-yield">
                {data.predictedYield.toFixed(1)} tons/ha
              </p>
              <p className="text-sm text-muted-foreground">
                Range: {data.yieldRange.min.toFixed(1)} - {data.yieldRange.max.toFixed(1)} tons/ha
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Model Confidence</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-bold ${getConfidenceColor(data.confidence)}`}>
                    {data.confidence}%
                  </span>
                </div>
                <Progress value={data.confidence} className="h-2" />
              </div>
            </div>
            
            {data.estimatedRevenue && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Estimated Revenue</h3>
                <p className="text-3xl font-bold text-green-600" data-testid="text-revenue">
                  ${data.estimatedRevenue.toLocaleString()}
                </p>
                {data.marketPrice && (
                  <p className="text-sm text-muted-foreground">
                    @ ${data.marketPrice}/ton
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Factor Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Factor Analysis</CardTitle>
          <CardDescription>
            Key factors influencing your crop yield prediction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.factors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getImpactIcon(factor.impact)}
                  <span className="font-medium">{factor.name}</span>
                </div>
                <span className="text-sm text-muted-foreground" data-testid={`factor-${index}`}>
                  {factor.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>
            Actions to optimize your crop yield
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm" data-testid={`recommendation-${index}`}>
                  {recommendation}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}