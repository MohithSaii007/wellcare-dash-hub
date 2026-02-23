"use client";

import React, { useState, useRef } from "react";
import { 
  Upload, Camera, FileText, CheckCircle2, 
  Loader2, AlertCircle, X, Sparkles, 
  Edit3, Trash2, Plus, ShoppingCart, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { uploadPrescription, processPrescriptionAI, saveConfirmedMedicines, ExtractedMedicine } from "@/lib/prescription-service";

const PrescriptionWizard = () => {
  const { user } = useAuth();
  const [step, setStep] = useState<'upload' | 'processing' | 'confirm' | 'final'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prescriptionId, setPrescriptionId] = useState<string | null>(null);
  const [medicines, setMedicines] = useState<ExtractedMedicine[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File too large. Max 5MB.");
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const startProcessing = async () => {
    if (!user || !file) return;
    setIsUploading(true);
    setStep('processing');
    
    try {
      const id = await uploadPrescription(user.uid, file);
      setPrescriptionId(id);
      
      const extracted = await processPrescriptionAI(preview!);
      setMedicines(extracted);
      setStep('confirm');
      toast.success("AI Scan Complete!");
    } catch (error) {
      toast.error("Processing failed. Please try again.");
      setStep('upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", frequency: "", duration: "" }]);
  };

  const handleUpdateMedicine = (index: number, field: keyof ExtractedMedicine, value: string) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };
    setMedicines(updated);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const confirmMedicines = async () => {
    if (!prescriptionId) return;
    setIsUploading(true);
    try {
      await saveConfirmedMedicines(prescriptionId, medicines);
      setStep('final');
      toast.success("Medicines confirmed!");
    } catch (error) {
      toast.error("Failed to save confirmation.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-12 px-4">
        {['Upload', 'Scan', 'Confirm', 'Order'].map((s, i) => (
          <div key={s} className="flex flex-col items-center gap-2">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
              (i === 0 && step === 'upload') || (i === 1 && step === 'processing') || (i === 2 && step === 'confirm') || (i === 3 && step === 'final')
                ? 'hero-gradient text-white scale-110 shadow-lg'
                : i < ['upload', 'processing', 'confirm', 'final'].indexOf(step)
                ? 'bg-success text-white'
                : 'bg-muted text-muted-foreground'
            }`}>
              {i < ['upload', 'processing', 'confirm', 'final'].indexOf(step) ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s}</span>
          </div>
        ))}
      </div>

      {step === 'upload' && (
        <Card className="border-dashed border-2 p-12 text-center animate-fade-in">
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          {!preview ? (
            <div className="space-y-6">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Upload Prescription</h3>
                <p className="text-muted-foreground mt-1">AI will automatically extract medicines for you.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => fileInputRef.current?.click()} className="hero-gradient h-12 px-8 rounded-xl">
                  Select Image
                </Button>
                <Button variant="outline" className="h-12 px-8 rounded-xl gap-2">
                  <Camera className="h-5 w-5" /> Use Camera
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative max-w-sm mx-auto rounded-2xl overflow-hidden border shadow-2xl">
                <img src={preview} className="w-full h-64 object-cover" alt="Preview" />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 rounded-full" onClick={() => {setPreview(null); setFile(null);}}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={startProcessing} className="hero-gradient h-12 px-12 rounded-xl text-lg font-bold">
                Start AI Analysis
              </Button>
            </div>
          )}
        </Card>
      )}

      {step === 'processing' && (
        <Card className="p-12 text-center animate-fade-in">
          <div className="space-y-8">
            <div className="relative h-32 w-32 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-primary animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-primary">AI is Reading...</h3>
              <p className="text-muted-foreground">Extracting medicine names, dosages, and durations using OCR.</p>
            </div>
            <div className="max-w-xs mx-auto space-y-2">
              <Progress value={66} className="h-2" />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Analyzing handwriting patterns</p>
            </div>
          </div>
        </Card>
      )}

      {step === 'confirm' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">Confirm Medicines</h3>
            <Button variant="outline" size="sm" onClick={handleAddMedicine} className="gap-2">
              <Plus className="h-4 w-4" /> Add Medicine
            </Button>
          </div>
          
          <div className="grid gap-4">
            {medicines.map((m, i) => (
              <Card key={i} className="p-4 border-primary/10 bg-primary/5">
                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="sm:col-span-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Medicine Name</label>
                    <Input value={m.name} onChange={(e) => handleUpdateMedicine(i, 'name', e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Dosage</label>
                    <Input value={m.dosage} onChange={(e) => handleUpdateMedicine(i, 'dosage', e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Frequency</label>
                    <Input value={m.frequency} onChange={(e) => handleUpdateMedicine(i, 'frequency', e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Duration</label>
                      <Input value={m.duration} onChange={(e) => handleUpdateMedicine(i, 'duration', e.target.value)} className="h-9 text-sm" />
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleRemoveMedicine(i)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Button variant="ghost" onClick={() => setStep('upload')}>Back</Button>
            <Button onClick={confirmMedicines} className="hero-gradient h-12 px-12 rounded-xl font-bold" disabled={isUploading}>
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
              Confirm & Proceed
            </Button>
          </div>
        </div>
      )}

      {step === 'final' && (
        <div className="space-y-8 animate-fade-in">
          <Card className="p-8 border-success/20 bg-success/5 text-center">
            <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-2xl font-bold">Prescription Verified</h3>
            <p className="text-muted-foreground mt-1">Your medicines are ready to be ordered.</p>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> Confirmed List
              </h4>
              <div className="space-y-4">
                {medicines.map((m, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-muted/50">
                    <div>
                      <p className="font-bold text-sm">{m.name}</p>
                      <p className="text-[10px] text-muted-foreground">{m.dosage} • {m.frequency} • {m.duration}</p>
                    </div>
                    <Badge className="bg-success/10 text-success border-none">Available</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 flex flex-col justify-between">
              <div>
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-primary" /> Order Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Items</span><span>{medicines.length}</span></div>
                  <div className="flex justify-between"><span>Delivery</span><span className="text-success font-bold">FREE</span></div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg"><span>Total</span><span>₹450.00</span></div>
                </div>
              </div>
              <Button className="w-full hero-gradient h-12 mt-6 rounded-xl font-bold gap-2">
                Add All to Cart <ArrowRight className="h-4 w-4" />
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionWizard;