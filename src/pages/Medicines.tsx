import { useState } from "react";
import { ShoppingCart, Pill, AlertTriangle, CheckCircle2, X } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { medicines, medicineCategories, type Medicine } from "@/data/mockData";

const Medicines = () => {
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<{ medicine: Medicine; qty: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [address, setAddress] = useState("");

  const filtered = category === "All" ? medicines : medicines.filter((m) => m.category === category);

  const addToCart = (m: Medicine) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.medicine.id === m.id);
      if (existing) return prev.map((c) => c.medicine.id === m.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { medicine: m, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((c) => c.medicine.id !== id));

  const total = cart.reduce((sum, c) => sum + c.medicine.price * c.qty, 0);

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
          <p className="mt-1 text-muted-foreground">Browse medicines and get them delivered to your doorstep</p>
        </div>

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
              <p className="mt-1 text-xs text-muted-foreground">{m.description}</p>
              <p className="mt-1 text-xs text-muted-foreground"><strong>Usage:</strong> {m.usage}</p>
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
              <DialogTitle>Your Cart ({cart.length} items)</DialogTitle>
            </DialogHeader>
            {cart.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">Cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cart.map((c) => (
                    <div key={c.medicine.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm font-medium">{c.medicine.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {c.qty} × ₹{c.medicine.price}</p>
                      </div>
                      <button onClick={() => removeFromCart(c.medicine.id)} className="text-muted-foreground hover:text-destructive">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 flex justify-between font-heading font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
                <Input placeholder="Delivery address" value={address} onChange={(e) => setAddress(e.target.value)} />
                <Button className="w-full" onClick={handleOrder} disabled={!address.trim()}>
                  Place Order
                </Button>
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
            <p className="text-sm text-muted-foreground">Your medicines will be delivered to <strong>{address}</strong>. Order ID: <strong>ORD-{Date.now().toString(36).toUpperCase()}</strong></p>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Medicines;
