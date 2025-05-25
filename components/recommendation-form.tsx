

"use client"

import { useState } from "react"
import { useLanguage } from "./language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { PlanRecommendation } from "./plan-recommendation"

type FormData = {
  age: string
  gender: string
  location: string
  familySize: string
  preExistingConditions: boolean
  budget: number
  coverageAmount: string
}

const initialFormData: FormData = {
  age: "",
  gender: "male",
  location: "",
  familySize: "1",
  preExistingConditions: false,
  budget: 10000,
  coverageAmount: "5",
}

export function RecommendationForm() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [currentStep, setCurrentStep] = useState(1)
  const [showResults, setShowResults] = useState(false)

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setCurrentStep(1)
    setShowResults(false)
  }

  if (showResults) {
    return <PlanRecommendation formData={formData} onReset={resetForm} />
  }

  return (
    <section id="recommendation-form" className="w-full py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="container px-4 md:px-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          <div className="flex flex-col items-center justify-center space-y-6 text-center p-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="space-y-3 max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Find Your Best Plan</h2>
              <p className="text-blue-100 md:text-xl/relaxed lg:text-lg/relaxed xl:text-xl/relaxed">
                Answer a few questions to get a personalized health insurance recommendation
              </p>
            </div>
          </div>

          <div className="mx-auto -mt-10 max-w-3xl px-6 pb-10">
            <Card className="shadow-2xl border-0">
              <CardHeader className="p-6 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold text-gray-800">Step {currentStep} of 3</CardTitle>
                  <div className="flex space-x-3">
                    <span className={`h-3 w-16 rounded-full transition-all duration-300 ${currentStep >= 1 ? "bg-blue-600" : "bg-gray-200"}`}></span>
                    <span className={`h-3 w-16 rounded-full transition-all duration-300 ${currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></span>
                    <span className={`h-3 w-16 rounded-full transition-all duration-300 ${currentStep >= 3 ? "bg-blue-600" : "bg-gray-200"}`}></span>
                  </div>
                </div>
                <CardDescription className="text-base mt-2 font-medium text-gray-600">
                  {currentStep === 1 && "Tell us about yourself"}
                  {currentStep === 2 && "Family and health information"}
                  {currentStep === 3 && "Coverage preferences"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <form>
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="age" className="text-gray-700 font-medium">Age</Label>
                          <Input
                            id="age"
                            placeholder="Enter your age"
                            value={formData.age}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("age", e.target.value)}
                            className="border-2 border-gray-300 focus:border-blue-500 rounded-lg px-4 py-2 transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-700 font-medium">Gender</Label>
                          <RadioGroup
                            value={formData.gender}
                            onValueChange={(value) => handleInputChange("gender", value)}
                            className="flex space-x-4 mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="male" id="male" />
                              <Label htmlFor="male">Male</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="female" id="female" />
                              <Label htmlFor="female">Female</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="other" id="other" />
                              <Label htmlFor="other">Other</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-gray-700 font-medium">Location</Label>
                        <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                          <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 rounded-lg py-2 transition-colors">
                            <SelectValue placeholder="Select your city" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="delhi">Delhi</SelectItem>
                            <SelectItem value="mumbai">Mumbai</SelectItem>
                            <SelectItem value="bangalore">Bangalore</SelectItem>
                            <SelectItem value="hyderabad">Hyderabad</SelectItem>
                            <SelectItem value="chennai">Chennai</SelectItem>
                            <SelectItem value="kolkata">Kolkata</SelectItem>
                            <SelectItem value="pune">Pune</SelectItem>
                            <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="familySize" className="text-gray-700 font-medium">Family Size</Label>
                        <Select
                          value={formData.familySize}
                          onValueChange={(value) => handleInputChange("familySize", value)}
                        >
                          <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 rounded-lg py-2 transition-colors">
                            <SelectValue placeholder="Select family size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Just me</SelectItem>
                            <SelectItem value="2">Me + Spouse</SelectItem>
                            <SelectItem value="3">Me + Spouse + 1 Child</SelectItem>
                            <SelectItem value="4">Me + Spouse + 2 Children</SelectItem>
                            <SelectItem value="5+">5 or more members</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg mt-4">
                        <Switch
                          id="preExistingConditions"
                          checked={formData.preExistingConditions}
                          onCheckedChange={(checked) => handleInputChange("preExistingConditions", checked)}
                          className="data-[state=checked]:bg-blue-600"
                        />
                        <Label htmlFor="preExistingConditions" className="text-gray-700 font-medium">
                          Do you or any family member have pre-existing medical conditions?
                        </Label>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-3 p-5 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <Label className="text-gray-700 font-medium text-lg">Annual Budget (₹)</Label>
                          <span className="font-bold text-blue-600 text-xl">₹{formData.budget.toLocaleString()}</span>
                        </div>
                        <div className="mt-8 mb-2 relative">
                          {/* Tick marks for the slider */}
                          <div className="absolute w-full flex justify-between px-3 -mt-2">
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((tick) => (
                              <div key={tick} className="h-3 w-0.5 bg-gray-300"></div>
                            ))}
                          </div>
                          <Slider
                            value={[formData.budget]}
                            min={5000}
                            max={50000}
                            step={1000}
                            onValueChange={(value) => handleInputChange("budget", value[0])}
                            className="py-6 relative z-0"
                          />
                        </div>
                        <style jsx global>{`
                          .py-6 [role="slider"] {
                            background-color: #1e40af; /* Darker blue */
                            border: 2px solid white;
                            width: 28px;
                            height: 28px;
                            border-radius: 50%;
                            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
                            position: relative;
                          }
                          .py-6 [role="slider"]:after {
                            content: '';
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 6px;
                            height: 6px;
                            background-color: white;
                            border-radius: 50%;
                          }
                          [data-orientation="horizontal"] {
                            height: 10px;
                            background-color: #e5e7eb;
                            border-radius: 9999px;
                          }
                          [data-orientation="horizontal"] [data-orientation="horizontal"] {
                            background-color: #3b82f6;
                            height: 100%;
                          }
                        `}</style>
                        <div className="flex justify-between text-sm text-gray-600 font-medium">
                          <span>₹5,000</span>
                          <span>₹50,000</span>
                        </div>
                      </div>

                      <div className="space-y-2 mt-6">
                        <Label htmlFor="coverageAmount" className="text-gray-700 font-medium">Desired Coverage Amount</Label>
                        <Select
                          value={formData.coverageAmount}
                          onValueChange={(value) => handleInputChange("coverageAmount", value)}
                        >
                          <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 rounded-lg py-2 transition-colors">
                            <SelectValue placeholder="Select coverage amount" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">₹3 Lakhs</SelectItem>
                            <SelectItem value="5">₹5 Lakhs</SelectItem>
                            <SelectItem value="10">₹10 Lakhs</SelectItem>
                            <SelectItem value="15">₹15 Lakhs</SelectItem>
                            <SelectItem value="25">₹25 Lakhs</SelectItem>
                            <SelectItem value="50">₹50 Lakhs</SelectItem>
                            <SelectItem value="100">₹1 Crore</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex justify-between items-center">
                    {currentStep > 1 ? (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handlePrevStep}
                        className="px-6 py-2 border-2 border-gray-300 hover:bg-gray-100 transition-colors"
                      >
                        <span className="mr-2">←</span> Previous
                      </Button>
                    ) : (
                      <div></div>
                    )}
                    <Button 
                      type="button" 
                      onClick={handleNextStep}
                      className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-md"
                    >
                      {currentStep < 3 ? (
                        <>
                          Next <span className="ml-2">→</span>
                        </>
                      ) : (
                        "Get Recommendations"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
