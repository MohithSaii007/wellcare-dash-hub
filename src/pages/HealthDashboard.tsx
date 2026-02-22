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
  
  // Bluetooth State
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [discoveredDevice, setDiscoveredDevice] = useState<BluetoothDevice | null>(null);
  const [liveHeartRate, setLiveHeartRate] = useState<number | null>(null);
  const [hasHealthService, setHasHealthService] = useState<boolean>(false);
  
  // Refs for auto-sync logic
  const lastSyncTimeRef = useRef<number>(0);
  const SYNC_INTERVAL = 30000; // Sync every 30 seconds

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<"bp" | "sugar" | "weight" | "heart">("bp");
  const [inputValue, setInputValue] = useState("");
  const [inputValue2, setInputValue2] = useState("");

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

  // Automatic Sync Logic
  const autoSyncReading = async (value: number) => {
    const now = Date.now();
    if (now - lastSyncTimeRef.current < SYNC_INTERVAL) return;
    
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
    } catch (error) {
      console.error("Auto-sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Bluetooth Data Parser
  const handleCharacteristicValueChanged = (event: any) => {
    const value = event.target.value;
    const flags = value.getUint8(0);
    const rate16Bits = flags & 0x1;
    let heartRate;
    if (rate16Bits) {
      heartRate = value.getUint16(1, true);
    } else {
      heartRate = value.getUint8(1);
    }
    
    setLiveHeartRate(heartRate);
    autoSyncReading(heartRate);
  };

  const startDiscovery = async () => {
    if (!navigator.bluetooth) {
      toast.error("Web Bluetooth is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    setIsPairing(true);
    setDiscoveredDevice(null);
    
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          'heart_rate', 
          'battery_service', 
          'device_information', 
          'blood_pressure', 
          'glucose',
          '0000180d-0000-1000-8000-00805f9b34fb' // Standard HR UUID
        ]
      });
      
      setDiscoveredDevice(device);
      toast.success("Device found!", {
        description: `Identified ${device.name || 'Smart Wearable'}. Click connect to verify health services.`
      });
    } catch (error: any) {
      console.error("Bluetooth Discovery Error:", error);
      if (error.name === 'NotFoundError') {
        toast.info("Discovery cancelled.");
      } else {
        toast.error("Discovery failed", {
          description: "Ensure Bluetooth is ON and your device is nearby."
        });
      }
    } finally {
      setIsPairing(false);
    }
  };

  const connectToDevice = async (device: BluetoothDevice) => {
    setIsPairing(true);
    setHasHealthService(false);
    try {
      toast.info(`Connecting to ${device.name || 'Wearable'}...`);
      
      const server = await device.gatt?.connect();
      if (!server) throw new Error("Could not establish GATT connection");

      // Try to find a supported health service
      let service;
      try {
        // Try standard heart rate first
        service = await server.getPrimaryService('heart_rate');
      } catch (e) {
        console.log("Standard HR service not found, checking for generic health data...");
      }

      if (service) {
        const characteristic = await service.getCharacteristic('heart_rate_measurement');
        await characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
        setHasHealthService(true);
        toast.success("Connected! Live heart rate stream active.");
      } else {
        // Fallback: Check if it's at least a connected device we can use for manual triggers
        setHasHealthService(false);
        toast.warning("Connected, but health data is restricted.", {
          description: "Your watch is connected, but it's not sharing heart rate data with the browser. Check your watch settings for 'Broadcast Heart Rate'."
        });
      }

      setConnectedDevice(device);
      setDiscoveredDevice(null);
      
      device.addEventListener('gattserverdisconnected', () => {
        setConnectedDevice(null);
        setLiveHeartRate(null);
        setHasHealthService(false);
        toast.error("Device disconnected");
      });

    } catch (error: any) {
      console.error("Connection Error:", error);
      toast.error("Pairing Error", {
        description: error.message || "Failed to connect. Ensure the device isn't connected to another app."
      });
    } finally {
      setIsPairing(false);
    }
  };

  const handleDisconnect = () => {
    if (connectedDevice?.gatt?.connected) {
      connectedDevice.gatt.disconnect();
    }
    setConnectedDevice(null);
    setLiveHeartRate(null);
    setDiscoveredDevice(null);
    setHasHealthService(false);
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
                  {hasHealthService ? 'Auto-sync Active' : 'Restricted Access'}
                </Badge>
                <Button variant="ghost" size="icon" onClick={handleDisconnect} className="text-destructive">
                  <X className="h-4 w-4" />
                </Button>
              </div>
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
                <Badge className={`${hasHealthService ? 'bg-success' : 'bg-warning'} text-white gap-1 ${hasHealthService ? 'animate-pulse' : ''}`}>
                  <div className="h-1.5 w-1.5 rounded-full bg-white" /> {hasHealthService ? 'LIVE' : 'PAIRED'}
                </Badge>
              ) : isPairing ? (
                <Badge variant="outline" className="text-primary animate-pulse">SCANNING</Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">OFFLINE</Badge>
              )}
            </div>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Watch className="h-5 w-5 text-primary" />
                Live Stream
              </CardTitle>
              <CardDescription>{connectedDevice?.name || (connectedDevice ? "Smart Wearable" : "No device connected")}</CardDescription>
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
                    <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                      <p className="text-[10px] text-warning font-bold uppercase mb-1">Compatibility Note</p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Your device is connected but not sharing heart rate data. Go to your watch settings and enable <strong>"Broadcast Heart Rate"</strong> or <strong>"Heart Rate Sharing"</strong>.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-muted-foreground uppercase">Sync Status</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold tracking-tighter">
                          {isSyncing ? "Syncing to Cloud..." : hasHealthService ? "Auto-sync Active" : "Waiting for data..."}
                        </span>
                      </div>
                    </div>
                    {isSyncing ? <RefreshCw className="h-10 w-10 text-primary animate-spin" /> : <Signal className="h-10 w-10 text-primary" />}
                  </div>
                </>
              ) : discoveredDevice ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-xl bg-white border border-primary/20 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <Bluetooth className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{discoveredDevice.name || 'Smart Wearable'}</p>
                          <p className="text-[10px] text-muted-foreground">Ready to connect</p>
                        </div>
                      </div>
                      <Button size="sm" className="hero-gradient" onClick={() => connectToDevice(discoveredDevice)}>
                        Connect
                      </Button>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setDiscoveredDevice(null)}>
                    Cancel
                  </Button>
                </div>
              ) : isPairing ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                  <div className="relative">
                    <Search className="h-12 w-12 text-primary animate-pulse" />
                    <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                  </div>
                  <p className="text-sm font-medium text-primary">Scanning for all devices...</p>
                  <p className="text-[10px] text-muted-foreground text-center px-4">
                    A browser popup should appear. You can now select <strong>any</strong> nearby Bluetooth device.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <Bluetooth className="h-12 w-12 text-muted-foreground/20 mb-2" />
                    <p className="text-sm text-muted-foreground">No active connection</p>
                  </div>
                  <Button className="w-full hero-gradient" onClick={startDiscovery}>
                    Start Discovery
                  </Button>
                </div>
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
            <CardHeader><CardTitle className="text-lg">Troubleshooting</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
                <div className="flex items-center gap-2 text-[10px] font-bold text-warning uppercase mb-2">
                  <AlertCircle className="h-3 w-3" />
                  Connection Tips
                </div>
                <ul className="text-[10px] text-muted-foreground space-y-2 list-disc pl-3">
                  <li>Ensure your watch is in <strong>Pairing Mode</strong>.</li>
                  <li>Check if your browser has <strong>Bluetooth Permissions</strong> enabled.</li>
                  <li>If the popup doesn't appear, try opening the app in a <strong>New Tab</strong>.</li>
                  <li>Web Bluetooth requires <strong>Chrome, Edge, or Opera</strong>.</li>
                </ul>
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
                <Button variant="ghost" className="w-full text-destructive hover:bg-destructive/5" onClick={handleDisconnect}>
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