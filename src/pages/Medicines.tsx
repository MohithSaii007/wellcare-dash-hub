"use client";

import { useState, useMemo } from "react";
import { ShoppingCart, Pill, AlertTriangle, CheckCircle2, X, Sparkles, Receipt, Calculator } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { medicines, medicineCategories, type Medicine } from "@/data/mockData";
import { toast } from "sonner";

const Medicines = () => {
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<{ medicine: Medicine; qty: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [address, setAddress] = useState("");
  const [smartInput, setSmartInput] = useState("");

  const filtered = category === "All" ? medicines : medicines.filter((m) => m.category === category);

  const addToCart = (m: Medicine, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.medicine.id === m.id);
      if (existing) return prev.map((c) => c.medicine.id === m.id ? { ...c, qty: c.qty + quantity } : c);
      return [...prev, { medicine: m, qty: quantity }];
    });
    toast.success(`Added ${quantity}x ${m.name} to cart`);
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((c) => c.medicine.id !== id));

  // Billing Calculations
  const billing = useMemo(() => {
    const subtotal = cart.reduce((sum, c) => sum + c.medicine.price * c.qty, 0);
    const tax = Math.round(subtotal * 0.05); // 5% Tax
    const discount = subtotal > 500 ? Math.round(subtotal * 0.1) : 0; // 10% Discount over 500
    const total = subtotal + tax - discount;
    return { subtotal, tax, discount, total };
  }, [cart]);

  const handleSmartOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const input = smartInput.toLowerCase();
    
    // Simple parsing logic
    let found = false;
    medicines.forEach(m => {
      if (input.includes(m.name.toLowerCase())) {
        // Extract quantity using regex
        const qtyMatch = input.match(new RegExp(`(\\d+)\\s*${m.name.toLowerCase()}`)) || input.match(new RegExp(`${m.name.toLowerCase()}\\s*(\\d+)`));
        const qty = qtyMatch ? parseInt(qtyMatch[1]) : 1;
        
        if (m.requiresPrescription) {
          toast.error(`${m.name} requires a prescription and cannot be added via Smart Order.`);
        } else {
          addToCart(m, qty);
          found = true;
        }
      }
    });

    if (!found) {
      toast.error("Could not identify medicine. Please specify name and quantity (e.g., 'Add 2 Paracetamol')");
    } else {
      setSmartInput("");
    }
  };

  const handleOrder = () => {
    if (address.trim() && cart.length > 0) {
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

        {/* Smart Order Assistant */}
        <Card className="mb-8 border-primary/20 bg-accent/5 shadow-sm animate-fade-in">
          <CardContent className="p-4">
            <form onSubmit={handleSmartOrder} className="flex gap-2">
              <div className="relative flex-1">
                <Sparkles className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                <Input 
                  placeholder="Smart Order: 'Add 2 Paracetamol' or '3 Cetirizine'..." 
                  className="pl-10"
                  value={smartInput}
                  onChange={(e) => setSmartInput(e.target.value)}
                />
              </div>
              <Button type="submit" className="hero-gradient">
                Add to Cart
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="mb-6 flex flex-wrap gap-2 animate-fade-in" style={{ animationDelay: "100ms" }}>
          {medicineCategories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:border-primary hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mb-6 flex items-start gap-2 rounded-lg bg-warning/10 p-3 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0 text-warning mt-0.5" />
          <p className="text-muted-foreground">Medicine information is for educational purposes only. Always consult a doctor before use.</p>
        </div>

        {/* Medicine Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((m) => (
            <div key={m.id} className="rounded-xl border bg-card p-5 card-shadow transition-all hover:card-shadow-hover">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                  <Pill className="h-4 w-4 text-accent-foreground" />
                </div>
                <Badge variant={m.requiresPrescription ? "destructive" : "secondary"} className="text-[10px]">
                  {m.requiresPrescription ? "Prescription" : "OTC"}
                </Badge>
              </div>
              <h3 className="font-heading font-semibold text-card-foreground">{m.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{m.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-card-foreground">₹{m.price}</span>
                <Button size="sm" onClick={() => addToCart(m)} disabled={m.requiresPrescription}>
                  <ShoppingCart className="mr-1 h-3 w-3" /> Add
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Dialog */}
        <Dialog open={showCart} onOpenChange={setShowCart}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Your Cart ({cart.length} items)
              </DialogTitle>
            </DialogHeader>
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mb-2 opacity-20" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {cart.map((c) => (
                    <div key={c.medicine.id} className="flex items-center justify-between rounded-lg border p-3 bg-muted/30">
                      <div>
                        <p className="text-sm font-semibold">{c.medicine.name}</p>
                        <p className="text-xs text-muted-foreground">{c.qty} × ₹{c.medicine.price}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold">₹{c.qty * c.medicine.price}</span>
                        <button onClick={() => removeFromCart(c.medicine.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Billing Summary */}
                <div className="mt-4 space-y-2 rounded-xl bg-muted/50 p-4 border border-dashed">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{billing.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (5%)</span>
                    <span>₹{billing.tax}</span>
                  </div>
                  {billing.discount > 0 && (
                    <div className="flex justify-between text-sm text-success font-medium">
                      <span>Discount (10%)</span>
                      <span>-₹{billing.discount}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-heading font-bold text-lg text-primary">
                    <span>Total Payable</span>
                    <span>₹{billing.total}</span>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Input 
                    id="address"
                    placeholder="Enter complete delivery address" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                  />
                  <Button className="w-full hero-gradient" onClick={handleOrder} disabled={!address.trim()}>
                    Place Order • ₹{billing.total}
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Order Confirmation */}
        <Dialog open={ordered} onOpenChange={(o) => { setOrdered(o); if (!o) { setCart([]); setAddress(""); } }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-6 w-6" /> Order Placed Successfully!
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono font-bold">ORD-{Date.now().toString(36).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-bold text-primary">₹{billing.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery to</span>
                  <span className="text-right max-w-[200px] truncate">{address}</span>
                </div>
              </div>
              <p className="text-xs text-center text-muted-foreground">Your medicines will be delivered within 2-4 hours.</p>
              <Button className="w-full" variant="outline" onClick={() => setOrdered(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

// Helper component for the Smart Order card
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-xl border bg-card text-card-foreground shadow ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

export default Medicines;