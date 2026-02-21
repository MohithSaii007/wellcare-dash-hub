import { Search, Calendar, Pill, Stethoscope, Activity, Shield, Bot, CheckCircle2, Clock, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-medical.jpg";

const Index = () => {
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
              Search diseases, book appointments, order medicines, and get doctor home visits — all from one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" className="hero-gradient border-none" asChild>
                <Link to="/ai-assistant">Try AI Assistant <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20" asChild>
                <Link to="/search">Search Diseases</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container -mt-8 relative z-10 pb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <ServiceCard
            title="AI Assistant"
            description="Instant symptom analysis and health insights using AI"
            icon={Bot}
            to="/ai-assistant"
            color="accent"
            delay={0}
          />
          <ServiceCard
            title="Disease Search"
            description="Look up diseases, symptoms, causes and treatments"
            icon={Search}
            to="/search"
            color="primary"
            delay={100}
          />
          <ServiceCard
            title="Book Appointment"
            description="Find hospitals & doctors and book instantly"
            icon={Calendar}
            to="/appointments"
            color="secondary"
            delay={200}
          />
          <ServiceCard
            title="Order Medicines"
            description="Browse medicines and get them delivered home"
            icon={Pill}
            to="/medicines"
            color="success"
            delay={300}
          />
          <ServiceCard
            title="Doctor Home Visit"
            description="Book a qualified doctor to visit you at home"
            icon={Stethoscope}
            to="/doctor-visit"
            color="warning"
            delay={400}
          />
        </div>
      </section>

      {/* How it Works */}
      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold">How MedCare Works</h2>
          <p className="text-muted-foreground mt-2">Simple steps to manage your healthcare journey</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Identify Symptoms",
              desc: "Use our AI Assistant or Disease Search to understand your health concerns.",
              icon: Search
            },
            {
              step: "02",
              title: "Consult Experts",
              desc: "Book an in-hospital appointment or request a doctor to visit your home.",
              icon: Stethoscope
            },
            {
              step: "03",
              title: "Get Treatment",
              desc: "Order prescribed medicines for home delivery and manage your recovery.",
              icon: Pill
            }
          ].map((item, i) => (
            <div key={i} className="relative p-6 rounded-2xl border bg-card card-shadow animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="absolute -top-4 -left-4 h-12 w-12 rounded-xl hero-gradient flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {item.step}
              </div>
              <div className="mt-4">
                <item.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
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
              <Button size="lg" variant="outline" asChild>
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