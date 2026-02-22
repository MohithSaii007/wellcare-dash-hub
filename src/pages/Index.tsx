import { Search, Calendar, Pill, Stethoscope, Activity, Shield, Bot, CheckCircle2, Clock, ShieldCheck, Zap, ArrowRight, Heart, Droplets, Scale, RefreshCw, Video } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-medical.jpg";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useState, useEffect } from "react";
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
      limit(4)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setLatestVitals(data);
    });

    return () => unsubscribe();
  }, [user]);

  const handleProtectedClick = (e: React.MouseEvent, path: string) => {
    if (!user) {
      e.preventDefault();
      toast.info("Please login to access MedCare services", {
        description: "You need an account to book appointments or order medicines."
      });
      navigate("/auth");
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Healthcare professionals" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40" />
        </div>
        <div className="container relative py-20 md:py-32">
          <div className="max-w-xl animate-fade-in">
            <h1 className="text-4xl font-heading font-extrabold tracking-tight text-primary-foreground md:text-5xl">
              Your Health, <span className="text-secondary">Our Priority</span>
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80">
              The most advanced healthcare ecosystem. AI-powered diagnostics, real-time price comparison, and smart refill tracking.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="hero-gradient border-none" 
                onClick={(e) => handleProtectedClick(e, "/ai-assistant")}
                asChild
              >
                <Link to="/ai-assistant">Try AI Assistant <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                onClick={(e) => handleProtectedClick(e, "/search")}
                asChild
              >
                <Link to="/search">Search Diseases</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container -mt-8 relative z-10 pb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
      <section className="container py-16">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-none">NEW FEATURES</Badge>
            <h2 className="text-3xl font-heading font-bold mb-6">Next-Gen Healthcare Tools</h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Medicine Price Comparison</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Don't overpay for your health. Our engine scans partnered pharmacies in real-time to find the lowest prices, fastest delivery, and best discounts for every medicine.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <RefreshCw className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Smart Refill Prediction (AI)</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Our AI tracks your dosage and purchase history to predict exactly when you'll run out. Get reminders 3 days early and refill with a single tap.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Real-time Health Vitals</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Monitor BP, Sugar, and Heart Rate with smart trend analysis. Get instant alerts if your readings fall outside the normal range.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="aspect-square rounded-3xl hero-gradient opacity-5 absolute -inset-4 rotate-3" />
            <div className="relative rounded-2xl border bg-card p-8 card-shadow overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Badge variant="outline" className="bg-success/5 text-success border-success/20">AI Verified</Badge>
              </div>
              <h3 className="text-xl font-bold mb-4">Refill Prediction</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold">Paracetamol 500mg</span>
                    <span className="text-destructive font-bold">2 days left</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-destructive animate-pulse" style={{ width: '15%' }} />
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-dashed">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold mb-2">AI Insight</p>
                  <p className="text-xs italic">"Based on your 2x daily dosage, your supply will deplete on Friday. Would you like to refill now?"</p>
                </div>
                <Button className="w-full hero-gradient shadow-lg">One-Tap Refill Now</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-heading font-bold mb-6">Why Choose MedCare?</h2>
              <div className="space-y-6">
                {[
                  { title: "24/7 AI Support", desc: "Get instant health insights anytime, anywhere with our intelligent assistant.", icon: Zap },
                  { title: "Verified Professionals", desc: "All our doctors and hospitals are strictly verified for quality care.", icon: ShieldCheck },
                  { title: "Fast Home Delivery", desc: "Medicines delivered to your doorstep within hours of ordering.", icon: Clock },
                  { title: "Complete Health Records", desc: "Manage your medical history and emergency contacts in one secure place.", icon: CheckCircle2 }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="aspect-square rounded-3xl hero-gradient opacity-10 absolute -inset-4 rotate-3" />
              <div className="relative rounded-2xl border bg-card p-8 card-shadow">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center text-success">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Secure & Private</h4>
                    <p className="text-xs text-muted-foreground">Your health data is encrypted</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  "MedCare has completely changed how I manage my family's health. From checking symptoms to getting medicines delivered, it's all so seamless and trustworthy."
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <div>
                    <p className="text-sm font-bold">Sarah Jenkins</p>
                    <p className="text-xs text-muted-foreground">Verified User</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container py-16">
        <div className="rounded-2xl hero-gradient p-8 md:p-12">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            {[
              { label: "Diseases Covered", value: "500+", icon: Activity },
              { label: "Verified Doctors", value: "200+", icon: Stethoscope },
              { label: "Medicines Available", value: "1000+", icon: Shield },
            ].map((stat) => (
              <div key={stat.label} className="animate-fade-in">
                <stat.icon className="mx-auto mb-2 h-8 w-8 text-primary-foreground/80" />
                <div className="text-3xl font-heading font-extrabold text-primary-foreground">{stat.value}</div>
                <div className="text-sm text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container pb-16">
        <div className="rounded-3xl border bg-card p-8 md:p-16 text-center card-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-primary/5" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-64 w-64 rounded-full bg-secondary/5" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Ready to take control of your health?</h2>
            <p className="text-muted-foreground mb-8">Join thousands of users who trust MedCare for their daily healthcare needs.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="hero-gradient border-none" asChild>
                <Link to="/auth">Get Started Now</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
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