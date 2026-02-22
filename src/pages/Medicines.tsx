"use client";

import { useState, useMemo } from "react";
import { ShoppingCart, Pill, AlertTriangle, CheckCircle2, X, Sparkles, FileText, ShieldCheck } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { medicines, medicineCategories, type Medicine } from "@/data/mockData";
import { generateNotificationMessage } from "@/utils/notificationEngine";
import PrescriptionUpload from "@/components/PrescriptionUpload";
import { toast } from "sonner";

const Medicines = () => {
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<{ medicine: Medicine; qty: number; prescriptionUrl?: string }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [address, setAddress] = useState("");
  const [smartInput, setSmartInput] = useState("");
  
  // Prescription Flow State
  const [pendingMedicine, setPendingMedicine] = useState<Medicine | null>(null);
  const [showPrescriptionDialog, setShowPrescriptionDialog] = useState(false);

  const filtered = category === "All" ? medicines : medicines.filter((m) => m.category === category);

  const addToCart = (m: Medicine, quantity: number = 1, prescriptionUrl?: string) => {
    // Check if prescription is required but not provided
    if (m.requiresPrescription && !prescriptionUrl) {
      setPendingMedicine(m);
      setShowPrescriptionDialog(true);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((c) => c.medicine.id === m.id);
      if (existing) return prev.map((c) => c.medicine.id === m.id ? { ...c, qty: c.qty + quantity, prescriptionUrl: prescriptionUrl || c.prescriptionUrl } : c);
      return [...prev, { medicine: m, qty: quantity, prescriptionUrl }];
    });
    
    if (prescriptionUrl) {
      setShowPrescriptionDialog(false);
      setPendingMedicine(null);
    }
    
    toast.success(`Added ${quantity}x ${m.name} to cart`);
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((c) => c.medicine.id !== id));

  const billing = useMemo(() => {
    const subtotal = cart.reduce((sum, c) => sum + c.medicine.price * c.qty, 0);
    const tax = Math.round(subtotal * 0.05);
    const discount = subtotal > 500 ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal + tax - discount;
    return { subtotal, tax, discount, total };
  }, [cart]);

  const handleSmartOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const input = smartInput.toLowerCase();
    let found = false;
    medicines.forEach(m => {
      if (input.includes(m.name.toLowerCase())) {
        const qtyMatch = input.match(new RegExp(`(\\d+)\\s*${m.name.toLowerCase()}`)) || input.match(new RegExp(`${m.name.toLowerCase()}\\s*(\\d+)`));
        const qty = qtyMatch ? parseInt(qtyMatch[1]) : 1;
        addToCart(m, qty);
        found = true;
      }
    });
    if (!found) toast.error("Could not identify medicine.");
    else setSmartInput("");
  };

  const handleOrder = () => {
    if (address.trim() && cart.length > 0) {
      const orderId = Date.now().toString(36).toUpperCase();
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
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-heading font-bold">Order Medicines</h1>
          <p className="mt-1 text-muted-foreground">Browse medicines or use the Smart Assistant for quick ordering</p>
        </div>

        <div className="mb-8 rounded-xl border border-primary/20 bg-accent/5 p-4 shadow-sm animate-fade-in">
          <form onSubmit={handleSmartOrder} className="flex gap-2">
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((m) => (
            <div key={m.id} className="rounded-xl border bg-card p-5 card-shadow transition-all hover:card-shadow-hover">
              <div className="flex items-center gap-2 mb-3">
                <Pill className="h-4 w-4 text-primary" />
                <Badge variant={m.requiresPrescription ? "destructive" : "secondary"} className="text-[10px]">
                  {m.requiresPrescription ? "Prescription Required" : "OTC"}
                </Badge>
              </div>
              <h3 className="font-heading font-semibold">{m.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{m.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-bold">₹{m.price}</span>
                <Button 
                  size="sm" 
                  onClick={() => addToCart(m)}
                  variant={m.requiresPrescription ? "outline" : "default"}
                  className={m.requiresPrescription ? "border-destructive/50 text-destructive hover:bg-destructive/5" : ""}
                >
                  {m.requiresPrescription ? <FileText className="mr-1 h-3 w-3" /> : <ShoppingCart className="mr-1 h-3 w-3" />}
                  {m.requiresPrescription ? "Upload Rx" : "Add"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Prescription Upload Dialog */}
        <Dialog open={showPrescriptionDialog} onOpenChange={setShowPrescriptionDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Prescription</DialogTitle>
            </DialogHeader>
            {pendingMedicine && (
              <PrescriptionUpload 
                medicineName={pendingMedicine.name}
                onUploadComplete={(url) => addToCart(pendingMedicine, 1, url)}
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
                    <div key={c.medicine.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{c.medicine.name}</p>
                          {c.prescriptionUrl && (
                            <Badge variant="outline" className="h-4 px-1 text-[8px] bg-success/5 text-success border-success/20">
                              <ShieldCheck className="h-2 w-2 mr-0.5" /> Verified Rx
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{c.qty} × ₹{c.medicine.price}</p>
                      </div>
                      <button onClick={() => removeFromCart(c.medicine.id)}><X className="h-4 w-4 text-muted-foreground" /></button>
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
            <p className="text-sm text-muted-foreground">Your order has been confirmed. Our pharmacists will review your prescriptions before dispatch.</p>
            <Button className="w-full mt-4" onClick={() => setOrdered(false)}>Close</Button>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Medicines;