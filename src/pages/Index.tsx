import { Search, Calendar, Pill, Stethoscope, Activity, Shield } from "lucide-react";
import Layout from "@/components/Layout";
import ServiceCard from "@/components/ServiceCard";
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
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container -mt-8 relative z-10 pb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ServiceCard
            title="Disease Search"
            description="Look up diseases, symptoms, causes and recommended treatments"
            icon={Search}
            to="/search"
            color="primary"
            delay={0}
          />
          <ServiceCard
            title="Book Appointment"
            description="Find hospitals & doctors, choose a time slot, and book instantly"
            icon={Calendar}
            to="/appointments"
            color="secondary"
            delay={100}
          />
          <ServiceCard
            title="Order Medicines"
            description="Browse medicines by category and get them delivered to your door"
            icon={Pill}
            to="/medicines"
            color="success"
            delay={200}
          />
          <ServiceCard
            title="Doctor Home Visit"
            description="Book a qualified doctor to visit you at home for consultation"
            icon={Stethoscope}
            to="/doctor-visit"
            color="warning"
            delay={300}
          />
        </div>
      </section>

      {/* Stats */}
      <section className="container pb-16">
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
    </Layout>
  );
};

export default Index;
