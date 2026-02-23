'} for greater-than symbols in the troubleshooting section.">
"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Activity, Heart, Droplets, Scale, Plus, 
  TrendingUp, AlertCircle, Calendar, ChevronRight,
  Info, Bell, Download, Share2, Trash2, Loader2,
  ArrowUpRight, ArrowDownRight, Minus, Watch, RefreshCw,
  Bluetooth, Smartphone, Battery, Signal, X, Search, CheckCircle2, ExternalLink
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  
  // Bluetooth State
  const [connectedDevice, setConnectedDevice] = useState<any>(null);
  const [discoveredDevice, setDiscoveredDevice] = useState<any>(null);
  const [liveHeartRate, setLiveHeartRate] = useState<number | null>(null);
  const [hasHealthService, setHasHealthService] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("Disconnected");
  
  // Refs for auto-sync logic
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
        status: value > 100 ? "high" : value < 60 ? "low" : "normal",
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
        toast.warning("Connected, but data is restricted.", {
          description: "Check the Troubleshooting section for boAt Ultraprime instructions."
        });
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

  const handleVerifiedSync = () => {
    setSelectedType("heart");
    setInputValue("");
    setShowAddDialog(true);
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
              <div className="flex h-10 w-10 items-center justify-center rounded-xl hero-gradient text-white">
                <Activity className="h-5 w-5" />
              </div>
              Real-time Vitals
            </h1>
            <p className="mt-1 text-muted-foreground">Connect your physical smart watch via Bluetooth.</p>
          </div>
          
          <div className="flex items-center gap-2">
            {!connectedDevice ? (
              <Button variant="outline" className="gap-2 border-primary/30 text-primary" onClick={startDiscovery} disabled={isPairing}>
                {isPairing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bluetooth className="h-4 w-4" />}
                Pair Smart Watch
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`${hasHealthService ? 'bg-success/5 text-success border-success/20' : 'bg-warning/5 text-warning border-warning/20'} px-3 py-1.5 gap-2`}>
                  <div className={`h-2 w-2 rounded-full ${hasHealthService ? 'bg-success animate-pulse' : 'bg-warning'}`} />
                  {connectionStatus}
                </Badge>
                <Button variant="ghost" size="icon" onClick={() => connectedDevice.gatt.disconnect()} className="text-destructive">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Button className="hero-gradient gap-2" onClick={() => { setSelectedType("bp"); setShowAddDialog(true); }}>
              <Plus className="h-4 w-4" /> Manual Log
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 mb-8">
          <Card className="lg:col-span-4 border-primary/20 bg-primary/5 card-shadow overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4">
              {connectedDevice ? (
                <Badge className={`${hasHealthService ? 'bg-success' : 'bg-warning'} text-white gap-1 ${hasHealthService ? 'animate-pulse' : ''}`}>
                  <div className="h-1.5 w-1.5 rounded-full bg-white" /> {hasHealthService ? 'LIVE' : 'RESTRICTED'}
                </Badge>
              ) : <Badge variant="outline" className="text-muted-foreground">OFFLINE</Badge>}
            </div>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Watch className="h-5 w-5 text-primary" /> Live Stream</CardTitle>
              <CardDescription>{connectedDevice?.name || "No device connected"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {connectedDevice ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-muted-foreground uppercase">Heart Rate</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold tracking-tighter">{liveHeartRate || "--"}</span>
                        <span className="text-sm text-muted-foreground">bpm</span>
                      </div>
                    </div>
                    <Heart className={`h-10 w-10 text-destructive ${liveHeartRate ? 'animate-pulse' : 'opacity-20'}`} />
                  </div>
                  {!hasHealthService && (
                    <Button variant="outline" className="w-full gap-2 border-primary/30 text-primary" onClick={handleVerifiedSync}>
                      <RefreshCw className="h-4 w-4" /> Verified Manual Sync
                    </Button>
                  )}
                </>
              ) : discoveredDevice ? (
                <div className="p-4 rounded-xl bg-white border border-primary/20 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bluetooth className="h-5 w-5 text-primary" />
                    <p className="text-sm font-bold">{discoveredDevice.name || 'Wearable'}</p>
                  </div>
                  <Button size="sm" className="hero-gradient" onClick={() => connectToDevice(discoveredDevice)}>Connect</Button>
                </div>
              ) : (
                <Button className="w-full hero-gradient" onClick={startDiscovery} disabled={isPairing}>
                  {isPairing ? "Scanning..." : "Start Discovery"}
                </Button>
              )}
            </CardContent>
          </Card>

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
                  {["bp", "sugar", "heart"].map(t => <TabsTrigger key={t} value={t} className="text-xs uppercase">{t}</TabsTrigger>)}
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
                ) : <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No historical data</div>}
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader><CardTitle className="text-lg">Troubleshooting</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-[10px] text-muted-foreground leading-relaxed">
              <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
                <p className="font-bold text-warning uppercase mb-2">boAt Ultraprime Fix</p>
                <ul className="space-y-2 list-disc pl-3">
                  <li><strong>boAt Crest App:</strong> Go to Settings {' > '} Health Monitoring {' > '} Enable "Continuous Heart Rate".</li>
                  <li><strong>Bluetooth:</strong> Unpair the watch from your phone's system Bluetooth settings (Forget Device) so the browser can take control.</li>
                  <li><strong>Visibility:</strong> Ensure the watch is not currently connected to another fitness app like Strava.</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="font-bold text-primary uppercase mb-2">General Tips</p>
                <ul className="space-y-2 list-disc pl-3">
                  <li>Ensure watch is in Pairing Mode.</li>
                  <li>Check browser Bluetooth permissions.</li>
                  <li>Web Bluetooth requires Chrome or Edge.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader><DialogTitle>{connectedDevice && selectedType === "heart" ? "Verified Watch Sync" : "New Health Reading"}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              {!(connectedDevice && selectedType === "heart") && (
                <div className="grid grid-cols-2 gap-2">
                  {["bp", "sugar", "heart", "weight"].map(t => (
                    <Button key={t} variant={selectedType === t ? "default" : "outline"} onClick={() => setSelectedType(t as any)} className="capitalize">{t}</Button>
                  ))}
                </div>
              )}
              <div className="space-y-2">
                <Label>{selectedType === "bp" ? "Systolic" : selectedType === "heart" ? "Current Heart Rate" : "Value"}</Label>
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
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Sync Reading"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default HealthDashboard;