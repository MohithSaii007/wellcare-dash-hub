"use client";

import React from "react";
import { 
  FileText, AlertCircle, CheckCircle2, 
  TrendingUp, TrendingDown, Info, 
  Download, Share2, ShieldCheck, Sparkles,
  ArrowUpRight, ArrowDownRight, Minus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LabReport } from "@/pages/LabReportAnalyzer";

interface LabReportAnalysisProps {
  report: LabReport;
}

const LabReportAnalysis = ({ report }: LabReportAnalysisProps) => {
  const { analysis } = report;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="rounded-[2.5rem] border-border/50 shadow-xl overflow-hidden">
        <div className="hero-gradient p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge className="bg-white/20 text-white border-none backdrop-blur-md px-3 py-1 font-bold uppercase tracking-widest text-[10px]">
                  AI Analysis Report
                </Badge>
                <span className="text-xs font-medium opacity-80">
                  {report.date?.seconds ? new Date(report.date.seconds * 1000).toLocaleDateString() : 'Recent'}
                </span>
              </div>
              <h2 className="text-3xl font-bold">{report.fileName}</h2>
              <p className="text-white/80 font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" /> {report.reportType}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl h-12 px-6 font-bold backdrop-blur-sm">
                <Download className="h-4 w-4 mr-2" /> PDF
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl h-12 px-6 font-bold backdrop-blur-sm">
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
            </div>
          </div>
        </div>
        <CardContent className="p-8">
          <div className="flex items-start gap-4 p-6 rounded-3xl bg-primary/5 border border-primary/10">
            <Sparkles className="h-6 w-6 text-primary shrink-0 mt-1" />
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">AI Executive Summary</h3>
              <p className="text-base text-foreground/80 leading-relaxed font-medium">{analysis.summary}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Biomarkers Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {analysis.biomarkers.map((bio, i) => (
          <Card key={i} className="rounded-[2rem] border-border/50 shadow-sm hover:shadow-md transition-all group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">{bio.name}</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold tracking-tighter">{bio.value}</span>
                    <span className="text-xs font-bold text-muted-foreground">{bio.unit}</span>
                  </div>
                </div>
                <Badge 
                  variant={bio.status === 'normal' ? 'secondary' : 'destructive'}
                  className={`rounded-full px-3 py-1 font-bold uppercase text-[9px] ${
                    bio.status === 'normal' ? 'bg-success/10 text-success border-success/20' : 
                    bio.status === 'high' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                    'bg-warning/10 text-warning border-warning/20'
                  }`}
                >
                  {bio.status === 'normal' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                  {bio.status}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                  <span>Reference Range</span>
                  <span className="text-foreground">{bio.referenceRange} {bio.unit}</span>
                </div>
                <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`absolute h-full rounded-full transition-all duration-1000 ${
                      bio.status === 'normal' ? 'bg-success' : bio.status === 'high' ? 'bg-destructive' : 'bg-warning'
                    }`}
                    style={{ width: bio.status === 'normal' ? '60%' : bio.status === 'high' ? '85%' : '30%' }}
                  />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed italic bg-muted/30 p-3 rounded-xl border border-border/50">
                  "{bio.insight}"
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendations & Risk */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 rounded-[2rem] border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              AI Recommendations
            </CardTitle>
            <CardDescription>Personalized steps based on your report data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 group hover:bg-white hover:shadow-sm transition-all">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                  {i + 1}
                </div>
                <p className="text-sm font-medium text-foreground/80 leading-relaxed">{rec}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={`rounded-[2rem] border-none shadow-xl overflow-hidden ${
          analysis.riskLevel === 'High' ? 'bg-destructive/5' : 
          analysis.riskLevel === 'Medium' ? 'bg-warning/5' : 'bg-success/5'
        }`}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className={`h-5 w-5 ${
                analysis.riskLevel === 'High' ? 'text-destructive' : 
                analysis.riskLevel === 'Medium' ? 'text-warning' : 'text-success'
              }`} />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Overall Risk Level</p>
              <p className={`text-5xl font-extrabold tracking-tighter ${
                analysis.riskLevel === 'High' ? 'text-destructive' : 
                analysis.riskLevel === 'Medium' ? 'text-warning' : 'text-success'
              }`}>
                {analysis.riskLevel}
              </p>
            </div>
            
            <div className="p-4 rounded-2xl bg-white border border-border/50 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <span>Clinical Urgency</span>
                <span className={analysis.riskLevel === 'High' ? 'text-destructive' : 'text-success'}>
                  {analysis.riskLevel === 'High' ? 'Priority' : 'Routine'}
                </span>
              </div>
              <Progress 
                value={analysis.riskLevel === 'High' ? 85 : analysis.riskLevel === 'Medium' ? 50 : 20} 
                className={`h-2 ${analysis.riskLevel === 'High' ? 'bg-destructive/10' : 'bg-success/10'}`}
              />
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/50 border border-dashed border-border">
              <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                <strong>Disclaimer:</strong> This AI analysis is for informational purposes only and does not constitute medical advice. Always consult with a qualified healthcare professional.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LabReportAnalysis;