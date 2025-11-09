import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Database, Play, Pause, Settings, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { useState } from "react"

// todo: remove mock data - this is for design prototype only
const mockModels = [
  {
    id: 1,
    name: "Random Forest Regressor",
    type: "Ensemble",
    accuracy: 92.3,
    status: "active",
    lastTrained: "2024-01-15",
    predictions: 1247,
    features: ["Soil pH", "NPK levels", "Weather", "Crop variety"],
    trainingProgress: 100
  },
  {
    id: 2,
    name: "Neural Network",
    type: "Deep Learning",
    accuracy: 88.7,
    status: "training",
    lastTrained: "2024-01-14",
    predictions: 892,
    features: ["Soil conditions", "Weather patterns", "Historical yield"],
    trainingProgress: 73
  },
  {
    id: 3,
    name: "Linear Regression",
    type: "Linear",
    accuracy: 78.4,
    status: "inactive",
    lastTrained: "2024-01-10",
    predictions: 2156,
    features: ["Basic soil data", "Temperature", "Rainfall"],
    trainingProgress: 100
  },
  {
    id: 4,
    name: "Support Vector Machine",
    type: "SVM",
    accuracy: 82.1,
    status: "active",
    lastTrained: "2024-01-12",
    predictions: 1089,
    features: ["Multi-feature analysis", "Weather data", "Soil composition"],
    trainingProgress: 100
  }
]

export default function Models() {
  const [models, setModels] = useState(mockModels)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "training":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "inactive":
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
      default:
        return <Database className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">Active</Badge>
      case "training":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300">Training</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const handleStartTraining = (modelId: number) => {
    console.log("Starting training for model:", modelId)
    setModels(prev => prev.map(model => 
      model.id === modelId 
        ? { ...model, status: "training", trainingProgress: 0 }
        : model
    ))
    
    // Simulate training progress
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 20
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setModels(prev => prev.map(model => 
          model.id === modelId 
            ? { ...model, status: "active", trainingProgress: 100, accuracy: Math.random() * 10 + 85 }
            : model
        ))
      }
      setModels(prev => prev.map(model => 
        model.id === modelId 
          ? { ...model, trainingProgress: Math.min(progress, 100) }
          : model
      ))
    }, 1000)
  }

  const handleStopTraining = (modelId: number) => {
    console.log("Stopping training for model:", modelId)
    setModels(prev => prev.map(model => 
      model.id === modelId 
        ? { ...model, status: "inactive" }
        : model
    ))
  }

  const handleActivateModel = (modelId: number) => {
    console.log("Activating model:", modelId)
    setModels(prev => prev.map(model => 
      model.id === modelId 
        ? { ...model, status: "active" }
        : model
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-models-title">
            ML Model Training
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor your machine learning models
          </p>
        </div>
        <Button data-testid="button-new-model">
          <Database className="mr-2 h-4 w-4" />
          Create New Model
        </Button>
      </div>

      {/* Models Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold" data-testid="metric-total-models">4</p>
                <p className="text-sm text-muted-foreground">Total Models</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold" data-testid="metric-active-models">3</p>
                <p className="text-sm text-muted-foreground">Active Models</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold" data-testid="metric-training-models">1</p>
                <p className="text-sm text-muted-foreground">Training</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold" data-testid="metric-best-accuracy">92.3%</p>
                <p className="text-sm text-muted-foreground">Best Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Models List */}
      <div className="space-y-4">
        {models.map((model) => (
          <Card key={model.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {getStatusIcon(model.status)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold" data-testid={`model-name-${model.id}`}>
                        {model.name}
                      </h3>
                      {getStatusBadge(model.status)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <span>Type: {model.type}</span>
                      <span>Accuracy: {model.accuracy.toFixed(1)}%</span>
                      <span>Predictions: {model.predictions.toLocaleString()}</span>
                      <span>Last trained: {model.lastTrained}</span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Features:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {model.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {model.status === "training" && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Training Progress</span>
                          <span className="text-sm font-medium">{Math.round(model.trainingProgress)}%</span>
                        </div>
                        <Progress value={model.trainingProgress} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {model.status === "training" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStopTraining(model.id)}
                      data-testid={`button-stop-${model.id}`}
                    >
                      <Pause className="mr-2 h-4 w-4" />
                      Stop
                    </Button>
                  ) : model.status === "inactive" ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleActivateModel(model.id)}
                        data-testid={`button-activate-${model.id}`}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Activate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartTraining(model.id)}
                        data-testid={`button-train-${model.id}`}
                      >
                        <Database className="mr-2 h-4 w-4" />
                        Retrain
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartTraining(model.id)}
                      data-testid={`button-train-${model.id}`}
                    >
                      <Database className="mr-2 h-4 w-4" />
                      Retrain
                    </Button>
                  )}
                  <Button variant="outline" size="sm" data-testid={`button-settings-${model.id}`}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}