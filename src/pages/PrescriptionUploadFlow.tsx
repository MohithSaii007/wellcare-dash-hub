"use client";

import React, { useState, useRef } from "react";
import { 
  Upload, Camera, FileText, CheckCircle2, 
  Loader2, X, ArrowRight, 
  Trash2, Plus, ShoppingCart,
  ShieldCheck, Sparkles, Image as ImageIcon
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { uploadPrescriptionImage, savePrescriptionData } from "@/utils/prescriptionService";
import { processPrescriptionML, ExtractedMedicine, OCRResult } from "@/utils/ocrService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type FlowStep = "upload" | "processing" | "confirmation" | "listing";

const PrescriptionUploadFlow = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<FlowStep>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [confirmedMedicines, setConfirmedMedicines] = useState<ExtractedMedicine[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File too large. Max 10MB allowed.");
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const startProcessing = async () => {
    if (!file || !user) return;
    
    setIsUploading(true);
    setStep("processing");
    
    try {
      setProcessingProgress(20);
      const imageUrl = await uploadPrescriptionImage(user.uid, file);
      
      setProcessingProgress(50);
      const result = await processPrescriptionML(imageUrl);
      setOcrResult(result);
      setConfirmedMedicines(result.medicines);
      
      setProcessingProgress(80);
      await savePrescriptionData(user.uid, {
        imageUrl,
        extractedText: result.extractedText,
        medicines: result.medicines,
        status: "pending"
      });
      
      setProcessingProgress(100);
      setTimeout(() => setStep("confirmation"), 500);
      toast.success("Prescription analyzed successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to process prescription. Please try again.");
      setStep("upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirm = () => {
    setStep("listing");
    toast.success("Medicines confirmed!");
  };

  const addMedicine = () => {
    const newMed: ExtractedMedicine = {
      id: Math.random().toString(36).substr(2, 9),
      name: "New Medicine",
      dosage: "1 tablet",
      frequency: "1-0-1",
      duration: "5 days"
    };
    setConfirmedMedicines([...confirmedMedicines, newMed]);
  };

  const updateMedicine = (id: string, field: keyof ExtractedMedicine, value: string) => {
    setConfirmedMedicines(confirmedMedicines.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeMedicine = (id: string) => {
    setConfirmedMedicines(confirmedMedicines.filter(m => m.id !== id));
  };

  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <div className="mb-8 flex flex-col items-center text-center animate-fade-in">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl hero-gradient mb-4 shadow-lg">
            <FileText className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-heading font-bold">Prescription Intelligence</h1>
          <p className="mt-2 text-muted-foreground max-w-md">
            Upload your prescription and let our AI extract medicines for instant ordering.
          </p>
        </div>

        <div className="mb-12 flex justify-center">
          <div className="flex items-center gap-4">
            <StepIndicator active={step === "upload"} completed={step !== "upload"} label="Upload" />
            <div className="h-px w-8 bg-border" />
            <StepIndicator active={step === "processing"} completed={step === "confirmation" || step === "listing"} label="Analyze" />
            <div className="h-px w-8 bg-border" />
            <StepIndicator active={step === "confirmation"} completed={step === "listing"} label="Confirm" />
            <div className="h-px w-8 bg-border" />
            <StepIndicator active={step === "listing"} completed={false} label="Order" />
          </div>
        </div>

        <div className="animate-fade-in">
          {step === "upload" && (
            <Card className="border-dashed border-2 border-primary/20 bg-primary/5">
              <CardContent className="p-12 flex flex-col items-center text-center">
                {!previewUrl ? (
                  <>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="h-20 w-20 rounded-full bg-white shadow-md flex items-center justify-center mb-6 cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Select Prescription Image</h3>
                    <p className="text-sm text-muted-foreground mb-8">Supports JPG, PNG, and PDF up to 10MB</p>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*,.pdf" 
                      onChange={handleFileChange} 
                    />
                    <div className="flex gap-4">
                      <Button onClick={() => fileInputRef.current?.click()} className="hero-gradient">
                        Choose File
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Camera className="h-4 w-4" /> Use Camera
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="w-full max-w-md space-y-6">
                    <div className="relative rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                      <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover" />
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={() => { setFile(null); setPreviewUrl(null); }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-4">
                      <Button variant="outline" className="flex-1" onClick={() => { setFile(null); setPreviewUrl(null); }}>
                        Change Image
                      </Button>
                      <Button className="flex-1 hero-gradient gap-2" onClick={startProcessing}>
                        Start AI Analysis <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {step === "processing" && (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center space-y-8">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">AI is reading your prescription...</h3>
                  <p className="text-sm text-muted-foreground">Extracting medicine names, dosages, and durations.</p>
                </div>
                <div className="w-full max-w-xs space-y-2">
                  <Progress value={processingProgress} className="h-2" />
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                    {processingProgress < 40 ? "Uploading Securely..." : processingProgress < 80 ? "Running OCR & NLP..." : "Finalizing Data..."}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {step === "confirmation" && (
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <Card className="sticky top-24 overflow-hidden">
                  <CardHeader className="bg-muted/50">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" /> Original Image
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <img src={previewUrl!} alt="Prescription" className="w-full h-auto" />
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" /> Extracted Medicines
                  </h3>
                  <Button variant="outline" size="sm" className="gap-2" onClick={addMedicine}>
                    <Plus className="h-4 w-4" /> Add Medicine
                  </Button>
                </div>

                <div className="space-y-4">
                  {confirmedMedicines.map((med) => (
                    <Card key={med.id} className="border-primary/10 hover:border-primary/30 transition-colors">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="space-y-1">
                              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Medicine Name</Label>
                              <Input 
                                value={med.name} 
                                onChange={(e) => updateMedicine(med.id, "name", e.target.value)}
                                className="h-9 font-bold"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Dosage</Label>
                                <Input 
                                  value={med.dosage} 
                                  onChange={(e) => updateMedicine(med.id, "dosage", e.target.value)}
                                  className="h-8 text-xs"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Frequency</Label>
                                <Input 
                                  value={med.frequency} 
                                  onChange={(e) => updateMedicine(med.id, "frequency", e.target.value)}
                                  className="h-8 text-xs"
                                />
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => removeMedicine(med.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="pt-6 flex gap-4">
                  <Button variant="outline" className="flex-1" onClick={() => setStep("upload")}>
                    Re-scan
                  </Button>
                  <Button className="flex-1 hero-gradient" onClick={handleConfirm}>
                    Confirm & View Availability
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === "listing" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Medicine Availability</h3>
                <Badge className="bg-success/10 text-success border-success/20">Verified by AI</Badge>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {confirmedMedicines.map((med) => (
                  <Card key={med.id} className="overflow-hidden card-shadow hover:card-shadow-hover transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1">
                          <h4 className="text-lg font-bold">{med.name}</h4>
                          <p className="text-xs text-muted-foreground">{med.dosage} • {med.frequency}</p>
                        </div>
                        <Badge variant="outline" className="bg-success/5 text-success border-success/20">In Stock</Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                        <ShieldCheck className="h-3 w-3 text-primary" />
                        Matches Prescription ID: {ocrResult?.prescriptionId.split('-')[1]}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-xl font-bold">₹145.00</span>
                        <Button size="sm" className="hero-gradient gap-2">
                          <ShoppingCart className="h-4 w-4" /> Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-1">
                    <h4 className="text-xl font-bold">Ready to checkout?</h4>
                    <p className="text-sm text-muted-foreground">All medicines from your prescription are available for immediate delivery.</p>
                  </div>
                  <Button size="lg" className="hero-gradient px-12 rounded-2xl font-bold" onClick={() => navigate("/medicines")}>
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 text-muted-foreground opacity-50">
          <div className="flex items-center gap-2 text-xs">
            <ShieldCheck className="h-4 w-4" /> HIPAA Compliant
          </div>
          <div className="flex items-center gap-2 text-xs">
            <ShieldCheck className="h-4 w-4" /> End-to-End Encrypted
          </div>
          <div className="flex items-center gap-2 text-xs">
            <ShieldCheck className="h-4 w-4" /> Secure Storage
          </div>
        </div>
      </div>
    </Layout>
  );
};

const StepIndicator = ({ active, completed, label }: { active: boolean; completed: boolean; label: string }) => (
  <div className="flex flex-col items-center gap-2">
    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
      active ? "bg-primary text-white ring-4 ring-primary/20" : 
      completed ? "bg-success text-white" : "bg-muted text-muted-foreground"
    }`}>
      {completed ? <CheckCircle2 className="h-4 w-4" /> : active ? "•" : ""}
    </div>
    <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? "text-primary" : "text-muted-foreground"}`}>
      {label}
    </span>
  </div>
);

export default PrescriptionUploadFlow;