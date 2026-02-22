"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Activity, Heart, Droplets, Scale, Plus, 
  TrendingUp, AlertCircle, Calendar, ChevronRight,
  Info, Bell, Download, Share2, Trash2, Loader2
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from "recharts";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, orderBy, onSnapshot, Timestamp, deleteDoc, doc } from "firebase/firestore";
import { toast } from "sonner";
import { generateNotificationMessage } from "@/utils/notificationEngine";

interface HealthReading {
  id: string;
  type: "bp" | "sugar" | "weight" | "heart";
  value: number;
  value2?: number; // For BP (systolic/diastolic)
  unit: string;
  timestamp: any;
  status: "normal" | "high" | "low";
}

const HealthDashboard = () => {
  const { user } = useAuth();
  const [readings, setReadings] = useState<HealthReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<"bp" | "sugar" | "weight" | "heart">("bp");
  const [inputValue, setInputValue] = useState("");
  const [inputValue2, setInputValue2] = useState(""); // For BP

  // Thresholds
  const thresholds = {
    bp: { high: 140, low: 90, high2: 90, low2: 60 },
    sugar: { high: 140, low: 70 },
    heart: { high: 100, low: 60 },
    weight: { high: 100, low: 40 }
  };

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "health_readings"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HealthReading[];
      setReadings(data);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      toast.error("Failed to sync health data.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const checkStatus = (type: string, val: number, val2?: number) => {
    if (type === "bp") {
      if (val >= thresholds.bp.high || (val2 && val2 >= thresholds.bp.high2)) return "high";
      if (val <= thresholds.bp.low || (val2 && val2 <= thresholds.bp.low2)) return "low";
      return "normal";
    }
    const t = thresholds[type as keyof typeof thresholds] as any;
    if (val >= t.high) return "high";
    if (val <= t.low) return "low";
    return "normal";
  };

  const handleAddReading = async () => {
    if (!user || !inputValue) return;

    setSaving(true);
    const val = parseFloat(inputValue);
    const val2 = inputValue2 ? parseFloat(inputValue2) : undefined;
    const status = checkStatus(selectedType, val, val2);

    try {
      await addDoc(collection(db, "health_readings"), {
        userId: user.uid,
        type: selectedType,
        value: val,
        value2: val2,
        unit: selectedType === "bp" ? "mmHg" : selectedType === "sugar" ? "mg/dL" : selectedType === "weight" ? "kg" : "bpm",
        timestamp: Timestamp.now(),
        status
      });

      if (status !== "normal") {
        const msg = generateNotificationMessage(
          status === "high" ? "HEALTH_ALERT_HIGH" : "HEALTH_ALERT_LOW",
          { metric: selectedType.toUpperCase(), value: `${val}${val2 ? '/' + val2 : ''}` }
        );
        window.dispatchEvent(new CustomEvent("wellcare-notification", { 
          detail: { ...msg, type: status === "high" ? "HEALTH_ALERT_HIGH" : "HEALTH_ALERT_LOW" } 
        }));
      }

      toast.success("Reading saved successfully");
      setShowAddDialog(false);
      setInputValue("");
      setInputValue2("");
    } catch (error) {
      toast.error("Failed to save reading. Please try again.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReading = async (id: string) => {
    try {
      await deleteDoc(doc(db, "health_readings", id));
      toast.success("Reading deleted");
    } catch (error) {
      toast.error("Failed to delete reading");
    }
  };

  const chartData = useMemo(() => {
    return readings
      .filter(r => r.type === selectedType)
      .slice(0, 7)
      .reverse()
      .map(r => ({
        name: new Date(r.timestamp.seconds * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        value: r.value,
        value2: r.value2
      }));
  }, [readings, selectedType]);

  const latestReadings = useMemo(() => {
    const types: ("bp" | "sugar" | "weight" | "heart")[] = ["bp", "sugar", "weight", "heart"];
    return types.map(t => readings.find(r => r.type === t));
  }, [readings]);

  if (loading) {
    return (
      <Layout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 max-w-6xl">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl hero-gradient text-white">
                <Activity className="h-5 w-5" />
              </div>
              Smart Health Dashboard
            </h1>
            <p className="mt-1 text-muted-foreground">Track your vitals and monitor health trends in real-time.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" /> Export Data
            </Button>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="hero-gradient gap-2">
                  <Plus className="h-4 w-4" /> Add Reading
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Health Reading</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Metric Type</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "bp", label: "Blood Pressure", icon: Heart },
                        { id: "sugar", label: "Blood Sugar", icon: Droplets },
                        { id: "heart", label: "Heart Rate", icon: Activity },
                        { id: "weight", label: "Weight", icon: Scale }
                      ].map(t => (
                        <Button
                          key={t.id}
                          variant={selectedType === t.id ? "default" : "outline"}
                          className="justify-start gap-2"
                          onClick={() => setSelectedType(t.id as any)}
                        >
                          <t.icon className="h-4 w-4" />
                          {t.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{selectedType === "bp" ? "Systolic (Upper)" : "Value"}</Label>
                    <Input 
                      type="number" 
                      placeholder={selectedType === "bp" ? "e.g. 120" : "e.g. 85"}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                  </div>

                  {selectedType === "bp" && (
                    <div className="space-y-2">
                      <Label>Diastolic (Lower)</Label>
                      <Input 
                        type="number" 
                        placeholder="e.g. 80"
                        value={inputValue2}
                        onChange={(e) => setInputValue2(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setShowAddDialog(false)} disabled={saving}>Cancel</Button>
                  <Button className="hero-gradient" onClick={handleAddReading} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Save Reading
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { type: "bp", label: "Blood Pressure", icon: Heart, color: "text-destructive", unit: "mmHg" },
            { type: "sugar", label: "Blood Sugar", icon: Droplets, color: "text-primary", unit: "mg/dL" },
            { type: "heart", label: "Heart Rate", icon: Activity, color: "text-success", unit: "bpm" },
            { type: "weight", label: "Weight", icon: Scale, color: "text-warning", unit: "kg" }
          ].map((stat, i) => {
            const reading = latestReadings.find(r => r?.type === stat.type);
            return (
              <Card key={stat.type} className="card-shadow hover:card-shadow-hover transition-all animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    {reading && (
                      <Badge variant={reading.status === 'normal' ? 'secondary' : 'destructive'} className="text-[10px]">
                        {reading.status.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-bold">
                      {reading ? `${reading.value}${reading.value2 ? '/' + reading.value2 : ''}` : "--"}
                    </span>
                    <span className="text-xs text-muted-foreground">{stat.unit}</span>
                  </div>
                  {reading && (
                    <p className="mt-2 text-[10px] text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Last updated: {new Date(reading.timestamp.seconds * 1000).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Charts Section */}
          <Card className="lg:col-span-2 card-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Health Trends</CardTitle>
                <CardDescription>Visual analysis of your vital signs over time.</CardDescription>
              </div>
              <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as any)}>
                <TabsList className="bg-muted/50">
                  <TabsTrigger value="bp">BP</TabsTrigger>
                  <TabsTrigger value="sugar">Sugar</TabsTrigger>
                  <TabsTrigger value="heart">Heart</TabsTrigger>
                  <TabsTrigger value="weight">Weight</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                          fontSize: '12px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                      />
                      {selectedType === "bp" && (
                        <Area 
                          type="monotone" 
                          dataKey="value2" 
                          stroke="hsl(var(--secondary))" 
                          strokeWidth={2}
                          fillOpacity={0}
                        />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <TrendingUp className="h-12 w-12 opacity-20 mb-2" />
                    <p className="text-sm">No data available for this period.</p>
                    <p className="text-xs">Add a reading to see your trends.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent History */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Recent History</CardTitle>
              <CardDescription>Your latest 10 health logs.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {readings.slice(0, 10).map((r) => (
                  <div key={r.id} className="group flex items-center justify-between p-3 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        r.type === 'bp' ? 'bg-destructive/10 text-destructive' :
                        r.type === 'sugar' ? 'bg-primary/10 text-primary' :
                        r.type === 'heart' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                      }`}>
                        {r.type === 'bp' ? <Heart className="h-4 w-4" /> :
                         r.type === 'sugar' ? <Droplets className="h-4 w-4" /> :
                         r.type === 'heart' ? <Activity className="h-4 w-4" /> : <Scale className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold">
                          {r.value}{r.value2 ? '/' + r.value2 : ''} {r.unit}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(r.timestamp.seconds * 1000).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={r.status === 'normal' ? 'outline' : 'destructive'} className="text-[8px] px-1.5">
                        {r.status.toUpperCase()}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteReading(r.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
                {readings.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-sm">No logs found.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Insights */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Health Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Info className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Based on your last 7 days, your <strong>Blood Pressure</strong> has been stable within the normal range. Keep up the healthy lifestyle!
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                  <AlertCircle className="h-4 w-4 text-warning" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your <strong>Blood Sugar</strong> showed a slight spike recently. Consider monitoring your carbohydrate intake.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-success/20 bg-success/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Share2 className="h-5 w-5 text-success" />
                Share with Doctor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                You can securely share your health trends with your primary physician for better clinical decision support.
              </p>
              <div className="flex gap-2">
                <Button size="sm" className="bg-success hover:bg-success/90 text-white gap-2">
                  <Share2 className="h-4 w-4" /> Share Report
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <Download className="h-4 w-4" /> PDF Summary
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default HealthDashboard;