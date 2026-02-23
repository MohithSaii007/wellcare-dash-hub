"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Zap, Calendar, Pill, RefreshCw, 
  AlertCircle, CheckCircle2, ArrowRight,
  Clock, Info, ShoppingCart, Loader2, Bell
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, Timestamp, addDoc } from "firebase/firestore";
import { toast } from "sonner";
import { medicines } from "@/data/mockData";

interface ActivePrescription {
  id: string;
  medicineId: string;
  medicineName: string;
  dosagePerDay: number;
  totalQuantity: number;
  startDate: any;
  lastRefillDate: any;
}

const RefillManagement = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<ActivePrescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [refillingId, setRefillingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "active_prescriptions"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ActivePrescription[];
      setPrescriptions(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const refillCalculations = useMemo(() => {
    return prescriptions.map(p => {
      const startDate = p.lastRefillDate ? p.lastRefillDate.toDate() : p.startDate.toDate();
      const daysSupply = p.totalQuantity / p.dosagePerDay;
      const depletionDate = new Date(startDate);
      depletionDate.setDate(startDate.getDate() + daysSupply);
      
      const today = new Date();
      const daysRemaining = Math.max(0, Math.ceil((depletionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
      const percentRemaining = Math.max(0, Math.min(100, (daysRemaining / daysSupply) * 100));
      
      return {
        ...p,
        depletionDate,
        daysRemaining,
        percentRemaining,
        isLow: daysRemaining <= 5
      };
    });
  }, [prescriptions]);

  const handleOneTapRefill = async (p: any) => {
    if (!user) return;
    setRefillingId(p.id);
    
    try {
      // Reduced delay from 1500ms to 400ms
      await new Promise(resolve => setTimeout(resolve, 400));
      
      toast.success(`Refill ordered for ${p.medicineName}!`, {
        description: "Your supply will be delivered within 2 hours."
      });
    } catch (error) {
      toast.error("Failed to process refill.");
    } finally {
      setRefillingId(null);
    }
  };

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
      <div className="container py-8 max-w-5xl">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl hero-gradient text-white">
                <Zap className="h-5 w-5" />
              </div>
              Smart Refill Prediction
            </h1>
            <p className="mt-1 text-muted-foreground">AI-powered tracking to ensure you never run out of essential medicines.</p>
          </div>
          
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-4 py-1">
            <RefreshCw className="h-3 w-3 mr-2 animate-spin-slow" /> AI Engine Active
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {refillCalculations.map((p, i) => (
            <Card key={p.id} className={`overflow-hidden card-shadow hover:card-shadow-hover transition-all animate-fade-in ${p.isLow ? 'border-destructive/30 ring-1 ring-destructive/10' : ''}`} style={{ animationDelay: `${i * 100}ms` }}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${p.isLow ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                      <Pill className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{p.medicineName}</CardTitle>
                      <CardDescription className="text-[10px] uppercase font-bold">{p.dosagePerDay} dose/day</CardDescription>
                    </div>
                  </div>
                  {p.isLow && (
                    <Badge variant="destructive" className="animate-pulse text-[8px] h-5">LOW STOCK</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Supply Remaining</span>
                    <span className={p.isLow ? 'text-destructive font-bold' : 'text-primary'}>{p.daysRemaining} days</span>
                  </div>
                  <Progress value={p.percentRemaining} className={`h-2 ${p.isLow ? 'bg-destructive/10' : ''}`} />
                </div>

                <div className="grid grid-cols-2 gap-4 py-2 border-y border-dashed">
                  <div className="space-y-1">
                    <p className="text-[9px] text-muted-foreground uppercase font-bold">Depletion Date</p>
                    <p className="text-xs font-bold flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-primary" />
                      {p.depletionDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-muted-foreground uppercase font-bold">Last Refill</p>
                    <p className="text-xs font-bold flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {p.lastRefillDate ? p.lastRefillDate.toDate().toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'N/A'}
                    </p>
                  </div>
                </div>

                <Button 
                  className={`w-full gap-2 ${p.isLow ? 'hero-gradient' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                  disabled={refillingId === p.id}
                  onClick={() => handleOneTapRefill(p)}
                >
                  {refillingId === p.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  One-Tap Refill
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default RefillManagement;