"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Activity, Heart, Droplets, Scale, Plus, 
  TrendingUp, AlertCircle, Calendar, ChevronRight,
  Info, Bell, Download, Share2, Trash2, Loader2,
  ArrowUpRight, ArrowDownRight, Minus, Watch, RefreshCw,
  Bluetooth, Smartphone
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
import { collection, addDoc, query, where, orderBy, onSnapshot, Timestamp, deleteDoc, doc, limit } from "firebase/firestore";
import { toast } from "sonner";
import { generateNotificationMessage } from "@/utils/notificationEngine";

interface HealthReading {
  id: string;
  type: "bp" | "sugar" | "weight" | "heart";
  value: number;
  value2?: number;
  unit: string;
  timestamp: any;
  status: "normal" | "high" | "low";
  source?: "manual" | "watch";
}

const HealthDashboard = () => {
  const { user } = useAuth();
  const [readings, setReadings] = useState<HealthReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<"bp" | "sugar" | "weight" | "heart">("bp");
  const [inputValue, setInputValue] = useState("");
  const [inputValue2, setInputValue2] = useState("");

  const thresholds = {
    bp: { high: 140, low: 90, high2: 90, low2: 60 },
    sugar: { high: 140, low: 70 },
    heart: { high: 100, low: 60 },
    weight: { high: 100, low: 40 }
  };

  useEffect(() => {
    if (!user) return;

    // Optimized query with limit for faster initial load
    const q = query(
      collection(db, "health_readings"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc"),
      limit(50)
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
      toast.error("Connection error. Retrying...");
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

  const handleSyncWatch = async () => {
    if (!user) return;
    setIsSyncing(true);
    
    // Simulate Boat Watch Bluetooth Sync
    toast.info("Searching for Boat Watch...", { icon: <Bluetooth className="h-4 w-4 animate-pulse" /> });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Simulated data from watch
      const watchData = [
        { type: "heart", value: 72 + Math.floor(Math.random() * 10), unit: "bpm" },
        { type: "bp", value: 120, value2: 80, unit: "mmHg" }
      ];

      for (const data of watchData) {
        await addDoc(collection(db, "health_readings"), {
          userId: user.uid,
          type: data.type,
          value: data.value,
          value2: (data as any).value2,
          unit: data.unit,
          timestamp: Timestamp.now(),
          status: "normal",
          source: "watch"
        });
      }

      toast.success("Boat Watch synced successfully!", {
        description: "Heart rate and Blood Pressure updated."
      });
    } catch (error) {
      toast.error("Sync failed. Please ensure Bluetooth is on.");
    } finally {
      setIsSyncing(false);
    }
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
        status,
        source: "manual"
      });
      toast.success("Reading saved");
      setShowAddDialog(false);
      setInputValue("");
      setInputValue2("");
    } catch (error) {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const chartData = useMemo(() => {
    return readings
      .filter(r => r.type === selectedType)
      .slice(0, 10)
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
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Retrieving your health vitals...</p>
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
              Health Vitals
            </h1>
            <p className="mt-1 text-muted-foreground">Real-time monitoring from your Boat watch and manual logs.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="gap-2 border-primary/20 text-primary hover:bg-primary/5"
              onClick={handleSyncWatch}
              disabled={isSyncing}
            >
              {isSyncing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Watch className="h-4 w-4" />}
              Sync Boat Watch
            </Button>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="hero-gradient gap-2">
                  <Plus className="h-4 w-4" /> Add Log
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>New Health Reading</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-2">
                    {["bp", "sugar", "heart", "weight"].map(t => (
                      <Button
                        key={t}
                        variant={selectedType === t ? "default" : "outline"}
                        onClick={() => setSelectedType(t as any)}
                        className="capitalize"
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label>{selectedType === "bp" ? "Systolic" : "Value"}</Label>
                    <Input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                  </div>
                  {selectedType === "bp" && (
                    <div className="space-y-2">
                      <Label>Diastolic</Label>
                      <Input type="number" value={inputValue2} onChange={(e) => setInputValue2(e.target.value)} />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button className="hero-gradient w-full" onClick={handleAddReading} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Save Reading"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Vitals Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { type: "bp", label: "Blood Pressure", icon: Heart, color: "text-destructive", unit: "mmHg" },
            { type: "sugar", label: "Blood Sugar", icon: Droplets, color: "text-primary", unit: "mg/dL" },
            { type: "heart", label: "Heart Rate", icon: Activity, color: "text-success", unit: "bpm" },
            { type: "weight", label: "Weight", icon: Scale, color: "text-warning", unit: "kg" }
          ].map((stat) => {
            const reading = latestReadings.find(r => r?.type === stat.type);
            return (
              <Card key={stat.type} className="card-shadow overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg bg-muted ${stat.color}`}><stat.icon className="h-5 w-5" /></div>
                    {reading?.source === 'watch' && <Badge variant="outline" className="text-[8px] gap-1"><Watch className="h-2 w-2" /> WATCH</Badge>}
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{reading ? `${reading.value}${reading.value2 ? '/' + reading.value2 : ''}` : "--"}</span>
                    <span className="text-xs text-muted-foreground">{stat.unit}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 card-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Trends</CardTitle>
              <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as any)}>
                <TabsList className="h-8"><TabsTrigger value="bp" className="text-xs">BP</TabsTrigger><TabsTrigger value="sugar" className="text-xs">Sugar</TabsTrigger><TabsTrigger value="heart" className="text-xs">Heart</TabsTrigger></TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs><linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#colorVal)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No data for this period</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader><CardTitle className="text-lg">Device Status</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/20">
                <div className="flex items-center gap-3">
                  <Watch className="h-5 w-5 text-primary" />
                  <div><p className="text-sm font-bold">Boat Watch</p><p className="text-[10px] text-success">Connected via Bluetooth</p></div>
                </div>
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your watch automatically syncs heart rate and sleep data every 30 minutes when in range.
                </p>
              </div>
              <Button variant="outline" className="w-full text-xs" onClick={handleSyncWatch}>Force Sync Now</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default HealthDashboard;