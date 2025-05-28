import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  FileText, 
  Shield, 
  Cookie, 
  Users, 
  Sparkles, 
  Copy, 
  Download,
  Building2,
  Loader2,
  CheckCircle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { generatePolicy } from '@/lib/generatePolicy'

const policyTypes = [
  { value: 'privacy', label: 'Privacy Policy', icon: Shield, description: 'Data collection and usage policies' },
  { value: 'terms', label: 'Terms of Service', icon: FileText, description: 'User agreements and service terms' },
  { value: 'cookie', label: 'Cookie Policy', icon: Cookie, description: 'Cookie usage and tracking policies' },
  { value: 'refund', label: 'Refund Policy', icon: Users, description: 'Return and refund procedures' },
]

const industries = [
  'E-commerce/Retail',
  'SaaS/Technology',
  'Healthcare',
  'Education',
  'Financial Services',
  'Real Estate',
  'Food & Beverage',
  'Consulting',
  'Media/Entertainment',
  'Non-profit',
  'Other'
]

function App() {
  const [businessDescription, setBusinessDescription] = useState('')
  const [selectedPolicyType, setSelectedPolicyType] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPolicy, setGeneratedPolicy] = useState('')
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!businessDescription.trim() || !selectedPolicyType || !selectedIndustry) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before generating.",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    setGeneratedPolicy('')
    try {
      const policy = await generatePolicy({
        businessDescription,
        policyType: selectedPolicyType,
        industry: selectedIndustry
      })
      setGeneratedPolicy(policy)
      toast({
        title: "Policy Generated!",
        description: "Your legal policy has been successfully generated.",
      })
    } catch (e) {
      toast({
        title: "Error",
        description: e.message || 'Failed to generate policy',
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPolicy)
    toast({
      title: "Copied!",
      description: "Policy copied to clipboard.",
    })
  }

  const downloadPolicy = () => {
    const blob = new Blob([generatedPolicy], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedPolicyType}-policy.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: "Downloaded!",
      description: "Policy downloaded successfully.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AI Legal Policy Generator
              </h1>
              <p className="text-sm text-muted-foreground">Generate professional legal policies in minutes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Business Information
                </CardTitle>
                <CardDescription>
                  Tell us about your business to generate tailored legal policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Description *</label>
                  <Textarea
                    placeholder="Describe your business, services, target audience, and key operations. Be specific about what data you collect and how you use it..."
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    className="min-h-[120px] border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-xs text-muted-foreground">
                    {businessDescription.length}/500 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Industry *</label>
                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                    <SelectTrigger className="border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Policy Type *</label>
                  <div className="grid gap-3">
                    {policyTypes.map((type) => (
                      <motion.div
                        key={type.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all border-2 ${
                            selectedPolicyType === type.value 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                          onClick={() => setSelectedPolicyType(type.value)}
                        >
                          <CardContent className="flex items-start gap-3 p-4">
                            <type.icon className={`w-5 h-5 mt-0.5 ${
                              selectedPolicyType === type.value ? 'text-blue-600' : 'text-slate-500'
                            }`} />
                            <div className="flex-1">
                              <h4 className="font-medium">{type.label}</h4>
                              <p className="text-sm text-muted-foreground">{type.description}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Policy...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Policy
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    Generated Policy
                  </CardTitle>
                  {generatedPolicy && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="border-slate-200"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadPolicy}
                        className="border-slate-200"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
                {generatedPolicy && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Ready
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {policyTypes.find(p => p.value === selectedPolicyType)?.label}
                    </span>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {!generatedPolicy && !isGenerating && (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Fill in your business information and click "Generate Policy" to get started.</p>
                  </div>
                )}
                
                {isGenerating && (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-600" />
                    <p className="text-sm text-muted-foreground">
                      Our AI is crafting your personalized policy...
                    </p>
                  </div>
                )}

                {generatedPolicy && (
                  <ScrollArea className="h-[500px] w-full">
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono bg-slate-50 p-4 rounded-lg border">
                        {generatedPolicy}
                      </pre>
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default App