import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Loader2, Sprout } from "lucide-react"

const cropDataSchema = z.object({
  cropType: z.string().min(1, "Please select a crop type"),
  variety: z.string().min(1, "Please enter crop variety"),
  plantingArea: z.string().min(1, "Please enter planting area"),
  soilType: z.string().min(1, "Please select soil type"),
  soilPH: z.string().min(1, "Please enter soil pH level"),
  nitrogen: z.string().min(1, "Please enter nitrogen content"),
  phosphorus: z.string().min(1, "Please enter phosphorus content"),
  potassium: z.string().min(1, "Please enter potassium content"),
  rainfall: z.string().min(1, "Please enter expected rainfall"),
  temperature: z.string().min(1, "Please enter average temperature"),
  humidity: z.string().min(1, "Please enter humidity level"),
  sunlight: z.string().min(1, "Please enter sunlight hours"),
  irrigationType: z.string().min(1, "Please select irrigation type"),
  fertilizer: z.string().optional(),
  pesticides: z.string().optional(),
  notes: z.string().optional(),
})

type CropData = z.infer<typeof cropDataSchema>

interface CropInputFormProps {
  onSubmit: (data: CropData) => void
  loading?: boolean
}

export function CropInputForm({ onSubmit, loading = false }: CropInputFormProps) {
  const form = useForm<CropData>({
    resolver: zodResolver(cropDataSchema),
    defaultValues: {
      cropType: "",
      variety: "",
      plantingArea: "",
      soilType: "",
      soilPH: "",
      nitrogen: "",
      phosphorus: "",
      potassium: "",
      rainfall: "",
      temperature: "",
      humidity: "",
      sunlight: "",
      irrigationType: "",
      fertilizer: "",
      pesticides: "",
      notes: "",
    },
  })

  const handleSubmit = (data: CropData) => {
    console.log("Form submitted with data:", data)
    onSubmit(data)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Sprout className="h-6 w-6 text-primary" />
          <CardTitle>Crop Data Input</CardTitle>
        </div>
        <CardDescription>
          Enter your crop and field data for yield prediction analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Crop Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Crop Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cropType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crop Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-crop-type">
                            <SelectValue placeholder="Select crop type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="wheat">Wheat</SelectItem>
                          <SelectItem value="rice">Rice</SelectItem>
                          <SelectItem value="corn">Corn</SelectItem>
                          <SelectItem value="soybean">Soybean</SelectItem>
                          <SelectItem value="cotton">Cotton</SelectItem>
                          <SelectItem value="tomato">Tomato</SelectItem>
                          <SelectItem value="potato">Potato</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="variety"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variety</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter crop variety" {...field} data-testid="input-variety" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="plantingArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Planting Area (hectares)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter area in hectares" {...field} data-testid="input-area" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Soil Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Soil Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="soilType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Soil Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-soil-type">
                            <SelectValue placeholder="Select soil type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="clay">Clay</SelectItem>
                          <SelectItem value="sandy">Sandy</SelectItem>
                          <SelectItem value="loamy">Loamy</SelectItem>
                          <SelectItem value="silt">Silt</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="soilPH"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Soil pH Level</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="6.5" {...field} data-testid="input-ph" />
                      </FormControl>
                      <FormDescription>Optimal range: 6.0 - 7.5</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="nitrogen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nitrogen Content (kg/ha)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="120" {...field} data-testid="input-nitrogen" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phosphorus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phosphorus Content (kg/ha)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="80" {...field} data-testid="input-phosphorus" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="potassium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Potassium Content (kg/ha)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="100" {...field} data-testid="input-potassium" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Weather Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Weather Conditions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="rainfall"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Rainfall (mm)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="500" {...field} data-testid="input-rainfall" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average Temperature (°C)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="25" {...field} data-testid="input-temperature" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="humidity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Humidity (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="65" {...field} data-testid="input-humidity" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sunlight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Sunlight Hours</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="8" {...field} data-testid="input-sunlight" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Farming Practices */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Farming Practices</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="irrigationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Irrigation Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-irrigation">
                            <SelectValue placeholder="Select irrigation type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="drip">Drip Irrigation</SelectItem>
                          <SelectItem value="sprinkler">Sprinkler System</SelectItem>
                          <SelectItem value="flood">Flood Irrigation</SelectItem>
                          <SelectItem value="rainfed">Rain-fed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fertilizer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fertilizer Type (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="NPK 20-20-20" {...field} data-testid="input-fertilizer" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="pesticides"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pesticide Usage (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Describe pesticide treatments" {...field} data-testid="input-pesticides" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional information about your farming practices or field conditions"
                        {...field} 
                        data-testid="textarea-notes"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              data-testid="button-submit-crop-data"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Yield Prediction
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}