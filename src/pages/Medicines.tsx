"use client";

import { useState, useMemo } from "react";
import { ShoppingCart, Pill, AlertTriangle, CheckCircle2, X, Sparkles, FileText, ShieldCheck, Search, ArrowRight, RefreshCw } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { medicines, medicineCategories, type Medicine, type Pharmacy } from "@/data/mockData";
import { generateNotificationMessage } from "@/utils/notificationEngine";
import PrescriptionUpload from "@/components/PrescriptionUpload";
import MedicinePriceComparison from "@/components/MedicinePriceComparison";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const Medicines = () => {
  const { user } = useAuth();
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<{ medicine: Medicine; qty: number; pharmacy?: Pharmacy; prescriptionUrl?: string; dosage?: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [address, setAddress] = useState("");
  const [smartInput, setSmartInput] = useState("");
  
  // Comparison Flow State
  const [comparingMedicine, setComparingMedicine] = useState<Medicine | null>(null);
  const [showComparisonDialog, setShowComparisonDialog] = useState(false);

  // Prescription Flow State
  const [pendingMedicine, setPendingMedicine] = useState<Medicine | null>(null);
  const [showPrescriptionDialog, setShowPrescriptionDialog] = useState(false);

  const filtered = category === "All" ? medicines : medicines.filter((m) => m.category === category);

  const handleMedicineClick = (m: Medicine) => {
    if (m.prices && m.prices.length > 0) {
      setComparingMedicine(m);
      setShowComparisonDialog(true);
    } else {
      addToCart(m);
    }
  };

  const addToCart = (m: Medicine, quantity: number = 1, pharmacy?: Pharmacy, prescriptionUrl?: string) => {
    if (m.requiresPrescription && !prescriptionUrl) {
      setPendingMedicine(m);
      setShowPrescriptionDialog(true);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((c) => c.medicine.id === m.id);
      if (existing) return prev.map((c) => c.medicine.id === m.id ? { ...c, qty: c.qty + quantity, pharmacy: pharmacy || c.pharmacy, prescriptionUrl: prescriptionUrl || c.prescriptionUrl } : c);
      return [...prev, { medicine: m, qty: quantity, pharmacy, prescriptionUrl, dosage: 1 }]; // Default dosage 1/day
    });
    
    setShowComparisonDialog(false);
    setShowPrescriptionDialog(false);
    setPendingMedicine(null);
    setComparingMedicine(null);
    
    toast.success(`Added ${m.name} to cart`, {
      description: pharmacy ? `Sourced from ${pharmacy.name}` : undefined
    });
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((c) => c.medicine.id !== id));

  const billing = useMemo(() => {
    const subtotal = cart.reduce((sum, c) => sum + c.medicine.price * c.qty, 0);
    const tax = Math.round(subtotal * 0.05);
    const discount = subtotal > 500 ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal + tax - discount;
    return { subtotal, tax, discount, total };
  }, [cart]);

  const handleOrder = async () => {
    if (address.trim() && cart.length > 0 && user) {
      const orderId = Date.now().toString(36).toUpperCase();
      
      // Save active prescriptions for AI refill tracking
      try {
        for (const item of cart) {
          await addDoc(collection(db, "active_prescriptions"), {
            userId: user.uid,
            medicineId: item.medicine.id,
            medicineName: item.medicine.name,
            dosagePerDay: item.dosage || 1,
            totalQuantity: item.qty * 10, // Assuming 10 tablets per pack
            startDate: Timestamp.now(),
            lastRefillDate: Timestamp.now(),
            orderId
          });
        }
      } catch (e) {
        console.error("Error saving refill data:", e);
      }

      const msg = generateNotificationMessage("ORDER_CONFIRMED", { id: orderId });
      window.dispatchEvent(new CustomEvent("wellcare-notification", { 
        detail: { ...msg, type: "ORDER_CONFIRMED" } 
      }));

      setOrdered(true);
      setShowCart(false);
    }
  };

  return (
    <Layout cartCount={cart.length} onCartClick={() => setShowCart(true)}>
      <div className="container py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-heading font-bold">Order Medicines</h1>
            <p className="mt-1 text-muted-foreground">Compare prices across pharmacies and enable AI refill tracking.</p>
          </div>
          <Button variant="outline" className="gap-2 border-primary/20 text-primary bg-primary/5" asChild>
            <a href="/refills"><RefreshCw className="h-4 w-4" /> Manage AI Refills</a>
          </Button>
        </div>

        <div className="mb-8 rounded-xl border border-primary/20 bg-accent/5 p-4 shadow-sm animate-fade-in">
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <div className="relative flex-1">
              <Sparkles className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              <Input 
                placeholder="Smart Order: 'Add 2 Paracetamol'..." 
                className="pl-10"
                value={smartInput}
                onChange={(e) => setSmartInput(e.target.value)}
              />
            </div>
            <Button type="submit" className="hero-gradient">Add to Cart</Button>
          </form>
        </div>

        <div className="mb-6 flex flex-wrap gap-2 animate-fade-in">
          {medicineCategories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                category === c ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:border-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((m) => (
              <div key={m.id} className="rounded-xl border bg-card p-5 card-shadow transition-all hover:card-shadow-hover group">
                <div className="flex items-center gap-2 mb-3">
                  <Pill className="h-4 w-4 text-primary" />
                  <Badge variant={m.requiresPrescription ? "destructive" : "secondary"} className="text-[10px]">
                    {m.requiresPrescription ? "Prescription Required" : "OTC"}
                  </Badge>
                </div>
                <h3 className="font-heading font-semibold">{m.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{m.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-lg font-bold">₹{m.price}</span>
                    <p className="text-[9px] text-success font-bold">Compare & Save</p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleMedicineClick(m)}
                    variant={m.requiresPrescription ? "outline" : "default"}
                    className={m.requiresPrescription ? "border-destructive/50 text-destructive hover:bg-destructive/5" : "hero-gradient"}
                  >
                    {m.requiresPrescription ? <FileText className="mr-1 h-3 w-3" /> : <Search className="mr-1 h-3 w-3" />}
                    {m.requiresPrescription ? "Upload Rx" : "Compare"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-2xl bg-muted/20">
            <Pill className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-bold text-muted-foreground">No medicines found</h3>
            <p className="text-sm text-muted-foreground max-w-xs mt-2">
              We couldn't find any medicines in the "{category}" category. Try another filter.
            </p>
            <Button variant="link" className="mt-4 text-primary" onClick={() => setCategory("All")}>
              View All Medicines
            </Button>
          </div>
        )}

        {/* Price Comparison Dialog */}
        <Dialog open={showComparisonDialog} onOpenChange={setShowComparisonDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Price Comparison: {comparingMedicine?.name}
              </DialogTitle>
            </DialogHeader>
            {comparingMedicine && (
              <MedicinePriceComparison 
                medicine={comparingMedicine}
                onSelect={(pharmacy, price, discount) => addToCart(comparingMedicine, 1, pharmacy)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Prescription Upload Dialog */}
        <Dialog open={showPrescriptionDialog} onOpenChange={setShowPrescriptionDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Prescription</DialogTitle>
            </DialogHeader>
            {pendingMedicine && (
              <PrescriptionUpload 
                medicineName={pendingMedicine.name}
                onUploadComplete={(url) => addToCart(pendingMedicine, 1, undefined, url)}
                onCancel={() => {
                  setShowPrescriptionDialog(false);
                  setPendingMedicine(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showCart} onOpenChange={setShowCart}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Your Cart</DialogTitle></DialogHeader>
            {cart.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cart.map((c) => (
                    <div key={c.medicine.id} className="flex flex-col rounded-lg border p-3 gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold">{c.medicine.name}</p>
                            {c.pharmacy && (
                              <Badge variant="outline" className="h-4 px-1 text-[8px] bg-primary/5 text-primary border-primary/20">
                                {c.pharmacy.name}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{c.qty} × ₹{c.medicine.price}</p>
                        </div>
                        <button onClick={() => removeFromCart(c.medicine.id)}><X className="h-4 w-4 text-muted-foreground" /></button>
                      </div>
                      <div className="flex items-center gap-4 pt-2 border-t border-dashed">
                        <div className="flex-1 space-y-1">
                          <Label className="text-[9px] uppercase font-bold text-muted-foreground">Daily Dosage (for AI Refill)</Label>
                          <div className="flex items-center gap-2">
                            <Input 
                              type="number" 
                              className="h-7 text-xs w-16" 
                              value={c.dosage} 
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setCart(prev => prev.map(item => item.medicine.id === c.medicine.id ? { ...item, dosage: val } : item));
                              }}
                            />
                            <span className="text-[10px] text-muted-foreground">tablets / day</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-2 rounded-xl bg-muted/50 p-4 border border-dashed">
                  <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{billing.subtotal}</span></div>
                  <div className="flex justify-between text-sm"><span>Tax (5%)</span><span>₹{billing.tax}</span></div>
                  {billing.discount > 0 && <div className="flex justify-between text-sm text-success"><span>Discount</span><span>-₹{billing.discount}</span></div>}
                  <div className="border-t pt-2 flex justify-between font-bold text-lg text-primary"><span>Total</span><span>₹{billing.total}</span></div>
                </div>
                <div className="space-y-3 mt-4">
                  <Label>Delivery Address</Label>
                  <Input placeholder="Enter address" value={address} onChange={(e) => setAddress(e.target.value)} />
                  <Button className="w-full hero-gradient" onClick={handleOrder} disabled={!address.trim()}>Place Order</Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={ordered} onOpenChange={(o) => { setOrdered(o); if (!o) setCart([]); }}>
          <DialogContent>
            <DialogHeader><DialogTitle className="text-success flex items-center gap-2"><CheckCircle2 /> Order Placed!</DialogTitle></DialogHeader>
            <p className="text-sm text-muted-foreground">Your order has been confirmed. AI Refill tracking has been enabled for these medicines.</p>
            <Button className="w-full mt-4" onClick={() => setOrdered(false)}>Close</Button>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Medicines;