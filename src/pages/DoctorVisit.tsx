import { useState } from "react";
import { Home, Star, CheckCircle2, MapPin, Clock } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { doctors, timeSlots, type Doctor } from "@/data/mockData";

const DoctorVisit = () => {
  const homeVisitDoctors = doctors.filter((d) => d.homeVisit);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [issue, setIssue] = useState("");
  const [booked, setBooked] = useState(false);

  const handleBook = () => {
    if (selectedDoctor && selectedSlot && address.trim()) {
      setBooked(true);
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning text-warning-foreground">
              <Home className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-heading font-bold">Doctor Home Visit</h1>
          </div>
          <p className="text-muted-foreground">Book a doctor to visit your home for consultation</p>
        </div>

        {/* Step 1: Select Doctor */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-heading font-semibold">Available Doctors for Home Visit</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {homeVisitDoctors.map((d) => (
              <button
                key={d.id}
                onClick={() => { setSelectedDoctor(d); setSelectedSlot(null); }}
                className={`rounded-xl border p-5 text-left transition-all ${
                  selectedDoctor?.id === d.id
                    ? "border-primary bg-accent card-shadow-hover"
                    : "bg-card card-shadow hover:card-shadow-hover"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full hero-gradient text-sm font-bold text-primary-foreground">
                    {d.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.specialty}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{d.experience} yrs exp.</span>
                  <span className="flex items-center gap-1 text-warning"><Star className="h-3 w-3 fill-current" />{d.rating}</span>
                  <span className="font-semibold text-card-foreground">₹{d.fee}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Details */}
        {selectedDoctor && (
          <div className="animate-fade-in max-w-lg space-y-4">
            <h2 className="text-lg font-heading font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> Select Time Slot
            </h2>
            <div className="flex flex-wrap gap-2">
              {timeSlots.filter((s) => s.available).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSlot(s.id)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                    selectedSlot === s.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-card text-card-foreground hover:border-primary"
                  }`}
                >
                  {s.time}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  <MapPin className="inline h-3 w-3 mr-1" /> Your Address
                </label>
                <Input placeholder="Enter your complete address" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Disease / Issue</label>
                <Textarea placeholder="Describe your symptoms or issue" value={issue} onChange={(e) => setIssue(e.target.value)} rows={3} />
              </div>
            </div>

            <Button onClick={handleBook} disabled={!selectedSlot || !address.trim()}>
              Confirm Home Visit Booking
            </Button>
          </div>
        )}

        {/* Confirmation */}
        <Dialog open={booked} onOpenChange={(o) => { setBooked(o); if (!o) { setSelectedDoctor(null); setSelectedSlot(null); setAddress(""); setIssue(""); } }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-6 w-6" /> Home Visit Confirmed!
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 rounded-lg border bg-muted/50 p-4 text-sm">
              <Row label="Doctor" value={selectedDoctor?.name || ""} />
              <Row label="Specialty" value={selectedDoctor?.specialty || ""} />
              <Row label="Time" value={timeSlots.find((s) => s.id === selectedSlot)?.time || ""} />
              <Row label="Address" value={address} />
              <Row label="Issue" value={issue || "General Consultation"} />
              <Row label="Fee" value={`₹${selectedDoctor?.fee || 0}`} />
              <Row label="Booking ID" value={`HV-${Date.now().toString(36).toUpperCase()}`} />
            </div>
            <p className="text-xs text-muted-foreground">The doctor will arrive at your address at the scheduled time.</p>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-card-foreground">{value}</span>
  </div>
);

export default DoctorVisit;
