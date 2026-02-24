"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Activity, Heart, Droplets, Scale, Plus, 
  TrendingUp, AlertCircle, Calendar, ChevronRight,
  Info, Bell, Download, Share2, Trash2, Loader2,
  ArrowUpRight, ArrowDownRight, Minus, Watch, RefreshCw,
  Bluetooth, Smartphone, Battery, Signal, X, Search, CheckCircle2, ExternalLink, ShieldCheck
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from "recharts";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, orderBy, onSnapshot, Timestamp, limit, deleteDoc, doc } from "firebase/firestore";
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

const NORMAL_RANGES = {
  bp: { min: 90, max: 120, min2: 60, max2: 80, label: "120/80 mmHg" },
  sugar: { min: 70, max: 140, label: "70-140 mg/dL" },
  heart: { min: 60, max: 100, label: "60-100 bpm" },
  weight: { min: 50, max: 90, label: "Healthy BMI range" }
};

const HealthDashboard = () => {
  const { user } = useAuth();
  const [readings, setReadings] = useState<HealthReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPairing, setIsPairing] = useState(false);
  
  // Bluetooth State
  const [connectedDevice, setConnectedDevice] = useState<any>(null);
  const [discoveredDevice, setDiscoveredDevice] = useState<any>(null);
  const [liveHeartRate, setLiveHeartRate] = useState<number | null>(null);
  const [hasHealthService, setHasHealthService] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("Disconnected");
  
  const lastSyncTimeRef = useRef<number>(0);
  const SYNC_INTERVAL = 30000;

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<"bp" | "sugar" | "weight" | "heart">("bp");
  const [inputValue, setInputValue] = useState("");
  const [inputValue2, setInputValue2] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
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
      }, (error) => {
        console.error("Firestore error:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Setup error:", error);
      setLoading(false);
    }
  }, [user]);

  const getStatus = (type: string, val1: number, val2?: number) => {
    const range = NORMAL_RANGES[type as keyof typeof NORMAL_RANGES];
    if (!range) return "normal";
    
    if (type === "bp" && val2) {
      if (val1 > range.max || val2 > range.max2) return "high";
      if (val1 < range.min || val2 < range.min2) return "low";
      return "normal";
    }
    
    if (val1 > range.max) return "high";
    if (val1 < range.min) return "low";
    return "normal";
  };

  const autoSyncReading = async (value: number, isManualTrigger = false) => {
    const now = Date.now();
    if (!isManualTrigger && (now - lastSyncTimeRef.current < SYNC_INTERVAL)) return;
    if (!user) return;
    
    lastSyncTimeRef.current = now;
    setIsSyncing(true);
    
    try {
      await addDoc(collection(db, "health_readings"), {
        userId: user.uid,
        type: "heart",
        value: value,
        unit: "bpm",
        timestamp: Timestamp.now(),
        status: getStatus("heart", value),
        source: "watch"
      });
      if (isManualTrigger) toast.success("Verified watch reading synced!");
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCharacteristicValueChanged = (event: any) => {
    const value = event.target.value;
    const flags = value.getUint8(0);
    const rate16Bits = flags & 0x1;
    let heartRate = rate16Bits ? value.getUint16(1, true) : value.getUint8(1);
    setLiveHeartRate(heartRate);
    autoSyncReading(heartRate);
  };

  const startDiscovery = async () => {
    const nav = navigator as any;
    if (!nav.bluetooth) {
      toast.error("Web Bluetooth is not supported in this browser.");
      return;
    }

    setIsPairing(true);
    setDiscoveredDevice(null);
    setConnectionStatus("Scanning...");
    
    try {
      const device = await nav.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['heart_rate', '0000180d-0000-1000-8000-00805f9b34fb']
      });
      setDiscoveredDevice(device);
      setConnectionStatus("Device Found");
    } catch (error: any) {
      setConnectionStatus("Discovery Failed");
      if (error.name !== 'NotFoundError') toast.error("Discovery failed");
    } finally {
      setIsPairing(false);
    }
  };

  const connectToDevice = async (device: any) => {
    setIsPairing(true);
    setConnectionStatus("Connecting...");
    try {
      const server = await device.gatt?.connect();
      if (!server) throw new Error("GATT connection failed");

      let service;
      try {
        service = await server.getPrimaryService('heart_rate');
      } catch (e) {
        try {
          service = await server.getPrimaryService('0000180d-0000-1000-8000-00805f9b34fb');
        } catch (e2) {}
      }

      if (service) {
        const characteristic = await service.getCharacteristic('heart_rate_measurement');
        await characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
        setHasHealthService(true);
        setConnectionStatus("Live Stream Active");
        toast.success("Connected to live stream!");
      } else {
        setHasHealthService(false);
        setConnectionStatus("Restricted Access");
        toast.warning("Connected, but data is restricted.");
      }

      setConnectedDevice(device);
      setDiscoveredDevice(null);
      device.addEventListener('gattserverdisconnected', () => {
        setConnectedDevice(null);
        setLiveHeartRate(null);
        setHasHealthService(false);
        setConnectionStatus("Disconnected");
      });
    } catch (error: any) {
      setConnectionStatus("Connection Error");
      toast.error("Failed to connect");
    } finally {
      setIsPairing(false);
    }
  };

  const handleAddReading = async () => {
    if (!user || !inputValue) return;
    setSaving(true);
    const val1 = parseFloat(inputValue);
    const val2 = inputValue2 ? parseFloat(inputValue2) : undefined;
    
    try {
      await addDoc(collection(db, "health_readings"), {
        userId: user.uid,
        type: selectedType,
        value: val1,
        value2: val2,
        unit: selectedType === "bp" ? "mmHg" : selectedType === "sugar" ? "mg/dL" : selectedType === "weight" ? "kg" : "bpm",
        timestamp: Timestamp.now(),
        status: getStatus(selectedType, val1, val2),
        source: connectedDevice && selectedType === "heart" ? "watch" : "manual"
      });
      toast.success("Reading saved");
      setShowAddDialog(false);
      setInputValue("");
      setInputValue2("");
    } catch (error) {
      toast.error("Failed to save reading");
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

  return (
    <Layout>
      <div className="container py-8 max-w-6xl">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl hero-gradient text-white shadow-lg shadow-primary/20">
                <Activity className="h-5 w-5" />
              </div>
              Health Vitals
            </h1>
            <p className="mt-1 text-muted-foreground">Real-time monitoring and historical health trends.</p>
          </div>
          
          <div className="flex items-center gap-2">
            {!connectedDevice ? (
              <Button variant="outline" className="gap-2 border-primary/30 text-primary rounded-xl" onClick={startDiscovery} disabled={isPairing}>
                {isPairing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bluetooth className="h-4 w-4" />}
                Pair Watch
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`${hasHealthService ? 'bg-success/5 text-success border-success/20' : 'bg-warning/5 text-warning border-warning/20'} px-3 py-1.5 gap-2 rounded-full`}>
                  <div className={`h-2 w-2 rounded-full ${hasHealthService ? 'bg-success animate-pulse' : 'bg-warning'}`} />
                  {connectionStatus}
                </Badge>
                <Button variant="ghost" size="icon" onClick={() => connectedDevice.gatt.disconnect()} className="text-destructive rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Button className="hero-gradient gap-2 rounded-xl shadow-lg shadow-primary/20" onClick={() => { setSelectedType("bp"); setShowAddDialog(true); }}>
              <Plus className="h-4 w-4" /> Log Vital
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 mb-8">
          <Card className="lg:col-span-4 border-primary/10 bg-primary/5 card-shadow rounded-[2rem] overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6">
              {connectedDevice ? (
                <Badge className={`${hasHealthService ? 'bg-success' : 'bg-warning'} text-white gap-1 ${hasHealthService ? 'animate-pulse' : ''} rounded-full px-3`}>
                  <div className="h-1.5 w-1.5 rounded-full bg-white" /> {hasHealthService ? 'LIVE' : 'RESTRICTED'}
                </Badge>
              ) : <Badge variant="outline" className="text-muted-foreground rounded-full">OFFLINE</Badge>}
            </div>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Watch className="h-5 w-5 text-primary" /> Smart Stream</CardTitle>
              <CardDescription>{connectedDevice?.name || "Connect a wearable device"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {connectedDevice ? (
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-white/20">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live Heart Rate</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-extrabold tracking-tighter text-primary">{liveHeartRate || "--"}</span>
                      <span className="text-sm font-bold text-muted-foreground">bpm</span>
                    </div>
                  </div>
                  <Heart className={`h-12 w-12 text-destructive ${liveHeartRate ? 'animate-pulse' : 'opacity-20'}`} />
                </div>
              ) : discoveredDevice ? (
                <div className="p-4 rounded-2xl bg-white border border-primary/10 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bluetooth className="h-5 w-5 text-primary" />
                    <p className="text-sm font-bold">{discoveredDevice.name || 'Wearable'}</p>
                  </div>
                  <Button size="sm" className="hero-gradient rounded-xl" onClick={() => connectToDevice(discoveredDevice)}>Connect</Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="h-8 w-8 text-primary/40" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">Pair your boAt, Apple, or Samsung watch to stream live vitals.</p>
                  <Button className="w-full hero-gradient rounded-xl shadow-lg" onClick={startDiscovery} disabled={isPairing}>
                    {isPairing ? "Scanning..." : "Start Discovery"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="lg:col-span-8 grid gap-4 md:grid-cols-2">
            {[
              { type: "bp", label: "Blood Pressure", icon: Heart, color: "text-destructive", unit: "mmHg" },
              { type: "sugar", label: "Blood Sugar", icon: Droplets, color: "text-primary", unit: "mg/dL" },
              { type: "heart", label: "Heart Rate", icon: Activity, color: "text-success", unit: "bpm" },
              { type: "weight", label: "Body Weight", icon: Scale, color: "text-warning", unit: "kg" }
            ].map((stat) => {
              const reading = latestReadings.find(r => r?.type === stat.type);
              const range = NORMAL_RANGES[stat.type as keyof typeof NORMAL_RANGES];
              return (
                <Card key={stat.type} className="card-shadow rounded-[2rem] border-border/50 hover:border-primary/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2.5 rounded-xl bg-muted ${stat.color} shadow-sm`}><stat.icon className="h-5 w-5" /></div>
                      <div className="text-right">
                        <Badge variant="outline" className={`text-[9px] font-bold uppercase tracking-tighter rounded-full ${reading?.status === 'normal' ? 'bg-success/5 text-success border-success/20' : reading?.status === 'high' ? 'bg-destructive/5 text-destructive border-destructive/20' : 'bg-muted text-muted-foreground'}`}>
                          {reading?.status || "No Data"}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold tracking-tight">{reading ? `${reading.value}${reading.value2 ? '/' + reading.value2 : ''}` : "--"}</span>
                      <span className="text-xs font-bold text-muted-foreground">{stat.unit}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-dashed flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Normal Range</span>
                      <span className="text-[10px] font-extrabold text-primary">{range.label}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 card-shadow rounded-[2rem] border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Historical Trends</CardTitle>
                <CardDescription>Visualizing your health progress over time</CardDescription>
              </div>
              <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as any)}>
                <TabsList className="h-9 rounded-xl bg-muted/50 p-1">
                  {["bp", "sugar", "heart"].map(t => <TabsTrigger key={t} value={t} className="text-[10px] uppercase font-bold rounded-lg px-3">{t}</TabsTrigger>)}
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full pt-4">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                        itemStyle={{ fontWeight: 700, fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#colorVal)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-muted-foreground text-sm border-2 border-dashed rounded-2xl bg-muted/20">
                    <TrendingUp className="h-10 w-10 opacity-20 mb-2" />
                    <p className="font-bold">No historical data available</p>
                    <p className="text-xs">Log your first vital to see trends.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow rounded-[2rem] border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Recent Logs</CardTitle>
              <CardDescription>Your last 30 readings</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[320px] pr-4">
                <div className="space-y-3">
                  {readings.map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/30 border border-border/50 group hover:bg-white hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-white shadow-sm ${r.type === 'bp' ? 'text-destructive' : r.type === 'sugar' ? 'text-primary' : 'text-success'}`}>
                          {r.type === 'bp' ? <Heart className="h-4 w-4" /> : r.type === 'sugar' ? <Droplets className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold capitalize">{r.type}</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">
                            {r.timestamp?.seconds ? new Date(r.timestamp.seconds * 1000).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '...'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-extrabold">{r.value}{r.value2 ? '/' + r.value2 : ''} <span className="text-[10px] text-muted-foreground font-bold">{r.unit}</span></p>
                          <Badge variant="outline" className={`text-[8px] h-4 px-1.5 rounded-full ${r.status === 'normal' ? 'text-success border-success/20' : 'text-destructive border-destructive/20'}`}>{r.status}</Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteReading(r.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {readings.length === 0 && (
                    <div className="text-center py-12">
                      <Activity className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground font-bold">No readings found.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="rounded-[2.5rem] p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Plus className="h-6 w-6 text-primary" />
                Log New Vital
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "bp", label: "BP", icon: Heart },
                  { id: "sugar", label: "Sugar", icon: Droplets },
                  { id: "heart", label: "Heart", icon: Activity },
                  { id: "weight", label: "Weight", icon: Scale }
                ].map(t => (
                  <Button 
                    key={t.id} 
                    variant={selectedType === t.id ? "default" : "outline"} 
                    onClick={() => setSelectedType(t.id as any)} 
                    className={`capitalize rounded-xl h-12 gap-2 font-bold ${selectedType === t.id ? 'hero-gradient border-none' : ''}`}
                  >
                    <t.icon className="h-4 w-4" />
                    {t.label}
                  </Button>
                ))}
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-bold text-sm ml-1">{selectedType === "bp" ? "Systolic (Upper)" : "Value"}</Label>
                  <Input 
                    type="number" 
                    placeholder={selectedType === "bp" ? "120" : selectedType === "heart" ? "72" : "Value"}
                    className="h-12 rounded-xl border-border/50 text-lg font-bold"
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)} 
                  />
                </div>
                {selectedType === "bp" && (
                  <div className="space-y-2">
                    <Label className="font-bold text-sm ml-1">Diastolic (Lower)</Label>
                    <Input 
                      type="number" 
                      placeholder="80"
                      className="h-12 rounded-xl border-border/50 text-lg font-bold"
                      value={inputValue2} 
                      onChange={(e) => setInputValue2(e.target.value)} 
                    />
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-3">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Your data is encrypted and stored securely. Normal range for <strong>{selectedType.toUpperCase()}</strong> is <strong>{NORMAL_RANGES[selectedType as keyof typeof NORMAL_RANGES].label}</strong>.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button className="hero-gradient w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20" onClick={handleAddReading} disabled={saving}>
                {saving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : "Save Reading"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default HealthDashboard;