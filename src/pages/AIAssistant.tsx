"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, Send, AlertCircle, Stethoscope, RefreshCw, 
  MessageSquare, User as UserIcon, ShieldCheck, 
  HeartPulse, Info, Sparkles
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { diseases } from "@/data/mockData";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  type?: "questions" | "analysis";
}

interface EssentialDetails {
  age?: string;
  gender?: string;
  duration?: string;
  severity?: string;
}

const AIAssistant = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Hello! I'm your Smart Medical AI. Describe your symptoms, and I'll help you understand what might be happening." 
    }
  ]);
  const [details, setDetails] = useState<EssentialDetails>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const extractDetails = (text: string) => {
    const lower = text.toLowerCase();
    const newDetails: EssentialDetails = { ...details };

    // Simple extraction logic
    if (lower.includes("male") || lower.includes("man") || lower.includes("boy")) newDetails.gender = "Male";
    if (lower.includes("female") || lower.includes("woman") || lower.includes("girl")) newDetails.gender = "Female";
    
    const ageMatch = text.match(/(\d+)\s*(year|yr|old)/i);
    if (ageMatch) newDetails.age = ageMatch[1];

    const durationMatch = text.match(/(\d+)\s*(day|week|month|hr|hour)/i);
    if (durationMatch) newDetails.duration = durationMatch[0];

    if (lower.includes("mild")) newDetails.severity = "Mild";
    if (lower.includes("moderate")) newDetails.severity = "Moderate";
    if (lower.includes("severe") || lower.includes("intense") || lower.includes("very bad")) newDetails.severity = "Severe";

    setDetails(newDetails);
    return newDetails;
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsProcessing(true);

    // Simulate "Smart Engine" processing
    setTimeout(() => {
      const currentDetails = extractDetails(userMsg);
      const missing: string[] = [];
      
      if (!currentDetails.age) missing.push("What is your age?");
      if (!currentDetails.gender) missing.push("What is your gender?");
      if (!currentDetails.duration) missing.push("How long have you had these symptoms?");
      if (!currentDetails.severity) missing.push("How would you rate the severity (Mild, Moderate, or Severe)?");

      // Limit to 2-3 essential questions if missing
      if (missing.length > 0 && messages.length < 6) {
        const questions = missing.slice(0, 3);
        setMessages(prev => [...prev, {
          role: "assistant",
          type: "questions",
          content: `🧠 To give an accurate prediction, I need just a few details:\n\n${questions.map(q => `• ${q}`).join("\n")}`
        }]);
      } else {
        // Perform Analysis
        const analysis = performAnalysis(userMsg, currentDetails);
        setMessages(prev => [...prev, {
          role: "assistant",
          type: "analysis",
          content: analysis
        }]);
      }
      setIsProcessing(false);
    }, 1500);
  };

  const performAnalysis = (text: string, data: EssentialDetails) => {
    const inputLower = text.toLowerCase();
    const matches = diseases.map(d => {
      let score = 0;
      d.symptoms.forEach(s => {
        if (inputLower.includes(s.toLowerCase())) score += 10;
      });
      if (data.severity === "Severe" && (d.category === "Infectious" || d.category === "Neurological")) score += 5;
      return { d, score };
    }).filter(m => m.score > 0).sort((a, b) => b.score - a.score);

    if (matches.length === 0) return "I couldn't find a specific match in my database. Please consult a doctor for a professional evaluation.";

    const primary = matches[0].d;
    const confidence = Math.min(85, 60 + matches[0].score);
    const others = matches.slice(1, 3).map(m => `${m.d.name} — ${Math.min(confidence - 10, 40 + m.score)}%`);

    let risk = "Low";
    if (data.severity === "Severe" || primary.category === "Neurological" || inputLower.includes("chest") || inputLower.includes("breath")) risk = "High";
    else if (data.severity === "Moderate" || primary.category === "Chronic") risk = "Medium";

    const emergency = risk === "High" ? "\n\n🚨 Emergency Alert:\nSeek immediate medical attention if you experience worsening chest pain, difficulty breathing, or sudden confusion." : "";

    return `🔍 Analysis:
Based on your symptoms and the ${data.severity?.toLowerCase() || 'reported'} severity, your clinical pattern aligns with ${primary.category.toLowerCase()} conditions.

🩺 Most Likely Condition:
${primary.name} — ${confidence}%

🧾 Other Possibilities:
${others.join("\n") || "No other significant matches found."}

⚠️ Risk Level:
${risk}

✅ Immediate Care Advice:
• ${primary.cures[0]}
• ${primary.cures[1] || "Monitor symptoms closely"}

🏥 Doctor Consultation:
Visit a doctor if symptoms persist beyond ${data.duration || '48 hours'} or if severity increases.${emergency}`;
  };

  return (
    <Layout>
      <div className="container py-8 max-w-3xl">
        <div className="mb-6 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl hero-gradient shadow-lg">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold">Smart Medical AI</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-success" /> Powered by Clinical Reasoning Engine
              </p>
            </div>
          </div>
          <Badge variant="outline" className="bg-accent/50">v2.4 Optimized</Badge>
        </div>

        <Card className="border-primary/10 shadow-xl overflow-hidden flex flex-col h-[600px]">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 ${
                    msg.role === "user" 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-muted text-foreground rounded-tl-none border border-border/50"
                  }`}>
                    <div className="flex items-center gap-2 mb-1 opacity-70">
                      {msg.role === "assistant" ? <Bot className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {msg.role === "assistant" ? "Medical AI" : "You"}
                      </span>
                    </div>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-muted rounded-2xl rounded-tl-none p-4 border border-border/50">
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-card/50">
            <form onSubmit={handleSend} className="flex gap-2">
              <Input 
                placeholder="Describe how you feel..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-background"
                disabled={isProcessing}
              />
              <Button type="submit" disabled={isProcessing || !input.trim()} className="hero-gradient border-none">
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="mt-3 flex items-center gap-4 overflow-x-auto pb-1 no-scrollbar">
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0">
                <Info className="h-3 w-3" /> Essential Data:
              </div>
              <DetailBadge label="Age" value={details.age} />
              <DetailBadge label="Gender" value={details.gender} />
              <DetailBadge label="Duration" value={details.duration} />
              <DetailBadge label="Severity" value={details.severity} />
            </div>
          </div>
        </Card>

        <div className="mt-6 rounded-xl bg-warning/5 p-4 border border-warning/20 text-[10px] text-muted-foreground flex gap-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-warning" />
          <p>
            <strong>Clinical Disclaimer:</strong> This AI assistant provides preliminary information based on statistical patterns and is NOT a medical diagnosis. Always consult with a qualified healthcare professional for medical advice, diagnosis, or treatment.
          </p>
        </div>
      </div>
    </Layout>
  );
};

const DetailBadge = ({ label, value }: { label: string; value?: string }) => (
  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-medium transition-colors ${
    value ? "bg-success/10 border-success/30 text-success" : "bg-muted border-border text-muted-foreground"
  }`}>
    {label}: {value || "Missing"}
  </div>
);

export default AIAssistant;