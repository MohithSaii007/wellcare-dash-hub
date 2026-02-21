import { useState } from "react";
import { MapPin, Star, Clock, CheckCircle2, Building2 } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { hospitals, doctors, timeSlots, type Doctor } from "@/data/mockData";

const Appointments = () => {
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [booked, setBooked] = useState(false);

  const filteredDoctors = selectedHospital
    ? doctors.filter((d) => d.hospital === hospitals.find((h) => h.id === selectedHospital)?.name)
    : [];

  const handleBook = () => {
    if (selectedDoctor && selectedSlot) {
      setBooked(true);
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-heading font-bold">Book Hospital Appointment</h1>
          <p className="mt-1 text-muted-foreground">Select a hospital, choose a doctor, and pick a time slot</p>
        </div>

        {/* Step 1: Hospitals */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-heading font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> Select Hospital
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hospitals.map((h) => (
              <button
                key={h.id}
                onClick={() => { setSelectedHospital(h.id); setSelectedDoctor(null); setSelectedSlot(null); }}
                className={`rounded-xl border p-5 text-left transition-all ${
                  selectedHospital === h.id
                    ? "border-primary bg-accent card-shadow-hover"
                    : "bg-card card-shadow hover:card-shadow-hover"
                }`}
              >
                <div className="text-3xl mb-2">{h.image}</div>
                <h3 className="font-heading font-semibold text-card-foreground">{h.name}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {h.location}
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs text-warning">
                  <Star className="h-3 w-3 fill-current" /> {h.rating}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {h.specialties.slice(0, 3).map((s) => (
                    <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Doctors */}
        {selectedHospital && (
          <div className="mb-8 animate-fade-in">
            <h2 className="mb-4 text-lg font-heading font-semibold">Available Doctors</h2>
            {filteredDoctors.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDoctors.map((d) => (
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
            ) : (
              <p className="text-muted-foreground">No doctors available at this hospital.</p>
            )}
          </div>
        )}

        {/* Step 3: Time Slots */}
        {selectedDoctor && (
          <div className="mb-8 animate-fade-in">
            <h2 className="mb-4 text-lg font-heading font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> Select Time Slot
            </h2>
            <div className="flex flex-wrap gap-2">
              {timeSlots.map((s) => (
                <button
                  key={s.id}
                  disabled={!s.available}
                  onClick={() => setSelectedSlot(s.id)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                    !s.available
                      ? "cursor-not-allowed bg-muted text-muted-foreground line-through opacity-50"
                      : selectedSlot === s.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-card text-card-foreground hover:border-primary"
                  }`}
                >
                  {s.time}
                </button>
              ))}
            </div>

            <div className="mt-4 max-w-md">
              <Input
                placeholder="Reason / Disease (optional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <Button className="mt-4" onClick={handleBook} disabled={!selectedSlot}>
              Confirm Appointment
            </Button>
          </div>
        )}

        {/* Booking Confirmation */}
        <Dialog open={booked} onOpenChange={setBooked}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-6 w-6" /> Appointment Confirmed!
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 rounded-lg border bg-muted/50 p-4 text-sm">
              <Row label="Patient" value="Guest User" />
              <Row label="Doctor" value={selectedDoctor?.name || ""} />
              <Row label="Hospital" value={selectedDoctor?.hospital || ""} />
              <Row label="Time" value={timeSlots.find((s) => s.id === selectedSlot)?.time || ""} />
              <Row label="Reason" value={reason || "General Checkup"} />
              <Row label="Token ID" value={`MED-${Date.now().toString(36).toUpperCase()}`} />
            </div>
            <p className="text-xs text-muted-foreground">A confirmation has been generated. Please arrive 15 minutes before your slot.</p>
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

export default Appointments;
