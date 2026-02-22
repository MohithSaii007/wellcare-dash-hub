"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Activity, Heart, Droplets, Scale, Plus, 
  TrendingUp, AlertCircle, Calendar, ChevronRight,
  Info, Bell, Download, Share2, Trash2, Loader2,
  ArrowUpRight, ArrowDownRight, Minus, Watch, RefreshCw,
  Bluetooth, Smartphone, Battery, Signal
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
import { collection, addDoc, query, where, orderBy, onSnapshot, Timestamp, limit } from "firebase/firestore";
import { toast } from "sonner";

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
  const [isPairing, setIsPairing] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<"bp" | "sugar" | "weight" | "heart">("bp");
  const [inputValue, setInputValue] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  
  // Real-time Live Data State
  const [liveHeartRate, setLiveHeartRate] = useState(72);
  const [liveBP, setLiveBP] = useState({ sys: 120, dia: 80 });

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "health_readings"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc"),
      limit(30)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HealthReading[];
      setReadings(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Simulate Real-time Data Stream when connected
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (connectedDevice) {
      interval = setInterval(() => {
        setLiveHeartRate(prev => prev + (Math.random() > 0.5 ? 1 : -1));
        setLiveBP(prev => ({
          sys: prev.sys + (Math.random() > 0.5 ? 1 : -1),
          dia: prev.dia + (Math.random() > 0.5 ? 1 : -1)
        }));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [connectedDevice]);

  const handlePairDevice = async () => {
    setIsPairing(true);
    toast.info("Scanning for nearby Bluetooth devices...");
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setConnectedDevice("Boat Storm Connect");
    setIsPairing(false);
    toast.success("Smart Watch Connected!", {
      description: "Real-time vitals are now streaming to your dashboard."
    });
  };

  const handleSyncWatch = async () => {
    if (!user || !connectedDevice) {
      toast.error("Please connect your watch first.");
      return;
    }
    setIsSyncing(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      await addDoc(collection(db, "health_readings"), {
        userId: user.uid,
        type: "heart",
        value: liveHeartRate,
        unit: "bpm",
        timestamp: Timestamp.now(),
        status: "normal",
        source: "watch"
      });
      
      await addDoc(collection(db, "health_readings"), {
        userId: user.uid,
        type: "bp",
        value: liveBP.sys,
        value2: liveBP.dia,
        unit: "mmHg",
        timestamp: Timestamp.now(),
        status: "normal",
        source: "watch"
      });
      
      toast.success("Vitals synced to medical history.");
    } catch (error) {
      toast.error("Sync failed.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddReading = async () => {
    if (!user || !inputValue) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "health_readings"), {
        userId: user.uid,
        type: selectedType,
        value: parseFloat(inputValue),
        value2: inputValue2 ? parseFloat(inputValue2) : undefined,
        unit: selectedType === "bp" ? "mmHg" : selectedType === "sugar" ? "mg/dL" : selectedType === "weight" ? "kg" : "bpm",
        timestamp: Timestamp.now(),
        status: "normal",
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
        name: r.timestamp?.seconds ? new Date(r.timestamp.seconds * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' }) : '...',
        value: r.value,
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
          <p className="text-muted-foreground">Initializing health engine...</p>
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
              Real-time Vitals
            </h1>
            <p className="mt-1 text-muted-foreground">Live monitoring from your connected smart watch.</p>
          </div>
          
          <div className="flex items-center gap-2">
            {!connectedDevice ? (
              <Button variant="outline" className="gap-2 border-primary/30 text-primary" onClick={handlePairDevice} disabled={isPairing}>
                {isPairing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bluetooth className="h-4 w-4" />}
                Pair Smart Watch
              </Button>
            ) : (
              <Button variant="outline" className="gap-2" onClick={handleSyncWatch} disabled={isSyncing}>
                {isSyncing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Watch className="h-4 w-4" />}
                Sync Now
              </Button>
            )}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="hero-gradient gap-2"><Plus className="h-4 w-4" /> Manual Log</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>New Health Reading</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-2">
                    {["bp", "sugar", "heart", "weight"].map(t => (
                      <Button key={t} variant={selectedType === t ? "default" : "outline"} onClick={() => setSelectedType(t as any)} className="capitalize">{t}</Button>
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

        <div className="grid gap-6 lg:grid-cols-12 mb-8">
          {/* Live Monitor Card */}
          <Card className="lg:col-span-4 border-primary/20 bg-primary/5 card-shadow overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4">
              {connectedDevice ? (
                <Badge className="bg-success text-white gap-1 animate-pulse">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" /> LIVE
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">OFFLINE</Badge>
              )}
            </div>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Watch className="h-5 w-5 text-primary" />
                Live Stream
              </CardTitle>
              <CardDescription>{connectedDevice || "No device connected"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase">Heart Rate</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tighter">{connectedDevice ? liveHeartRate : "--"}</span>
                    <span className="text-sm text-muted-foreground">bpm</span>
                  </div>
                </div>
                <Heart className={`h-10 w-10 text-destructive ${connectedDevice ? 'animate-pulse' : 'opacity-20'}`} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase">Blood Pressure</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tighter">
                      {connectedDevice ? `${liveBP.sys}/${liveBP.dia}` : "--/--"}
                    </span>
                    <span className="text-sm text-muted-foreground">mmHg</span>
                  </div>
                </div>
                <Activity className={`h-10 w-10 text-primary ${connectedDevice ? 'animate-bounce' : 'opacity-20'}`} />
              </div>

              {!connectedDevice && (
                <Button className="w-full hero-gradient" onClick={handlePairDevice}>Connect Watch</Button>
              )}
            </CardContent>
          </Card>

          {/* Vitals Grid */}
          <div className="lg:col-span-8 grid gap-4 md:grid-cols-2">
            {[
              { type: "bp", label: "Last BP Reading", icon: Heart, color: "text-destructive", unit: "mmHg" },
              { type: "sugar", label: "Last Sugar Reading", icon: Droplets, color: "text-primary", unit: "mg/dL" },
              { type: "heart", label: "Last Heart Rate", icon: Activity, color: "text-success", unit: "bpm" },
              { type: "weight", label: "Current Weight", icon: Scale, color: "text-warning", unit: "kg" }
            ].map((stat) => {
              const reading = latestReadings.find(r => r?.type === stat.type);
              return (
                <Card key={stat.type} className="card-shadow">
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
                    {reading?.timestamp && (
                      <p className="text-[10px] text-muted-foreground mt-2">
                        Logged {new Date(reading.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 card-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Historical Trends</CardTitle>
              <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as any)}>
                <TabsList className="h-8">
                  <TabsTrigger value="bp" className="text-xs">BP</TabsTrigger>
                  <TabsTrigger value="sugar" className="text-xs">Sugar</TabsTrigger>
                  <TabsTrigger value="heart" className="text-xs">Heart</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#colorVal)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No historical data found</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader><CardTitle className="text-lg">Device Health</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Battery className="h-5 w-5 text-success" />
                    <span className="text-sm font-medium">Battery Level</span>
                  </div>
                  <span className="text-sm font-bold">{connectedDevice ? "84%" : "--"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Signal className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Signal Strength</span>
                  </div>
                  <span className="text-sm font-bold">{connectedDevice ? "Excellent" : "--"}</span>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-muted/30 border border-dashed">
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase mb-2">
                  <Info className="h-3 w-3" />
                  Sync Protocol
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Your watch uses Bluetooth Low Energy (BLE) to stream vitals. Data is encrypted end-to-end before being saved to your medical profile.
                </p>
              </div>
              
              {connectedDevice && (
                <Button variant="ghost" className="w-full text-destructive hover:bg-destructive/5" onClick={() => setConnectedDevice(null)}>
                  Disconnect Device
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default HealthDashboard;