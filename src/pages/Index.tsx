import { Search, Calendar, Pill, Stethoscope, Activity, Shield, Bot, CheckCircle2, Clock, ShieldCheck, Zap, ArrowRight, Heart, Droplets, Scale, RefreshCw, Video, Sparkles, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import heroImage from "@/assets/hero-medical.jpg";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [latestVitals, setLatestVitals] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "health_readings"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setLatestVitals(data);
    });

    return () => unsubscribe();
  }, [user]);

  const healthScore = useMemo(() => {
    if (latestVitals.length === 0) return 0;
    const base = 65;
    const bonus = Math.min(30, latestVitals.length * 5);
    return base + bonus;
  }, [latestVitals]);

  const handleProtectedClick = (e: React.MouseEvent, path: string) => {
    if (!user) {
      e.preventDefault();
      toast.info("Please login to access MedCare services", {
        description: "You need an account to book appointments or order medicines."
      });
      navigate("/auth", { state: { from: { pathname: path } } });
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Healthcare professionals" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/60 to-transparent" />
        </div>
        <div className="container relative py-20">
          <div className="max-w-2xl animate-fade-in">
            <Badge className="mb-6 bg-primary/20 text-primary-foreground border-none px-4 py-1 text-xs font-bold uppercase tracking-widest">
              Next-Gen Healthcare
            </Badge>
            <h1 className="text-5xl font-heading font-extrabold tracking-tight text-primary-foreground md:text-7xl leading-[1.1]">
              Your Health, <br />
              <span className="text-secondary">Our Priority</span>
            </h1>
            <p className="mt-6 text-xl text-primary-foreground/80 max-w-lg leading-relaxed">
              The most advanced healthcare ecosystem. AI-powered diagnostics, real-time price comparison, and smart refill tracking.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="hero-gradient border-none h-14 px-8 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20" 
                onClick={(e) => handleProtectedClick(e, "/ai-assistant")}
                asChild
              >
                <Link to="/ai-assistant">Try AI Assistant <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-14 px-8 text-lg font-bold rounded-2xl backdrop-blur-sm"
                onClick={(e) => handleProtectedClick(e, "/search")}
                asChild
              >
                <Link to="/search">Search Diseases</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Stats & Health Score */}
      {user && (
        <section className="container py-16 animate-fade-in">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="card-shadow border-primary/10 bg-primary/5 rounded-3xl overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" /> Health Score
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-extrabold text-primary tracking-tighter">{healthScore}</span>
                  <span className="text-lg text-muted-foreground mb-1 font-bold">/ 100</span>
                </div>
                <p className="text-sm text-muted-foreground mt-4 leading-relaxed">Based on your recent vitals and activity tracking.</p>
              </CardContent>
            </Card>

            <Card className="card-shadow border-success/10 bg-success/5 rounded-3xl overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-success flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Daily Health Tip
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-lg font-semibold italic leading-relaxed text-foreground/80">"Drinking 500ml of water right after waking up boosts metabolism by 24%."</p>
                <Badge variant="outline" className="mt-6 text-[10px] bg-white font-bold uppercase tracking-tighter">AI Generated</Badge>
              </CardContent>
            </Card>

            <Card className="card-shadow border-accent/10 bg-accent/5 rounded-3xl overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                  <Activity className="h-4 w-4" /> Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {latestVitals.slice(0, 3).map((v, i) => (
                    <div key={i} className="flex justify-between items-center p-2 rounded-xl bg-white/50 border border-white/20">
                      <span className="capitalize text-xs font-bold text-muted-foreground">{v.type} Reading</span>
                      <span className="font-extrabold text-sm text-accent">{v.value} {v.unit}</span>
                    </div>
                  ))}
                  {latestVitals.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center italic">No recent readings found.</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Services Grid */}
      <section className={`container ${user ? 'py-12' : '-mt-20 relative z-10 pb-24'}`}>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <ServiceCard
            title="AI Symptom Checker"
            description="Clinical-grade analysis to match you with the right specialist instantly."
            icon={Bot}
            to="/ai-assistant"
            color="accent"
            delay={0}
            onClick={(e) => handleProtectedClick(e, "/ai-assistant")}
          />
          <ServiceCard
            title="Smart AI Refills"
            description="AI predicts when your supply runs out and automates your refills."
            icon={RefreshCw}
            to="/refills"
            color="primary"
            delay={100}
            onClick={(e) => handleProtectedClick(e, "/refills")}
          />
          <ServiceCard
            title="Price Comparison"
            description="Compare medicine prices across 50+ pharmacies and save up to 40%."
            icon={Search}
            to="/medicines"
            color="success"
            delay={200}
            onClick={(e) => handleProtectedClick(e, "/medicines")}
          />
          <ServiceCard
            title="Teleconsultation"
            description="HD video calls with top specialists and instant e-prescriptions."
            icon={Video}
            to="/teleconsultation"
            color="secondary"
            delay={300}
            onClick={(e) => handleProtectedClick(e, "/teleconsultation")}
          />
        </div>
      </section>

      {/* Advanced Features Showcase */}
      <section className="container py-24">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          <div className="animate-fade-in">
            <Badge className="mb-6 bg-primary/10 text-primary border-none px-4 py-1 font-bold uppercase tracking-widest text-xs">
              Advanced Ecosystem
            </Badge>
            <h2 className="text-4xl font-heading font-extrabold mb-8 leading-tight">Next-Gen Healthcare Tools <br />At Your Fingertips</h2>
            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-success/10 text-success shadow-sm">
                  <Zap className="h-7 w-7" />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-2">Medicine Price Comparison</h4>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Don't overpay for your health. Our engine scans partnered pharmacies in real-time to find the lowest prices, fastest delivery, and best discounts for every medicine.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                  <RefreshCw className="h-7 w-7" />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-2">Smart Refill Prediction (AI)</h4>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Our AI tracks your dosage and purchase history to predict exactly when you'll run out. Get reminders 3 days early and refill with a single tap.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent shadow-sm">
                  <Activity className="h-7 w-7" />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-2">Real-time Health Vitals</h4>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Monitor BP, Sugar, and Heart Rate with smart trend analysis. Get instant alerts if your readings fall outside the normal range.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="aspect-square rounded-[3rem] hero-gradient opacity-5 absolute -inset-8 rotate-6" />
            <div className="relative rounded-[2.5rem] border bg-card p-10 card-shadow overflow-hidden border-border/50">
              <div className="absolute top-0 right-0 p-6">
                <Badge variant="outline" className="bg-success/5 text-success border-success/20 font-bold uppercase tracking-tighter">AI Verified</Badge>
              </div>
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <RefreshCw className="h-6 w-6 text-primary" />
                Refill Prediction
              </h3>
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-lg">Paracetamol 500mg</span>
                    <span className="text-destructive font-bold text-sm bg-destructive/10 px-3 py-1 rounded-full">2 days left</span>
                  </div>
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-destructive animate-pulse" style={{ width: '15%' }} />
                  </div>
                </div>
                <div className="p-6 rounded-3xl bg-muted/30 border border-dashed border-muted-foreground/20">
                  <p className="text-xs text-muted-foreground uppercase font-bold mb-3 tracking-widest">AI Insight</p>
                  <p className="text-sm italic leading-relaxed text-foreground/80">"Based on your 2x daily dosage, your supply will deplete on Friday. Would you like to refill now?"</p>
                </div>
                <Button className="w-full hero-gradient shadow-xl shadow-primary/20 h-14 text-lg font-bold rounded-2xl" onClick={() => navigate("/refills")}>One-Tap Refill Now</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container pb-24">
        <div className="rounded-[3.5rem] border bg-card p-12 md:p-24 text-center card-shadow relative overflow-hidden border-border/50">
          <div className="absolute top-0 right-0 -mt-24 -mr-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-24 -ml-24 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-none px-4 py-1 font-bold uppercase tracking-widest text-xs">
              Join the Revolution
            </Badge>
            <h2 className="text-4xl md:text-6xl font-heading font-extrabold mb-8 leading-tight">Ready to take control <br />of your health?</h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">Join thousands of users who trust MedCare for their daily healthcare needs. Experience the future of medicine today.</p>
            <div className="flex flex-wrap justify-center gap-6">
              {!user && (
                <Button size="lg" className="hero-gradient border-none h-16 px-10 text-xl font-bold rounded-2xl shadow-xl shadow-primary/20" asChild>
                  <Link to="/auth">Get Started Now</Link>
                </Button>
              )}
              <Button 
                size="lg" 
                variant="outline" 
                className="h-16 px-10 text-xl font-bold rounded-2xl border-primary/20 hover:bg-primary/5"
                onClick={(e) => handleProtectedClick(e, "/appointments")}
                asChild
              >
                <Link to="/appointments">Book an Appointment</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;