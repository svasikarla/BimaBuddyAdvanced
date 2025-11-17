

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
import { CheckCircle2, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

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

  // Validation functions
  const isAgeValid = (age: string) => {
    const ageNum = parseInt(age)
    return age !== "" && !isNaN(ageNum) && ageNum >= 18 && ageNum <= 100
  }

  const isStep1Valid = () => {
    return isAgeValid(formData.age) && formData.location !== ""
  }

  const isStep2Valid = () => {
    return formData.familySize !== ""
  }

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      toast.success(`Step ${currentStep} completed!`, {
        description: "Moving to the next step..."
      })
    } else {
      toast.promise(
        new Promise((resolve) => {
          setTimeout(() => {
            setShowResults(true)
            resolve(true)
          }, 500)
        }),
        {
          loading: 'Finding your perfect plans...',
          success: 'Plans found! Analyzing recommendations...',
          error: 'Something went wrong'
        }
      )
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
                <div className="space-y-4">
                  <CardTitle className="text-xl font-bold text-gray-800">Step {currentStep} of 3</CardTitle>

                  {/* Animated Step Progress */}
                  <div className="flex items-center justify-between">
                    {[1, 2, 3].map((stepNumber) => (
                      <div key={stepNumber} className="flex items-center flex-1">
                        <motion.div
                          initial={false}
                          animate={{
                            backgroundColor: stepNumber < currentStep ? "#10B981" :
                                            stepNumber === currentStep ? "#3B82F6" : "#E5E7EB",
                            scale: stepNumber === currentStep ? 1.1 : 1
                          }}
                          transition={{ duration: 0.3 }}
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-lg relative z-10"
                        >
                          {stepNumber < currentStep ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 200 }}
                            >
                              <CheckCircle2 className="h-6 w-6" />
                            </motion.div>
                          ) : (
                            stepNumber
                          )}
                        </motion.div>
                        {stepNumber < 3 && (
                          <div className="flex-1 h-1 mx-2">
                            <motion.div
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: stepNumber < currentStep ? 1 : 0 }}
                              transition={{ duration: 0.3 }}
                              className="h-full bg-green-500 origin-left"
                            />
                            {stepNumber >= currentStep && (
                              <div className="h-full bg-gray-200 -mt-1" />
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <CardDescription className="text-base font-medium text-gray-600">
                    {currentStep === 1 && "Tell us about yourself"}
                    {currentStep === 2 && "Family and health information"}
                    {currentStep === 3 && "Coverage preferences"}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <form>
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="age" className="text-gray-700 font-medium">Age</Label>
                          <div className="relative">
                            <Input
                              id="age"
                              type="number"
                              placeholder="Enter your age"
                              value={formData.age}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("age", e.target.value)}
                              className={`border-2 rounded-lg px-4 py-2 pr-10 transition-all ${
                                formData.age === ""
                                  ? "border-gray-300 focus:border-blue-500"
                                  : isAgeValid(formData.age)
                                  ? "border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                                  : "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                              }`}
                            />
                            {formData.age && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                              >
                                {isAgeValid(formData.age) ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                  <AlertCircle className="h-5 w-5 text-red-500" />
                                )}
                              </motion.div>
                            )}
                          </div>
                          {formData.age && !isAgeValid(formData.age) && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xs text-red-600 mt-1"
                            >
                              Please enter an age between 18 and 100
                            </motion.p>
                          )}
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
                      disabled={
                        (currentStep === 1 && !isStep1Valid()) ||
                        (currentStep === 2 && !isStep2Valid())
                      }
                      className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
