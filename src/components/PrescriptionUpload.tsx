"use client";

import React, { useState, useRef } from "react";
import { Upload, Camera, FileText, CheckCircle2, Loader2, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface PrescriptionUploadProps {
  medicineName: string;
  onUploadComplete: (fileUrl: string) => void;
  onCancel: () => void;
}

const PrescriptionUpload = ({ medicineName, onUploadComplete, onCancel }: PrescriptionUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large. Maximum size is 5MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateVerification = async () => {
    if (!preview) return;
    
    setIsUploading(true);
    setIsValidating(true);
    
    // Simulate secure upload and AI verification logic
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const isSuccess = Math.random() > 0.1; // 90% success rate for demo
    
    if (isSuccess) {
      toast.success("Prescription verified successfully!");
      onUploadComplete(preview);
    } else {
      toast.error("Prescription verification failed. Please ensure the image is clear and valid.");
      setPreview(null);
    }
    
    setIsUploading(false);
    setIsValidating(false);
  };

  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center gap-3 rounded-lg bg-primary/5 p-4 border border-primary/20">
        <FileText className="h-5 w-5 text-primary" />
        <div>
          <p className="text-sm font-semibold">Prescription Required</p>
          <p className="text-xs text-muted-foreground">You are ordering <span className="font-bold text-foreground">{medicineName}</span> which requires a valid prescription.</p>
        </div>
      </div>

      {!preview ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 p-10 transition-all hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <Upload className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium">Click to upload or drag and drop</p>
          <p className="mt-1 text-xs text-muted-foreground">PNG, JPG or PDF (max. 5MB)</p>
          
          <div className="mt-6 flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Camera className="h-4 w-4" /> Use Camera
            </Button>
          </div>
        </div>
      ) : (
        <Card className="overflow-hidden border-primary/20">
          <CardContent className="p-0 relative">
            <img src={preview} alt="Prescription Preview" className="w-full h-48 object-cover" />
            <button 
              onClick={() => setPreview(null)}
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="p-4 bg-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 text-success" />
                  Image captured
                </div>
                <Button 
                  size="sm" 
                  onClick={simulateVerification} 
                  disabled={isUploading}
                  className="hero-gradient"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Continue"
                  )}
                </Button>
              </div>
              
              {isValidating && (
                <div className="space-y-2 animate-pulse">
                  <div className="flex items-center gap-2 text-[10px] text-primary font-bold uppercase">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    AI Verification in progress...
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-progress-loading" style={{ width: '60%' }} />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-start gap-2 rounded-lg bg-warning/10 p-3 text-[10px] text-muted-foreground">
        <AlertCircle className="h-4 w-4 shrink-0 text-warning" />
        <p>
          <strong>Security Note:</strong> Your prescription is encrypted and only visible to our licensed pharmacists for verification purposes.
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default PrescriptionUpload;