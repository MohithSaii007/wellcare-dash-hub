"use client";

import React, { useState, useRef } from "react";
import { 
  Upload, FileText, CheckCircle2, Loader2, 
  AlertCircle, X, Sparkles, ShieldCheck, 
  ArrowRight, Info, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { toast } from "sonner";

interface LabReportUploadProps {
  onComplete: () => void;
}

const LabReportUpload = ({ onComplete }: LabReportUploadProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState<"upload" | "analyzing" | "success">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File too large. Maximum size is 10MB.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const simulateAnalysis = async () => {
    if (!file || !user) return;
    
    setStep("analyzing");
    
    const statuses = [
      "Extracting text from report...",
      "Identifying biomarkers...",
      "Comparing with reference ranges...",
      "Generating clinical insights...",
      "Finalizing AI report..."
    ];

    for (let i = 0; i < statuses.length; i++) {
      setAnalysisStatus(statuses[i]);
      setProgress((i + 1) * 20);
      await new Promise(resolve => setTimeout(resolve, 1200));
    }

    // Mock Analysis Data
    const mockAnalysis = {
      summary: "The report indicates a generally healthy profile with a slight elevation in LDL cholesterol levels. Blood glucose and hemoglobin are within optimal ranges.",
      biomarkers: [
        { name: "Hemoglobin", value: "14.2", unit: "g/dL", referenceRange: "13.5 - 17.5", status: "normal", insight: "Your oxygen-carrying capacity is excellent." },
        { name: "LDL Cholesterol", value: "142", unit: "mg/dL", referenceRange: "< 100", status: "high", insight: "Slightly elevated. Consider reducing saturated fat intake." },
        { name: "Fasting Glucose", value: "92", unit: "mg/dL", referenceRange: "70 - 99", status: "normal", insight: "Your blood sugar levels are perfectly stable." },
        { name: "Vitamin D", value: "24", unit: "ng/mL", referenceRange: "30 - 100", status: "low", insight: "Below optimal range. Consider 15 mins of sunlight daily." }
      ],
      recommendations: [
        "Increase intake of Omega-3 rich foods (walnuts, flaxseeds).",
        "Maintain current physical activity levels.",
        "Re-test Vitamin D levels in 3 months."
      ],
      riskLevel: "Medium"
    };

    try {
      await addDoc(collection(db, "lab_reports"), {
        userId: user.uid,
        fileName: file.name,
        fileUrl: "https://placeholder.com/report.pdf", // In real app, upload to Firebase Storage
        reportType: "Complete Blood Count & Lipid Profile",
        date: Timestamp.now(),
        analysis: mockAnalysis
      });
      
      setStep("success");
      toast.success("Analysis complete!");
    } catch (error) {
      toast.error("Failed to save analysis.");
      setStep("upload");
    }
  };

  return (
    <div className="bg-white">
      {step === "upload" && (
        <div className="p-10 space-y-8">
          <div className="text-center space-y-2">
            <div className="h-16 w-16 rounded-2xl hero-gradient flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Upload className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Upload Lab Report</h2>
            <p className="text-sm text-muted-foreground">Our AI will analyze your PDF or Image report instantly.</p>
          </div>

          {!file ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-primary/20 p-12 transition-all hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf,image/*" 
                onChange={handleFileChange} 
              />
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <FileText className="h-7 w-7" />
              </div>
              <p className="text-sm font-bold">Click to select or drag and drop</p>
              <p className="mt-1 text-xs text-muted-foreground">PDF, PNG or JPG (max. 10MB)</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold truncate max-w-[200px]">{file.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setFile(null)} className="rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted/30 border border-border/50">
              <ShieldCheck className="h-5 w-5 text-success shrink-0" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Privacy</p>
                <p className="text-[10px] leading-relaxed">Encrypted & HIPAA compliant processing.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted/30 border border-border/50">
              <Sparkles className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">AI Engine</p>
                <p className="text-[10px] leading-relaxed">Advanced medical OCR & LLM analysis.</p>
              </div>
            </div>
          </div>

          <Button 
            className="w-full hero-gradient h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20" 
            disabled={!file}
            onClick={simulateAnalysis}
          >
            Start AI Analysis <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}

      {step === "analyzing" && (
        <div className="p-16 flex flex-col items-center justify-center text-center space-y-8 animate-fade-in">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </div>
          <div className="space-y-4 w-full max-w-xs">
            <h3 className="text-xl font-bold text-primary">{analysisStatus}</h3>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground italic">"Our AI is cross-referencing 50,000+ clinical data points to provide accurate insights."</p>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="p-16 flex flex-col items-center justify-center text-center space-y-8 animate-fade-in">
          <div className="h-24 w-24 rounded-full bg-success/10 flex items-center justify-center shadow-inner">
            <CheckCircle2 className="h-12 w-12 text-success" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Analysis Complete!</h2>
            <p className="text-muted-foreground">Your report has been processed and is ready for review.</p>
          </div>
          <Button className="hero-gradient h-14 px-12 rounded-2xl font-bold text-lg shadow-xl" onClick={onComplete}>
            View Full Report
          </Button>
        </div>
      )}
    </div>
  );
};

export default LabReportUpload;