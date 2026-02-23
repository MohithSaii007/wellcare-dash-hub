"use client";

import React from "react";
import Layout from "@/components/Layout";
import PrescriptionWizard from "@/components/PrescriptionWizard";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

const PrescriptionModule = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="text-4xl font-heading font-bold tracking-tight">Prescription Intelligence</h1>
          <p className="mt-2 text-muted-foreground text-lg max-w-2xl mx-auto">
            Upload your prescription and let our AI extract medicines, dosages, and durations instantly.
          </p>
        </div>

        <PrescriptionWizard />

        {/* Features Section */}
        <div className="mt-24 grid gap-8 md:grid-cols-3">
          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 text-center">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-bold mb-2">AI OCR Engine</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">Advanced handwriting recognition to accurately extract medical data from images.</p>
          </div>
          <div className="p-6 rounded-3xl bg-success/5 border border-success/10 text-center">
            <div className="h-12 w-12 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="h-6 w-6 text-success" />
            </div>
            <h4 className="font-bold mb-2">Secure Storage</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">Your prescriptions are encrypted and stored securely in compliance with health data standards.</p>
          </div>
          <div className="p-6 rounded-3xl bg-accent/5 border border-accent/10 text-center">
            <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-accent" />
            </div>
            <h4 className="font-bold mb-2">Instant Refills</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">Once confirmed, medicines are automatically added to your smart refill tracking system.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrescriptionModule;