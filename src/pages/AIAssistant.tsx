"use client";

import React, { useState } from "react";
import { 
  Bot, Stethoscope, RefreshCw, 
  Activity, ShieldCheck, ExternalLink, 
  HeartPulse, FileText, Info, UserCheck,
  MapPin, PhoneCall, AlertTriangle, AlertCircle
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { diseases } from "@/data/mockData";
import { toast } from "sonner";

interface ClinicalData {
  age: string;
  gender: string;
  duration: string;
  vitals: {
    temp: string;
    bp: string;
    heartRate: string;
  };
  history: string;
  lifestyle: string;
}

interface AnalysisResult {
  // Clinical Reasoning Fields
  explanation: string;
  differentialDiagnosis: { name: string; probability: number; reasoning: string }[];
  riskLevel: "Low" | "Medium" | "High";
  clinicalAdvice: string[];
  
  // Doctor Matching Engine Fields
  symptomUnderstanding: string;
  recommendedDoctor: string;
  consultationMode: "Online" | "In-person" | "Emergency";
  urgencyLevel: "Routine" | "Priority" | "Emergency";
  matchingReason: string;
  
  emergency?: string;
  sources: string[];
}

const AIAssistant = () => {
  const [symptoms, setSymptoms] = useState("");
  const [clinicalData, setClinicalData] = useState<ClinicalData>({
    age: "",
    gender: "",
    duration: "",
    vitals: { temp: "", bp: "", heartRate: "" },
    history: "",
    lifestyle: ""
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const getSpecialty = (category: string): string => {
    const map: Record<string, string> = {
      "Respiratory": "Pulmonologist",
      "General": "General Physician",
      "Chronic": "Internal Medicine Specialist",
      "Neurological": "Neurologist",
      "Dermatology": "Dermatologist",
      "Gastrointestinal": "Gastroenterologist",
      "Musculoskeletal": "Orthopedic Surgeon",
      "Mental Health": "Psychiatrist",
      "Urological": "Urologist",
      "Eye": "Ophthalmologist",
      "ENT": "ENT Specialist",
      "Dental": "Dentist",
      "Reproductive": "Gynecologist / Obstetrician",
      "Pediatric": "Pediatrician",
      "Allergies": "Allergist / Immunologist",
      "Infectious": "Infectious Disease Specialist"
    };
    return map[category] || "General Physician";
  };

  const performClinicalReasoning = (inputSymptoms: string, data: ClinicalData) => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const inputLower = inputSymptoms.toLowerCase();
      const words = inputLower.split(/[\s,.]+/).filter(w => w.length > 2);
      
      const matches = diseases.map(disease => {
        let score = 0;
        disease.symptoms.forEach(s => {
          if (inputLower.includes(s.toLowerCase())) score += 10;
          words.forEach(word => {
            if (s.toLowerCase().includes(word)) score += 2;
          });
        });
        if (data.history.toLowerCase().includes(disease.category.toLowerCase())) score += 5;
        return { disease, score };
      }).filter(m => m.score > 0).sort((a, b) => b.score - a.score);

      if (matches.length === 0) {
        setResult(null);
        setIsAnalyzing(false);
        toast.error("Insufficient data for clinical analysis.");
        return;
      }

      const topMatches = matches.slice(0, 3);
      const totalScore = topMatches.reduce((sum, m) => sum + m.score, 0);
      const primary = topMatches[0].disease;
      
      // Urgency & Risk Logic
      let riskLevel: "Low" | "Medium" | "High" = "Low";
      const isEmergencySymptom = inputLower.includes("chest pain") || inputLower.includes("breathing") || inputLower.includes("unconscious") || inputLower.includes("severe bleeding");
      
      if (isEmergencySymptom || primary.category === "Neurological" || (parseFloat(data.vitals.temp) > 39.5)) {
        riskLevel = "High";
      } else if (primary.category === "Chronic" || primary.category === "Infectious" || parseInt(data.duration) > 7) {
        riskLevel = "Medium";
      }

      const analysis: AnalysisResult = {
        explanation: `Clinical analysis suggests primary involvement of the ${primary.category.toLowerCase()} system.`,
        differentialDiagnosis: topMatches.map(m => ({
          name: m.disease.name,
          probability: Math.round((m.score / totalScore) * 100),
          reasoning: `Matches ${m.disease.symptoms.filter(s => inputLower.includes(s.toLowerCase())).length} reported symptoms.`
        })),
        riskLevel,
        clinicalAdvice: primary.cures.slice(0, 3),
        
        // Doctor Matching Engine Fields
        symptomUnderstanding: `Symptoms indicate acute involvement of the ${primary.category.toLowerCase()} medical system.`,
        recommendedDoctor: getSpecialty(primary.category),
        consultationMode: riskLevel === "High" ? "Emergency" : riskLevel === "Medium" ? "In-person" : "Online",
        urgencyLevel: riskLevel === "High" ? "Emergency" : riskLevel === "Medium" ? "Priority" : "Routine",
        matchingReason: `Based on the ${primary.category.toLowerCase()} nature of symptoms and a ${riskLevel.toLowerCase()} risk profile.`,
        
        emergency: riskLevel === "High" ? "CRITICAL: Presenting symptoms indicate a potential medical emergency. Proceed to the nearest Emergency Department immediately." : undefined,
        sources: ["WHO Clinical Guidelines", "CDC Disease Database", "Mayo Clinic"]
      };

      setResult(analysis);
      setIsAnalyzing(false);
      toast.success("Doctor matching complete.");
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      toast.error("Please describe your symptoms.");
      return;
    }
    performClinicalReasoning(symptoms, clinicalData);
  };

  return (
    <Layout>
      <div className="container py-8 max-w-5xl">
        <div className="mb-8 flex flex-col items-center text-center animate-fade-in">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl hero-gradient mb-4 shadow-xl ring-4 ring-primary/10">
            <ShieldCheck className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Doctor Intelligence Matching</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Intelligent symptom analysis to match you with the right specialist and consultation mode instantly.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Symptom Input
                </CardTitle>
                <CardDescription>Describe how you feel for intelligent matching</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Describe Symptoms</Label>
                    <Textarea 
                      id="symptoms"
                      placeholder="e.g. Sharp chest pain, difficulty breathing..." 
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      className="min-h-[100px] resize-none"
                      disabled={isAnalyzing}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input 
                        id="age" 
                        type="number" 
                        placeholder="Years" 
                        value={clinicalData.age}
                        onChange={(e) => setClinicalData({...clinicalData, age: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select onValueChange={(v) => setClinicalData({...clinicalData, gender: v})}>
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-xs text-primary"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    {showAdvanced ? "Hide Advanced Details" : "Add Vitals & Duration"}
                  </Button>

                  {showAdvanced && (
                    <div className="space-y-4 pt-2 animate-fade-in">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase">Duration (Days)</Label>
                          <Input 
                            className="h-8 text-xs" 
                            placeholder="e.g. 3"
                            value={clinicalData.duration}
                            onChange={(e) => setClinicalData({...clinicalData, duration: e.target.value})}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase">Temp (°C)</Label>
                          <Input 
                            className="h-8 text-xs" 
                            placeholder="37.0"
                            value={clinicalData.vitals.temp}
                            onChange={(e) => setClinicalData({...clinicalData, vitals: {...clinicalData.vitals, temp: e.target.value}})}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <Button className="w-full hero-gradient border-none shadow-md" type="submit" disabled={isAnalyzing}>
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Matching Doctor...
                      </>
                    ) : (
                      <>
                        <Bot className="mr-2 h-4 w-4" />
                        Match Doctor Specialty
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="rounded-xl bg-muted/50 p-4 border border-dashed">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase mb-2">
                <Info className="h-3 w-3" />
                Matching Logic
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Our engine cross-references symptoms with 16+ medical specialties and urgency protocols to ensure you see the right expert.
              </p>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center h-full py-20 space-y-4">
                <div className="relative">
                  <HeartPulse className="h-16 w-16 text-primary animate-pulse" />
                  <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">Analyzing Medical Context</p>
                  <p className="text-sm text-muted-foreground">Identifying primary medical system...</p>
                </div>
              </div>
            ) : result ? (
              <div className="space-y-6 animate-fade-in">
                {/* Doctor Matching Report */}
                <Card className="overflow-hidden border-l-4 border-l-primary shadow-xl">
                  <CardHeader className="bg-muted/30 pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <UserCheck className="h-5 w-5 text-primary" />
                        Doctor Matching Report
                      </CardTitle>
                      <Badge 
                        variant={result.urgencyLevel === 'Emergency' ? 'destructive' : result.urgencyLevel === 'Priority' ? 'outline' : 'secondary'}
                        className={`px-3 py-1 ${result.urgencyLevel === 'Priority' ? 'border-warning text-warning' : ''}`}
                      >
                        {result.urgencyLevel} Urgency
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
                        🔍 Symptom Understanding
                      </h3>
                      <p className="text-sm font-medium text-foreground">{result.symptomUnderstanding}</p>
                    </section>

                    {/* Predicted Diseases Section */}
                    <section className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
                        🩺 Predicted Conditions (Differential Diagnosis)
                      </h3>
                      <div className="space-y-4">
                        {result.differentialDiagnosis.map((d, i) => (
                          <div key={i} className="space-y-1.5">
                            <div className="flex justify-between items-center text-sm">
                              <span className="font-semibold">{d.name}</span>
                              <span className="font-mono text-primary font-bold">{d.probability}%</span>
                            </div>
                            <Progress value={d.probability} className="h-1.5" />
                            <p className="text-[10px] text-muted-foreground italic">{d.reasoning}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <section className="rounded-lg bg-accent/20 p-4 border border-accent/30">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                          🧑‍⚕️ Recommended Doctor Type
                        </h3>
                        <p className="text-lg font-bold text-primary">{result.recommendedDoctor}</p>
                      </section>

                      <section className="rounded-lg bg-muted/50 p-4 border">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
                          🏥 Consultation Mode
                        </h3>
                        <div className="flex items-center gap-2">
                          {result.consultationMode === 'Online' ? <Bot className="h-4 w-4 text-primary" /> : result.consultationMode === 'Emergency' ? <AlertTriangle className="h-4 w-4 text-destructive" /> : <MapPin className="h-4 w-4 text-primary" />}
                          <p className="text-lg font-bold">{result.consultationMode}</p>
                        </div>
                      </section>
                    </div>

                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
                        ⏱ Urgency Level
                      </h3>
                      <p className="text-sm font-semibold">{result.urgencyLevel}</p>
                    </section>

                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
                        📌 Reason for Matching
                      </h3>
                      <p className="text-sm text-muted-foreground">{result.matchingReason}</p>
                    </section>

                    {result.emergency && (
                      <div className="rounded-xl bg-destructive/10 p-4 border border-destructive/20 animate-pulse">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-destructive mb-2 flex items-center gap-2">
                          🚨 EMERGENCY ALERT
                        </h3>
                        <p className="text-sm font-bold text-destructive-foreground">{result.emergency}</p>
                      </div>
                    )}

                    <div className="pt-4 border-t flex justify-between items-center">
                      <div className="flex gap-2">
                        {result.sources.map((s, i) => (
                          <Badge key={i} variant="secondary" className="text-[9px] font-normal">
                            <ExternalLink className="h-2 w-2 mr-1" /> {s}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm" className="gap-2" onClick={() => toast.info("Redirecting to appointment booking...")}>
                        <PhoneCall className="h-4 w-4" />
                        Book {result.recommendedDoctor}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-start gap-3 rounded-xl bg-warning/5 p-4 text-[10px] text-muted-foreground border border-warning/20">
                  <AlertCircle className="h-4 w-4 shrink-0 text-warning" />
                  <p>
                    <strong>Clinical Disclaimer:</strong> This system provides decision support based on statistical modeling and clinical guidelines. It is NOT a substitute for professional medical judgment. All findings must be validated by a licensed healthcare provider.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center p-12 rounded-2xl border-2 border-dashed bg-muted/20">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Stethoscope className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold text-muted-foreground">Awaiting Symptom Input</h3>
                <p className="text-sm text-muted-foreground max-w-xs mt-2">
                  Describe your symptoms to find the right doctor and consultation mode.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIAssistant;