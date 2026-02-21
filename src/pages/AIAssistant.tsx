"use client";

import React, { useState, useMemo } from "react";
import { Bot, Send, AlertCircle, Stethoscope, RefreshCw, MessageSquare } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { diseases, type Disease } from "@/data/mockData";

interface AnalysisResult {
  explanation: string;
  predictions: { name: string; probability: number }[];
  riskLevel: "Low" | "Medium" | "High";
  careAdvice: string[];
  consultation: string;
  emergency?: string;
}

const AIAssistant = () => {
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeSymptoms = (userInput: string) => {
    setIsAnalyzing(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const inputLower = userInput.toLowerCase();
      const words = inputLower.split(/[\s,.]+/).filter(w => w.length > 2);
      
      const matches = diseases.map(disease => {
        let score = 0;
        // Check name
        if (inputLower.includes(disease.name.toLowerCase())) score += 5;
        // Check symptoms
        disease.symptoms.forEach(s => {
          if (inputLower.includes(s.toLowerCase())) score += 3;
          words.forEach(word => {
            if (s.toLowerCase().includes(word)) score += 1;
          });
        });
        // Check description
        words.forEach(word => {
          if (disease.description.toLowerCase().includes(word)) score += 0.5;
        });
        
        return { disease, score };
      }).filter(m => m.score > 0).sort((a, b) => b.score - a.score);

      if (matches.length === 0) {
        setResult(null);
        setIsAnalyzing(false);
        return;
      }

      const topMatches = matches.slice(0, 3);
      const totalScore = topMatches.reduce((sum, m) => sum + m.score, 0);
      
      const predictions = topMatches.map(m => ({
        name: m.disease.name,
        probability: Math.round((m.score / totalScore) * 100)
      }));

      const primary = topMatches[0].disease;
      
      // Determine risk level based on symptoms and category
      let riskLevel: "Low" | "Medium" | "High" = "Low";
      if (primary.category === "Infectious" || primary.category === "Neurological" || inputLower.includes("chest pain") || inputLower.includes("breathing")) {
        riskLevel = "High";
      } else if (primary.category === "Chronic" || primary.category === "Respiratory") {
        riskLevel = "Medium";
      }

      const analysis: AnalysisResult = {
        explanation: `Based on your description of "${userInput}", I've identified patterns matching several conditions, primarily affecting the ${primary.category.toLowerCase()} system.`,
        predictions,
        riskLevel,
        careAdvice: primary.cures.slice(0, 3),
        consultation: `You should consult a ${primary.category === 'Dermatology' ? 'Dermatologist' : 'General Physician'} if symptoms persist for more than 48 hours or if you experience worsening discomfort.`,
        emergency: riskLevel === "High" ? "If you experience sudden difficulty breathing, severe chest pain, or loss of consciousness, seek emergency medical help immediately." : undefined
      };

      setResult(analysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    analyzeSymptoms(input);
  };

  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <div className="mb-8 text-center animate-fade-in">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl hero-gradient mb-4 shadow-lg">
            <Bot className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-heading font-bold">AI Health Assistant</h1>
          <p className="mt-2 text-muted-foreground">Describe your symptoms and get an instant preliminary analysis</p>
        </div>

        <div className="grid gap-8 md:grid-cols-1">
          {/* Input Section */}
          <Card className="border-primary/20 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                How are you feeling?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input 
                  placeholder="e.g., I have a high fever, headache, and muscle pain..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1"
                  disabled={isAnalyzing}
                />
                <Button type="submit" disabled={isAnalyzing || !input.trim()}>
                  {isAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  <span className="ml-2 hidden sm:inline">Analyze</span>
                </Button>
              </form>
              <p className="mt-3 text-xs text-muted-foreground italic">
                Example: "I have a persistent cough, sore throat and mild fever"
              </p>
            </CardContent>
          </Card>

          {/* Results Section */}
          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-12 animate-pulse">
              <Stethoscope className="h-12 w-12 text-primary mb-4 animate-bounce" />
              <p className="text-lg font-medium text-primary">Analyzing symptoms...</p>
              <p className="text-sm text-muted-foreground">Comparing with medical database</p>
            </div>
          )}

          {result && !isAnalyzing && (
            <div className="space-y-6 animate-fade-in">
              <Card className="overflow-hidden border-l-4 border-l-primary">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                      🔍 Symptom Analysis:
                    </h3>
                    <p className="text-foreground leading-relaxed">{result.explanation}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                      🩺 Possible Diseases (with probability):
                    </h3>
                    <div className="space-y-3">
                      {result.predictions.map((p, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-sm font-medium">
                            <span>{p.name}</span>
                            <span>{p.probability}%</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-1000" 
                              style={{ width: `${p.probability}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                      ⚠️ Risk Level:
                    </h3>
                    <Badge 
                      variant={result.riskLevel === 'High' ? 'destructive' : result.riskLevel === 'Medium' ? 'outline' : 'secondary'}
                      className={`text-sm px-3 py-1 ${result.riskLevel === 'Medium' ? 'border-warning text-warning' : ''}`}
                    >
                      {result.riskLevel}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                      ✅ Immediate Care Advice:
                    </h3>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {result.careAdvice.map((advice, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          {advice}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                      🏥 Doctor Consultation:
                    </h3>
                    <p className="text-sm text-muted-foreground">{result.consultation}</p>
                  </div>

                  {result.emergency && (
                    <div className="rounded-xl bg-destructive/10 p-4 border border-destructive/20">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-destructive mb-1 flex items-center gap-2">
                        🚨 Emergency Alert:
                      </h3>
                      <p className="text-sm font-medium text-destructive-foreground">{result.emergency}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex items-start gap-3 rounded-xl bg-accent/50 p-4 text-xs text-muted-foreground">
                <AlertCircle className="h-5 w-5 shrink-0 text-primary" />
                <p>
                  <strong>Important Disclaimer:</strong> This AI assistant provides preliminary information based on statistical patterns and is NOT a medical diagnosis. Always consult with a qualified healthcare professional for medical advice, diagnosis, or treatment.
                </p>
              </div>
            </div>
          )}

          {!result && !isAnalyzing && input && (
            <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed">
              <p className="text-muted-foreground">Please provide more details about your symptoms for a better analysis.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AIAssistant;