"use client";

import { useState, useMemo } from "react";
import { ShoppingCart, Pill, AlertTriangle, CheckCircle2, X, Sparkles, FileText, ShieldCheck, Search, ArrowRight, RefreshCw, Loader2 } from "lucide-react";
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
import { useNavigate } from "react-router-dom";

const Medicines = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<{ medicine: Medicine; qty: number; pharmacy?: Pharmacy; prescriptionUrl?: string; dosage?: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [address, setAddress] = useState("");
  const [smartInput, setSmartInput] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  
  const [comparingMedicine, setComparingMedicine] = useState<Medicine | null>(null);
  const [showComparisonDialog, setShowComparisonDialog] = useState(false);

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
      return [...prev, { medicine: m, qty: quantity, pharmacy, prescriptionUrl, dosage: 1 }];
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

  const handleSmartOrder = () => {
    const input = smartInput.toLowerCase();
    const match = medicines.find(m => input.includes(m.name.toLowerCase()));
    if (match) {
      const qtyMatch = input.match(/\d+/);
      const qty = qtyMatch ? parseInt(qtyMatch[0]) : 1;
      handleMedicineClick(match);
      setSmartInput("");
      toast.success(`Smart Match: Found ${match.name}`);
    } else {
      toast.error("Could not recognize medicine name. Try 'Add 2 Paracetamol'");
    }
  };

  const billing = useMemo(() => {
    const subtotal = cart.reduce((sum, c) => sum + c.medicine.price * c.qty, 0);
    const tax = Math.round(subtotal * 0.05);
    const discount = subtotal > 500 ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal + tax - discount;
    return { subtotal, tax, discount, total };
  }, [cart]);

  const handleOrder = async () => {
    if (!user) {
      toast.error("Please login to place an order", {
        description: "You need an account to track your medicines and refills."
      });
      navigate("/auth");
      return;
    }

    if (!address.trim()) {
      toast.error("Delivery address required", {
        description: "Please enter your address to proceed with the order."
      });
      return;
    }

    if (cart.length === 0) return;

    setIsOrdering(true);
    try {
      const orderId = Date.now().toString(36).toUpperCase();
      
      for (const item of cart) {
        await addDoc(collection(db, "active_prescriptions"), {
          userId: user.uid,
          medicineId: item.medicine.id,
          medicineName: item.medicine.name,
          dosagePerDay: item.dosage || 1,
          totalQuantity: item.qty * 10,
          startDate: Timestamp.now(),
          lastRefillDate: Timestamp.now(),
          orderId
        });
      }

      const msg = generateNotificationMessage("ORDER_CONFIRMED", { id: orderId });
      window.dispatchEvent(new CustomEvent("wellcare-notification", { 
        detail: { ...msg, type: "ORDER_CONFIRMED" } 
      }));

      setOrdered(true);
      setShowCart(false);
      toast.success("Order placed successfully!");
    } catch (e) {
      console.error("Error saving refill data:", e);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <Layout cartCount={cart.length} onCartClick={() => setShowCart(true)}>
      <div className="container py-12">
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in">
          <div>
            <h1 className="text-4xl font-heading font-bold tracking-tight">Order Medicines</h1>
            <p className="mt-2 text-muted-foreground text-lg">Compare prices across pharmacies and enable AI refill tracking.</p>
          </div>
          <Button variant="outline" className="gap-2 border-primary/20 text-primary bg-primary/5 rounded-2xl h-12 px-6 font-bold" onClick={() => navigate("/refills")}>
            <RefreshCw className="h-4 w-4" /> Manage AI Refills
          </Button>
        </div>

        <div className="mb-12 rounded-[2rem] border border-primary/10 bg-accent/5 p-6 shadow-sm animate-fade-in">
          <form onSubmit={(e) => { e.preventDefault(); handleSmartOrder(); }} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Sparkles className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
              <Input 
                placeholder="Smart Order: 'Add 2 Paracetamol'..." 
                className="pl-12 h-14 rounded-2xl text-base border-none shadow-inner bg-white"
                value={smartInput}
                onChange={(e) => setSmartInput(e.target.value)}
              />
            </div>
            <Button type="submit" className="hero-gradient h-14 px-10 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20">Add to Cart</Button>
          </form>
        </div>

        <div className="mb-10 flex flex-wrap gap-3 animate-fade-in">
          {medicineCategories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-2xl border px-6 py-3 text-sm font-bold transition-all duration-200 ${
                category === c 
                  ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "bg-card text-muted-foreground hover:border-primary hover:text-foreground border-border/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((m) => (
              <div key={m.id} className="rounded-[2rem] border bg-card p-6 card-shadow transition-all duration-300 hover:card-shadow-hover group border-border/50 hover:border-primary/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Pill className="h-4 w-4" />
                  </div>
                  <Badge variant={m.requiresPrescription ? "destructive" : "secondary"} className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5">
                    {m.requiresPrescription ? "Prescription Required" : "OTC"}
                  </Badge>
                </div>
                <h3 className="font-heading font-bold text-lg group-hover:text-primary transition-colors">{m.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{m.description}</p>
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="space-y-0.5">
                    <span className="text-2xl font-extrabold text-foreground">₹{m.price}</span>
                    <p className="text-[10px] text-success font-bold uppercase tracking-tighter">Compare & Save</p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleMedicineClick(m)}
                    variant={m.requiresPrescription ? "outline" : "default"}
                    className={`rounded-xl h-10 px-4 font-bold ${m.requiresPrescription ? "border-destructive/50 text-destructive hover:bg-destructive/5" : "hero-gradient"}`}
                  >
                    {m.requiresPrescription ? <FileText className="mr-1.5 h-4 w-4" /> : <Search className="mr-1.5 h-4 w-4" />}
                    {m.requiresPrescription ? "Upload Rx" : "Compare"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-[3rem] bg-muted/20 border-border/50">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <Pill className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-2xl font-bold text-muted-foreground">No medicines found</h3>
            <p className="text-base text-muted-foreground max-w-xs mt-2 leading-relaxed">
              We couldn't find any medicines in the "{category}" category. Try another filter.
            </p>
            <Button variant="link" className="mt-6 text-primary font-bold text-lg" onClick={() => setCategory("All")}>
              View All Medicines
            </Button>
          </div>
        )}

        {/* Price Comparison Dialog */}
        <Dialog open={showComparisonDialog} onOpenChange={setShowComparisonDialog}>
          <DialogContent className="sm:max-w-lg rounded-[2.5rem] p-8">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Search className="h-6 w-6" />
                </div>
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
          <DialogContent className="sm:max-w-md rounded-[2.5rem] p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Upload Prescription</DialogTitle>
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
          <DialogContent className="max-w-md rounded-[2.5rem] p-8">
            <DialogHeader><DialogTitle className="text-2xl font-bold">Your Cart</DialogTitle></DialogHeader>
            {cart.length === 0 ? (
              <div className="py-12 text-center">
                <ShoppingCart className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map((c) => (
                    <div key={c.medicine.id} className="flex flex-col rounded-2xl border p-4 gap-3 bg-muted/30 border-border/50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-base">{c.medicine.name}</p>
                            {c.pharmacy && (
                              <Badge variant="outline" className="h-5 px-2 text-[9px] bg-primary/5 text-primary border-primary/20 font-bold uppercase tracking-tighter">
                                {c.pharmacy.name}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground font-medium">{c.qty} × ₹{c.medicine.price}</p>
                        </div>
                        <button onClick={() => removeFromCart(c.medicine.id)} className="p-2 hover:bg-destructive/10 rounded-full transition-colors">
                          <X className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4 pt-3 border-t border-dashed border-border/50">
                        <div className="flex-1 space-y-2">
                          <Label className="text-[10px] uppercase font-extrabold text-muted-foreground tracking-widest">Daily Dosage (for AI Refill)</Label>
                          <div className="flex items-center gap-3">
                            <Input 
                              type="number" 
                              className="h-9 text-sm w-20 rounded-xl border-border/50" 
                              value={c.dosage} 
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setCart(prev => prev.map(item => item.medicine.id === c.medicine.id ? { ...item, dosage: val } : item));
                              }}
                            />
                            <span className="text-xs font-bold text-muted-foreground">tablets / day</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-3 rounded-2xl bg-primary/5 p-6 border border-primary/10">
                  <div className="flex justify-between text-sm font-medium"><span>Subtotal</span><span>₹{billing.subtotal}</span></div>
                  <div className="flex justify-between text-sm font-medium"><span>Tax (5%)</span><span>₹{billing.tax}</span></div>
                  {billing.discount > 0 && <div className="flex justify-between text-sm font-bold text-success"><span>Discount</span><span>-₹{billing.discount}</span></div>}
                  <div className="border-t border-primary/10 pt-3 flex justify-between font-extrabold text-2xl text-primary"><span>Total</span><span>₹{billing.total}</span></div>
                </div>
                <div className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label className="font-bold text-sm ml-1">Delivery Address</Label>
                    <Input placeholder="Enter complete address" className="h-12 rounded-xl border-border/50" value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                  <Button className="w-full hero-gradient h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20" onClick={handleOrder} disabled={isOrdering}>
                    {isOrdering ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <ShoppingCart className="h-5 w-5 mr-2" />}
                    Place Order
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={ordered} onOpenChange={(o) => { setOrdered(o); if (!o) setCart([]); }}>
          <DialogContent className="rounded-[2.5rem] p-10 text-center">
            <div className="h-20 w-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <DialogHeader><DialogTitle className="text-3xl font-bold text-center">Order Placed!</DialogTitle></DialogHeader>
            <p className="text-lg text-muted-foreground mt-4 leading-relaxed">Your order has been confirmed. AI Refill tracking has been enabled for these medicines.</p>
            <Button className="w-full mt-8 h-14 rounded-2xl font-bold text-lg hero-gradient border-none" onClick={() => setOrdered(false)}>Close</Button>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Medicines;