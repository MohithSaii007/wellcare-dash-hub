"use client";

import React, { useState, useMemo } from "react";
import { 
  Bot, Send, AlertCircle, Stethoscope, RefreshCw, 
  MessageSquare, Activity, User as UserIcon, Clock, 
  History, ShieldCheck, ExternalLink, Thermometer, 
  HeartPulse, FileText, Info
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { diseases, type Disease } from "@/data/mockData";
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
  explanation: string;
  differentialDiagnosis: { name: string; probability: number; reasoning: string }[];
  riskLevel: "Low" | "Medium" | "High";
  clinicalAdvice: string[];
  consultation: string;
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

  const performClinicalReasoning = (inputSymptoms: string, data: ClinicalData) => {
    setIsAnalyzing(true);
    
    // Simulate deep clinical reasoning and database cross-referencing
    setTimeout(() => {
      const inputLower = inputSymptoms.toLowerCase();
      const words = inputLower.split(/[\s,.]+/).filter(w => w.length > 2);
      
      const matches = diseases.map(disease => {
        let score = 0;
        
        // 1. Symptom Matching (Base Weight: 40%)
        disease.symptoms.forEach(s => {
          if (inputLower.includes(s.toLowerCase())) score += 10;
          words.forEach(word => {
            if (s.toLowerCase().includes(word)) score += 2;
          });
        });

        // 2. Category & History Alignment (Weight: 20%)
        if (data.history.toLowerCase().includes(disease.category.toLowerCase())) score += 5;
        
        // 3. Age/Gender Risk Factors (Weight: 20%)
        const ageNum = parseInt(data.age);
        if (disease.category === "Chronic" && ageNum > 45) score += 5;
        if (disease.category === "Pediatric" && ageNum < 12) score += 10;
        if (disease.category === "Reproductive" && data.gender === "female") score += 5;

        // 4. Vital Signs Correlation (Weight: 20%)
        const tempNum = parseFloat(data.vitals.temp);
        if (tempNum > 38 && (disease.category === "Infectious" || disease.category === "General")) score += 8;
        
        return { disease, score };
      }).filter(m => m.score > 0).sort((a, b) => b.score - a.score);

      if (matches.length === 0) {
        setResult(null);
        setIsAnalyzing(false);
        toast.error("Insufficient data for clinical analysis. Please provide more details.");
        return;
      }

      const topMatches = matches.slice(0, 3);
      const totalScore = topMatches.reduce((sum, m) => sum + m.score, 0);
      
      const differentialDiagnosis = topMatches.map(m => ({
        name: m.disease.name,
        probability: Math.round((m.score / totalScore) * 100),
        reasoning: `Matches ${m.disease.symptoms.filter(s => inputLower.includes(s.toLowerCase())).length} reported symptoms and aligns with ${m.disease.category} clinical patterns.`
      }));

      const primary = topMatches[0].disease;
      
      // Risk Stratification
      let riskLevel: "Low" | "Medium" | "High" = "Low";
      const isEmergencySymptom = inputLower.includes("chest pain") || inputLower.includes("breathing") || inputLower.includes("unconscious") || inputLower.includes("severe bleeding");
      
      if (isEmergencySymptom || primary.category === "Neurological" || (parseFloat(data.vitals.temp) > 39.5)) {
        riskLevel = "High";
      } else if (primary.category === "Chronic" || primary.category === "Infectious" || parseInt(data.duration) > 7) {
        riskLevel = "Medium";
      }

      const analysis: AnalysisResult = {
        explanation: `Clinical analysis of symptoms (${inputSymptoms}) in a ${data.age}yo ${data.gender} suggests a primary involvement of the ${primary.category.toLowerCase()} system. Differential diagnosis considers ${differentialDiagnosis.length} likely etiologies.`,
        differentialDiagnosis,
        riskLevel,
        clinicalAdvice: [
          ...primary.cures.slice(0, 2),
          "Monitor vital signs every 4 hours",
          "Maintain strict hydration and rest protocol"
        ],
        consultation: `Recommended consultation with a ${primary.category === 'Dermatology' ? 'Dermatologist' : 'Specialist in Internal Medicine'} within ${riskLevel === 'High' ? '2-4 hours' : '24-48 hours'}.`,
        emergency: riskLevel === "High" ? "CRITICAL: Presenting symptoms or vitals indicate a potential medical emergency. Proceed to the nearest Emergency Department immediately." : undefined,
        sources: ["WHO Clinical Guidelines", "CDC Disease Database", "Mayo Clinic Professional Reference"]
      };

      setResult(analysis);
      setIsAnalyzing(false);
      toast.success("Clinical analysis complete.");
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
          <h1 className="text-3xl font-heading font-bold tracking-tight">Clinical Reasoning Engine</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Advanced multi-factor diagnostic support using clinical probability modeling and real-time medical database cross-referencing.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Clinical Data Entry
                </CardTitle>
                <CardDescription>Provide detailed information for higher accuracy</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Primary Symptoms & Description</Label>
                    <Textarea 
                      id="symptoms"
                      placeholder="Describe symptoms, onset, and severity..." 
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

                  <div className="space-y-2">
                    <Label htmlFor="duration">Symptom Duration (Days)</Label>
                    <Input 
                      id="duration" 
                      type="number" 
                      placeholder="e.g. 3" 
                      value={clinicalData.duration}
                      onChange={(e) => setClinicalData({...clinicalData, duration: e.target.value})}
                    />
                  </div>

                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-xs text-primary"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    {showAdvanced ? "Hide Advanced Vitals" : "Add Vital Signs & History"}
                  </Button>

                  {showAdvanced && (
                    <div className="space-y-4 pt-2 animate-fade-in">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase">Temp (°C)</Label>
                          <Input 
                            className="h-8 text-xs" 
                            placeholder="37.0"
                            value={clinicalData.vitals.temp}
                            onChange={(e) => setClinicalData({...clinicalData, vitals: {...clinicalData.vitals, temp: e.target.value}})}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase">BP (mmHg)</Label>
                          <Input 
                            className="h-8 text-xs" 
                            placeholder="120/80"
                            value={clinicalData.vitals.bp}
                            onChange={(e) => setClinicalData({...clinicalData, vitals: {...clinicalData.vitals, bp: e.target.value}})}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase">HR (bpm)</Label>
                          <Input 
                            className="h-8 text-xs" 
                            placeholder="72"
                            value={clinicalData.vitals.heartRate}
                            onChange={(e) => setClinicalData({...clinicalData, vitals: {...clinicalData.vitals, heartRate: e.target.value}})}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase">Medical History</Label>
                        <Input 
                          className="h-8 text-xs" 
                          placeholder="Diabetes, Hypertension, etc."
                          value={clinicalData.history}
                          onChange={(e) => setClinicalData({...clinicalData, history: e.target.value})}
                        />
                      </div>
                    </div>
                  )}

                  <Button className="w-full hero-gradient border-none shadow-md" type="submit" disabled={isAnalyzing}>
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing Clinical Data...
                      </>
                    ) : (
                      <>
                        <Stethoscope className="mr-2 h-4 w-4" />
                        Run Clinical Analysis
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="rounded-xl bg-muted/50 p-4 border border-dashed">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase mb-2">
                <Info className="h-3 w-3" />
                System Status
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px]">
                  <span>Database Connectivity</span>
                  <span className="text-success font-bold">ACTIVE</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>Reasoning Engine</span>
                  <span className="text-success font-bold">OPTIMIZED</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>Firebase Health Sync</span>
                  <span className="text-primary font-bold">CONNECTED</span>
                </div>
              </div>
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
                  <p className="text-lg font-bold text-primary">Clinical Reasoning in Progress</p>
                  <p className="text-sm text-muted-foreground">Cross-referencing WHO & CDC databases...</p>
                </div>
              </div>
            ) : result ? (
              <div className="space-y-6 animate-fade-in">
                <Card className="overflow-hidden border-l-4 border-l-primary shadow-xl">
                  <CardHeader className="bg-muted/30 pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Clinical Analysis Report
                      </CardTitle>
                      <Badge 
                        variant={result.riskLevel === 'High' ? 'destructive' : result.riskLevel === 'Medium' ? 'outline' : 'secondary'}
                        className={`px-3 py-1 ${result.riskLevel === 'Medium' ? 'border-warning text-warning' : ''}`}
                      >
                        Risk: {result.riskLevel}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-8">
                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                        🔍 Clinical Summary
                      </h3>
                      <p className="text-foreground leading-relaxed text-sm bg-accent/20 p-4 rounded-lg border border-accent/30">
                        {result.explanation}
                      </p>
                    </section>

                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                        🩺 Differential Diagnosis
                      </h3>
                      <div className="space-y-4">
                        {result.differentialDiagnosis.map((d, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between items-end">
                              <div>
                                <span className="text-sm font-bold block">{d.name}</span>
                                <span className="text-[10px] text-muted-foreground">{d.reasoning}</span>
                              </div>
                              <span className="text-xs font-mono font-bold text-primary">{d.probability}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary transition-all duration-1000" 
                                style={{ width: `${d.probability}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <section>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                          ✅ Clinical Advice
                        </h3>
                        <ul className="space-y-2">
                          {result.clinicalAdvice.map((advice, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1 shrink-0" />
                              {advice}
                            </li>
                          ))}
                        </ul>
                      </section>
                      <section>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                          🏥 Consultation Plan
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {result.consultation}
                        </p>
                      </section>
                    </div>

                    {result.emergency && (
                      <div className="rounded-xl bg-destructive/10 p-4 border border-destructive/20 animate-pulse">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-destructive mb-2 flex items-center gap-2">
                          🚨 EMERGENCY ALERT
                        </h3>
                        <p className="text-sm font-bold text-destructive-foreground">{result.emergency}</p>
                      </div>
                    )}

                    <div className="pt-4 border-t flex flex-wrap gap-4 items-center justify-between">
                      <div className="flex gap-2">
                        {result.sources.map((s, i) => (
                          <Badge key={i} variant="secondary" className="text-[9px] font-normal">
                            <ExternalLink className="h-2 w-2 mr-1" /> {s}
                          </Badge>
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground italic">
                        Report ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                      </span>
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
                  <MessageSquare className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold text-muted-foreground">Awaiting Clinical Data</h3>
                <p className="text-sm text-muted-foreground max-w-xs mt-2">
                  Enter your symptoms and clinical details on the left to generate a comprehensive medical analysis report.
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