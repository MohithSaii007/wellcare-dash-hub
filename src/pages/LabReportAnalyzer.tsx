"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, Search, Plus, Filter, 
  History, Sparkles, ShieldCheck, 
  ArrowRight, Loader2, Trash2, Download, Share2
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import LabReportUpload from "@/components/LabReportUpload";
import LabReportAnalysis from "@/components/LabReportAnalysis";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { toast } from "sonner";

export interface LabReport {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  reportType: string;
  date: any;
  analysis: {
    summary: string;
    biomarkers: {
      name: string;
      value: string;
      unit: string;
      referenceRange: string;
      status: "normal" | "high" | "low";
      insight: string;
    }[];
    recommendations: string[];
    riskLevel: "Low" | "Medium" | "High";
  };
}

const LabReportAnalyzer = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<LabReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "lab_reports"),
      where("userId", "==", user.uid),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LabReport[];
      setReports(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, "lab_reports", id));
      toast.success("Report deleted successfully");
      if (selectedReport?.id === id) setSelectedReport(null);
    } catch (error) {
      toast.error("Failed to delete report");
    }
  };

  const filteredReports = reports.filter(r => 
    r.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.reportType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container py-8 max-w-6xl">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl hero-gradient text-white shadow-lg shadow-primary/20">
                <FileText className="h-5 w-5" />
              </div>
              AI Lab Analyzer
            </h1>
            <p className="mt-1 text-muted-foreground">Upload diagnostic reports for instant AI-powered insights.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button className="hero-gradient gap-2 rounded-xl shadow-lg shadow-primary/20">
                  <Plus className="h-4 w-4" /> Analyze New Report
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none">
                <LabReportUpload onComplete={() => setIsUploadOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Sidebar: Report History */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-[2rem] border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="pb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Search reports..." 
                    className="pl-9 h-10 rounded-xl border-border/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                      <p className="text-xs text-muted-foreground">Loading reports...</p>
                    </div>
                  ) : filteredReports.length > 0 ? (
                    <div className="divide-y divide-border/50">
                      {filteredReports.map((report) => (
                        <button
                          key={report.id}
                          onClick={() => setSelectedReport(report)}
                          className={`w-full flex items-start gap-4 p-5 text-left transition-all hover:bg-muted/30 ${
                            selectedReport?.id === report.id ? "bg-primary/5 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
                          }`}
                        >
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                            report.analysis.riskLevel === 'High' ? 'bg-destructive/10 text-destructive' : 
                            report.analysis.riskLevel === 'Medium' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                          }`}>
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-bold text-sm truncate">{report.fileName}</p>
                              <Badge variant="outline" className="text-[8px] h-4 px-1.5 rounded-full">
                                {report.analysis.riskLevel} Risk
                              </Badge>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter mb-2">{report.reportType}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground">
                                {report.date?.seconds ? new Date(report.date.seconds * 1000).toLocaleDateString() : 'Recent'}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 text-muted-foreground hover:text-destructive rounded-full"
                                onClick={(e) => handleDelete(report.id, e)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <History className="h-8 w-8 text-muted-foreground/20" />
                      </div>
                      <h3 className="text-sm font-bold text-muted-foreground">No reports found</h3>
                      <p className="text-xs text-muted-foreground mt-2">Upload your first lab report to see AI analysis here.</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Content: Analysis View */}
          <div className="lg:col-span-8">
            {selectedReport ? (
              <div className="animate-fade-in">
                <LabReportAnalysis report={selectedReport} />
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center p-12 rounded-[2.5rem] border-2 border-dashed bg-muted/20 border-border/50">
                <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                  <Sparkles className="h-10 w-10 text-primary/20" />
                </div>
                <h3 className="text-xl font-bold text-muted-foreground">Select a report to view analysis</h3>
                <p className="text-sm text-muted-foreground max-w-xs mt-2 leading-relaxed">
                  Our AI will break down your medical data into simple, actionable insights.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md">
                  <div className="p-4 rounded-2xl bg-white border border-border/50 text-left">
                    <ShieldCheck className="h-5 w-5 text-success mb-2" />
                    <p className="text-xs font-bold">Secure & Private</p>
                    <p className="text-[10px] text-muted-foreground mt-1">HIPAA-compliant data encryption.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-border/50 text-left">
                    <Sparkles className="h-5 w-5 text-primary mb-2" />
                    <p className="text-xs font-bold">AI Insights</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Understand complex biomarkers.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LabReportAnalyzer;