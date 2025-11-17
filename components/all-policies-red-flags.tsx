"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, AlertTriangle, Info, FileX } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { supabase } from "@/lib/supabase"
import { getPolicyFeatures } from "@/lib/supabase"
import { PolicyCardSkeleton } from "@/components/ui/skeleton-loader"
import { EmptyState } from "@/components/ui/empty-state"
import { motion } from "framer-motion"
import { useScrollAnimation, fadeInUp } from "@/hooks/use-scroll-animation"

type InsurancePlan = {
  policy_id: string
  company_name: string
  policy_name: string
  claim_settlement_ratio: number
  network_hospitals_count: number
  annual_premium: number
  co_payment: number
  pre_hospitalization_days: number
  post_hospitalization_days: number
  total_score: number
}

type PolicyFeature = {
  id: string
  policy_id: string
  feature_type: string
  description: string
  is_optional: boolean
  included: boolean
}

export function AllPoliciesRedFlags() {
  const [allPolicies, setAllPolicies] = useState<InsurancePlan[]>([])
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>("")
  const [selectedPolicyRedFlags, setSelectedPolicyRedFlags] = useState<any>({})
  const [loading, setLoading] = useState(true)

  // Fetch all policies when component mounts
  useEffect(() => {
    async function fetchAllPolicies() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('insurance_policy_score_vw')
          .select(`
            policy_id,
            company_name,
            policy_name,
            claim_settlement_ratio,
            network_hospitals_count,
            annual_premium,
            co_payment,
            pre_hospitalization_days,
            post_hospitalization_days,
            total_score,
            type_of_plan
          `)
          .order('company_name', { ascending: true })
          .order('policy_name', { ascending: true });
          
        if (error) {
          console.error("Error fetching all policies:", error);
          setLoading(false);
          return;
        }
        
        if (data?.length) {
          setAllPolicies(data);
          // Set the first policy as default selected
          if (data.length > 0) {
            setSelectedPolicyId(data[0].policy_id);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Unexpected error in fetchAllPolicies", err);
        setLoading(false);
      }
    }
    
    fetchAllPolicies();
  }, [])
  
  // Fetch red flags when selected policy changes
  useEffect(() => {
    if (selectedPolicyId) {
      fetchPolicyRedFlags(selectedPolicyId);
    }
  }, [selectedPolicyId]);
  
  // Function to fetch red flags for a specific policy
  const fetchPolicyRedFlags = async (policyId: string) => {
    if (!policyId) return;
    
    try {
      setLoading(true);
      
      // Fetch policy features
      const features = await getPolicyFeatures(policyId);
      
      // Get the policy details
      const policy = allPolicies.find(p => p.policy_id === policyId);
      
      if (!policy) {
        console.error("Selected policy not found");
        setLoading(false);
        return;
      }
      
      // Transform policy data to the format expected by RedFlagHighlights
      const policyData = transformPolicyToRedFlagFormat(policy, features);
      setSelectedPolicyRedFlags(policyData);
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching policy red flags:", err);
      setLoading(false);
    }
  };
  
  // Function to transform policy data to the format expected by RedFlagHighlights
  const transformPolicyToRedFlagFormat = (policy: InsurancePlan, features: PolicyFeature[]) => {
    // Transform key features into policy clauses
    type PolicyClause = {
      id: string;
      title: string;
      category: string;
      description: string;
      isRedFlag: boolean;
      implication: string;
    }
    
    const clauses: PolicyClause[] = [];
    
    // Map features to clauses with appropriate categories and red flags
    if (features && Array.isArray(features)) {
      features.forEach((feature, index) => {
        // Determine clause category and details based on feature text
        let category = "coverage";
        let isRedFlag = false;
        let description = feature.description;
        let implication = "";
        
        // Analyze feature text to categorize and determine if it's a red flag
        const featureText = feature.description.toLowerCase();
        
        // Red flag indicators - terms that typically indicate limitations or restrictions
        const redFlagTerms = [
          "pre-existing", "waiting period", "wait", "exclusion", "excluded", "not covered", 
          "co-payment", "copay", "co pay", "limit", "cap", "maximum", "sublimit", "sub-limit",
          "restricted", "restriction", "only up to", "only for", "not eligible", "not applicable",
          "conditions apply", "subject to", "excluding", "except", "unless", "deductible"
        ];
        
        // Check if feature contains any red flag terms
        const hasRedFlagTerm = redFlagTerms.some(term => featureText.includes(term));
        
        // Check if feature is explicitly marked as optional
        const isOptionalFeature = feature.is_optional === true;
        
        // Set isRedFlag to true if any red flag condition is met
        isRedFlag = hasRedFlagTerm || isOptionalFeature;
        
        // Now categorize and set implications based on feature content
        if (featureText.includes("pre-existing")) {
          category = "coverage";
          isRedFlag = true;
          description = featureText.includes("after") ? feature.description : `${feature.description} after waiting period`;
          implication = "You'll need to wait before pre-existing conditions are covered.";
        } else if (featureText.includes("day care")) {
          category = "treatment";
          implication = "Minor procedures that don't require 24-hour hospitalization are covered.";
        } else if (featureText.includes("hospitalization")) {
          category = "hospitalization";
          implication = "Your hospital stay expenses will be covered as per policy terms.";
          
          // Check for hospitalization restrictions
          if (featureText.includes("limit") || featureText.includes("cap") || featureText.includes("maximum") || 
              featureText.includes("only") || featureText.includes("up to")) {
            isRedFlag = true;
            implication = "There are limits on hospitalization coverage that could lead to out-of-pocket expenses.";
          }
        } else if (featureText.includes("check-up")) {
          category = "bonus";
          implication = "You can get preventive health check-ups at no additional cost.";
          
          // Check for limitations on check-ups
          if (featureText.includes("limit") || featureText.includes("once") || 
              featureText.includes("per year") || featureText.includes("up to")) {
            isRedFlag = true;
            implication = "Health check-ups are limited in frequency or coverage.";
          }
        } else if (featureText.includes("bonus")) {
          category = "bonus";
          implication = "Your coverage amount increases if you don't make claims.";
          
          // Check for limitations on bonus
          if (featureText.includes("limit") || featureText.includes("cap") || 
              featureText.includes("maximum") || featureText.includes("up to")) {
            isRedFlag = true;
            implication = "There are limits on how much bonus you can accumulate.";
          }
        } else if (featureText.includes("ambulance")) {
          category = "transportation";
          implication = "Emergency ambulance charges will be covered up to a certain limit.";
          
          // Ambulance coverage is often limited
          if (featureText.includes("limit") || featureText.includes("up to") || 
              featureText.includes("maximum") || featureText.includes("per")) {
            isRedFlag = true;
            implication = "Ambulance charges are only covered up to a certain limit.";
          }
        } else if (featureText.includes("co-payment") || featureText.includes("copay") || featureText.includes("co pay")) {
          category = "payment";
          isRedFlag = true;
          implication = "You'll need to pay a percentage of the claim amount from your pocket.";
        } else if (featureText.includes("room")) {
          category = "hospitalization";
          
          // Room rent is often capped
          if (featureText.includes("limit") || featureText.includes("cap") || 
              featureText.includes("up to") || featureText.includes("percent") || 
              featureText.includes("%") || featureText.includes("category")) {
            isRedFlag = true;
            implication = "If you choose a higher category room, you'll need to pay the difference.";
          }
        } else if (featureText.includes("critical")) {
          category = "treatment";
          implication = "Specified critical illnesses are covered under this policy.";
          
          // Check for limitations on critical illness coverage
          if (featureText.includes("limit") || featureText.includes("only") || 
              featureText.includes("specific") || featureText.includes("listed")) {
            isRedFlag = true;
            implication = "Only specific critical illnesses are covered, others may not be.";
          }
        } else if (featureText.includes("maternity")) {
          category = "treatment";
          implication = "Expenses related to childbirth and maternity care are covered.";
          
          // Maternity often has waiting periods
          if (featureText.includes("wait") || featureText.includes("after") || 
              featureText.includes("month") || featureText.includes("year")) {
            isRedFlag = true;
            implication = "Maternity benefits are only available after a waiting period.";
          }
        } else if (featureText.includes("exclusion") || featureText.includes("not covered") || featureText.includes("excluded")) {
          category = "coverage";
          isRedFlag = true;
          implication = "These conditions or treatments are not covered by the policy.";
        } else if (featureText.includes("waiting period") || featureText.includes("wait")) {
          category = "coverage";
          isRedFlag = true;
          implication = "You'll need to wait before these conditions are covered.";
        } else if (featureText.includes("limit") || featureText.includes("cap") || featureText.includes("maximum")) {
          category = "coverage";
          isRedFlag = true;
          implication = "There's a limit on how much the insurer will pay for these expenses.";
        } else if (featureText.includes("ayush") || featureText.includes("alternative")) {
          category = "treatment";
          
          // Check for limitations on alternative treatments
          if (featureText.includes("limit") || featureText.includes("up to") || 
              featureText.includes("only") || featureText.includes("cap")) {
            isRedFlag = true;
            implication = "Alternative treatments are covered only up to a certain limit.";
          }
        } else if (featureText.includes("restore") || featureText.includes("recharge")) {
          category = "coverage";
          implication = "Your sum insured can be restored if exhausted during the policy year.";
          
          // Check for limitations on restore benefit
          if (featureText.includes("once") || featureText.includes("only") || 
              featureText.includes("different") || featureText.includes("not same")) {
            isRedFlag = true;
            implication = "Sum insured restoration has limitations on usage.";
          }
        } else if (featureText.includes("organ donor") || featureText.includes("transplant")) {
          category = "treatment";
          
          // Check for limitations on organ donor expenses
          if (featureText.includes("only") || featureText.includes("limit") || 
              featureText.includes("up to") || featureText.includes("exclude")) {
            isRedFlag = true;
            implication = "Organ donor expenses are covered with limitations.";
          }
        }
        
        // Create the clause object
        clauses.push({
          id: (index + 1).toString(),
          title: feature.feature_type || feature.description.substring(0, 30),
          description: description,
          implication: implication || "This feature affects your coverage as described.",
          category: category,
          isRedFlag: isRedFlag,
        });
      });
    }
    
    // Add standard clauses based on policy data
    if (policy.co_payment > 0) {
      clauses.push({
        id: (clauses.length + 1).toString(),
        title: "Co-payment",
        description: `${policy.co_payment}% co-payment required`,
        implication: `You'll need to pay ${policy.co_payment}% of the claim amount from your pocket.`,
        category: "payment",
        isRedFlag: true,
      });
    }
    
    if (policy.pre_hospitalization_days < 60) {
      clauses.push({
        id: (clauses.length + 1).toString(),
        title: "Pre-hospitalization Coverage",
        description: `Only ${policy.pre_hospitalization_days} days of pre-hospitalization expenses covered`,
        implication: "Medical expenses incurred before hospitalization are covered only for a limited period.",
        category: "coverage",
        isRedFlag: true,
      });
    }
    
    if (policy.post_hospitalization_days < 90) {
      clauses.push({
        id: (clauses.length + 1).toString(),
        title: "Post-hospitalization Coverage",
        description: `Only ${policy.post_hospitalization_days} days of post-hospitalization expenses covered`,
        implication: "Medical expenses incurred after discharge are covered only for a limited period.",
        category: "coverage",
        isRedFlag: true,
      });
    }
    
    // Add standard red flags that are common in health insurance
    const standardRedFlags = [
      {
        title: "Disease-wise Sublimits",
        description: "Policy may have sublimits for specific diseases or procedures",
        implication: "For certain treatments, the insurer will only pay up to a fixed amount, regardless of your sum insured.",
        category: "coverage",
        isRedFlag: true,
      },
      {
        title: "Proportionate Deductions",
        description: "Higher room category selection may lead to proportionate deductions on all associated medical expenses",
        implication: "If you choose a room above your eligibility, all related expenses (doctor fees, surgery, etc.) will be reduced proportionately.",
        category: "hospitalization",
        isRedFlag: true,
      },
      {
        title: "Initial Waiting Period",
        description: "30-day initial waiting period for all illnesses except accidents",
        implication: "Any illness requiring hospitalization in the first 30 days of the policy will not be covered.",
        category: "coverage",
        isRedFlag: true,
      }
    ];
    
    // Add standard red flags only if they don't already exist in clauses
    standardRedFlags.forEach((redFlag, index) => {
      // Check if a similar red flag already exists
      const exists = clauses.some(clause => 
        clause.title.toLowerCase().includes(redFlag.title.toLowerCase()) || 
        clause.description.toLowerCase().includes(redFlag.description.toLowerCase())
      );
      
      if (!exists) {
        clauses.push({
          id: (clauses.length + index + 1).toString(),
          ...redFlag
        });
      }
    });
    
    return {
      policyName: policy.policy_name,
      provider: policy.company_name,
      premium: `₹${policy.annual_premium.toLocaleString('en-IN')}/year`,
      sumInsured: "₹5,00,000", // This is a placeholder as the actual sum insured isn't in the data
      clauses: clauses,
    };
  };

  return (
    <div className="container px-4 md:px-6 py-8">
      <Card className="w-full max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle>Insurance Policy Red Flags</CardTitle>
          <CardDescription>
            Select an insurance policy to view its potential red flags
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label htmlFor="policy-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Insurance Policy
            </label>
            <select
              id="policy-select"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              value={selectedPolicyId}
              onChange={(e) => setSelectedPolicyId(e.target.value)}
              disabled={loading}
            >
              {allPolicies.map((policy) => (
                <option key={policy.policy_id} value={policy.policy_id}>
                  {policy.company_name} - {policy.policy_name}
                </option>
              ))}
            </select>
          </div>
          
          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              <PolicyCardSkeleton />
              <PolicyCardSkeleton />
              <PolicyCardSkeleton />
              <PolicyCardSkeleton />
            </div>
          ) : (
            Object.keys(selectedPolicyRedFlags).length > 0 ? (
              <CustomRedFlagHighlights policyData={selectedPolicyRedFlags} />
            ) : (
              <EmptyState
                icon={FileX}
                title="No Policy Data Available"
                description="We couldn't find any red flags for this policy. Try selecting a different policy from the list above."
                actionLabel="Refresh"
                onAction={() => window.location.reload()}
              />
            )
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Custom component to display red flags with rearranged cards
function CustomRedFlagHighlights({ policyData }: { policyData: any }) {
  const redFlags = policyData.clauses.filter((clause: any) => clause.isRedFlag);

  // Group red flags by category
  const groupedRedFlags: Record<string, any[]> = {};
  redFlags.forEach((flag: any) => {
    if (!groupedRedFlags[flag.category]) {
      groupedRedFlags[flag.category] = [];
    }
    groupedRedFlags[flag.category].push(flag);
  });

  // Category display names and icons with priority order
  const categoryInfo: Record<string, { name: string; icon: any; priority: number }> = {
    coverage: { name: "Coverage Limits", icon: AlertTriangle, priority: 1 },
    payment: { name: "Payment Terms", icon: AlertCircle, priority: 2 },
    hospitalization: { name: "Hospitalization", icon: AlertCircle, priority: 3 },
    treatment: { name: "Treatment Restrictions", icon: AlertTriangle, priority: 4 },
    transportation: { name: "Transportation", icon: Info, priority: 5 },
    bonus: { name: "Bonuses & Benefits", icon: Info, priority: 6 },
  };

  // Sort categories by priority
  const sortedCategories = Object.keys(groupedRedFlags).sort((a, b) => {
    const priorityA = categoryInfo[a]?.priority || 999;
    const priorityB = categoryInfo[b]?.priority || 999;
    return priorityA - priorityB;
  });

  return (
    <div className="space-y-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-red-800">Red Flag Alert</h3>
            <p className="text-red-700 mt-1">
              We've identified {redFlags.length} potential issues in this policy that could lead to unexpected
              out-of-pocket expenses or coverage gaps.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sortedCategories.map((category) => {
          const flags = groupedRedFlags[category];
          const { name, icon: Icon } = categoryInfo[category] || {
            name: category.charAt(0).toUpperCase() + category.slice(1),
            icon: AlertTriangle,
          };

          return (
            <Card key={category} className="border-red-200">
              <CardHeader className="bg-red-50">
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-red-500" />
                  {name} Issues
                </CardTitle>
                <CardDescription>
                  {flags.length} potential {flags.length === 1 ? "problem" : "problems"} identified
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Accordion type="multiple" defaultValue={flags.map((flag) => flag.id)} className="w-full">
                  {flags.map((flag, index) => (
                    <AccordionItem key={flag.id} value={flag.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                          <span>{flag.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pl-6">
                          <div>
                            <div className="font-medium">Policy states:</div>
                            <div className="text-gray-600">{flag.description}</div>
                          </div>
                          <div>
                            <div className="font-medium">What this means:</div>
                            <div className="text-red-600">{flag.implication}</div>
                          </div>
                          <div className="bg-amber-50 p-3 rounded-md">
                            <div className="font-medium flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                              <span>What to watch out for:</span>
                            </div>
                            <div className="text-gray-700 mt-1">
                              {flag.category === "hospitalization" &&
                                "Choose hospitals with room rates within the limit or be prepared to pay the difference."}
                              {flag.category === "coverage" &&
                                "Be aware of these coverage gaps when planning your healthcare."}
                              {flag.category === "payment" && "Budget for these additional out-of-pocket expenses."}
                              {flag.category === "treatment" &&
                                "Check if your expected treatments fall under these restrictions."}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How to Address These Red Flags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium">Ask for Clarification</h4>
                <p className="text-gray-600 mt-1">
                  Contact the insurance provider to get detailed explanations about these clauses and how they might
                  affect you.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium">Compare Alternatives</h4>
                <p className="text-gray-600 mt-1">
                  Check if other policies offer better terms for these specific clauses that are important to you.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium">Consider Add-ons</h4>
                <p className="text-gray-600 mt-1">
                  Some insurers offer add-on covers that can address these limitations for an additional premium.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium">Plan for Gaps</h4>
                <p className="text-gray-600 mt-1">
                  If you decide to proceed with this policy, create a financial plan to cover potential out-of-pocket
                  expenses.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
