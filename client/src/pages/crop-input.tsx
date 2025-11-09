import { useState } from "react"
import { CropInputForm } from "@/components/crop-input-form"
import { PredictionResults } from "@/components/prediction-results"
import { useMutation } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"

export default function CropInput() {
  const [prediction, setPrediction] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const { toast } = useToast()

  const predictionMutation = useMutation({
    mutationFn: async (formData: any) => {
      console.log("Submitting crop data to API:", formData)
      
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cropFieldData: formData,
          weatherData: {
            rainfall: formData.rainfall,
            temperature: formData.temperature,
            humidity: formData.humidity,
            sunlight: formData.sunlight,
          }
        }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate prediction')
      }
      
      const result = await response.json()
      return result.data
    },
    onSuccess: (data) => {
      console.log('Prediction successful:', data)
      
      // Format data for the PredictionResults component
      const formattedPrediction = {
        cropType: data.cropField?.cropType || data.cropType,
        predictedYield: data.predictedYield,
        confidence: data.confidence,
        yieldRange: { 
          min: data.yieldRangeMin, 
          max: data.yieldRangeMax 
        },
        factors: data.factors || [],
        recommendations: data.recommendations || [],
        marketPrice: data.marketPrice,
        estimatedRevenue: data.estimatedRevenue
      }
      
      setPrediction(formattedPrediction)
      toast({
        title: "Prediction Generated",
        description: `Yield prediction completed with ${data.confidence}% confidence`,
      })
    },
    onError: (error) => {
      console.error('Prediction failed:', error)
      toast({
        variant: "destructive",
        title: "Prediction Failed",
        description: error.message || "Failed to generate crop yield prediction",
      })
    }
  })

  const handleFormSubmit = (data: any) => {
    predictionMutation.mutate(data)
  }

  return (
    <div className="space-y-6">
      <CropInputForm onSubmit={handleFormSubmit} loading={predictionMutation.isPending} />
      
      {predictionMutation.isPending && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Processing your data with ML models...</span>
          </div>
        </div>
      )}
      
      {prediction && <PredictionResults data={prediction} />}
    </div>
  )
}