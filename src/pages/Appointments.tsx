import { useState } from "react";
import { MapPin, Star, Clock, CheckCircle2, Building2, ChevronRight } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { hospitals, doctors, timeSlots, type Doctor } from "@/data/mockData";
import { generateNotificationMessage } from "@/utils/notificationEngine";
import { toast } from "sonner";

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
      const slotTime = timeSlots.find(s => s.id === selectedSlot)?.time;
      const msg = generateNotificationMessage("APPOINTMENT_CONFIRMED", { 
        doctor: selectedDoctor.name, 
        time: slotTime 
      });
      
      window.dispatchEvent(new CustomEvent("wellcare-notification", { 
        detail: { ...msg, type: "APPOINTMENT_CONFIRMED" } 
      }));

      setBooked(true);
      toast.success("Appointment booked successfully!");
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-heading font-bold">Book Hospital Appointment</h1>
          <p className="mt-1 text-muted-foreground">Select a hospital, choose a doctor, and pick a time slot</p>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-lg font-heading font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> 1. Select Hospital
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hospitals.map((h) => (
              <button
                key={h.id}
                onClick={() => { setSelectedHospital(h.id); setSelectedDoctor(null); setSelectedSlot(null); }}
                className={`rounded-xl border p-5 text-left transition-all ${
                  selectedHospital === h.id ? "border-primary bg-accent ring-1 ring-primary/20" : "bg-card hover:border-primary"
                }`}
              >
                <div className="text-3xl mb-2">{h.image}</div>
                <h3 className="font-heading font-semibold">{h.name}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {h.location}</p>
              </button>
            ))}
          </div>
        </div>

        {selectedHospital && (
          <div className="mb-8 animate-fade-in">
            <h2 className="mb-4 text-lg font-heading font-semibold flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" /> 2. Available Doctors
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDoctors.map((d) => (
                <button
                  key={d.id}
                  onClick={() => { setSelectedDoctor(d); setSelectedSlot(null); }}
                  className={`rounded-xl border p-5 text-left transition-all ${
                    selectedDoctor?.id === d.id ? "border-primary bg-accent ring-1 ring-primary/20" : "bg-card hover:border-primary"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {d.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{d.name}</p>
                      <p className="text-xs text-muted-foreground">{d.specialty}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedDoctor && (
          <div className="mb-8 animate-fade-in max-w-2xl">
            <h2 className="mb-4 text-lg font-heading font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> 3. Select Time Slot
            </h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {timeSlots.map((s) => (
                <button
                  key={s.id}
                  disabled={!s.available}
                  onClick={() => setSelectedSlot(s.id)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                    !s.available ? "opacity-50 cursor-not-allowed" : selectedSlot === s.id ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:border-primary"
                  }`}
                >
                  {s.time}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Reason for Visit</label>
                <Input placeholder="Briefly describe your concern" value={reason} onChange={(e) => setReason(e.target.value)} />
              </div>
              <Button className="w-full hero-gradient" onClick={handleBook} disabled={!selectedSlot}>
                Confirm Appointment
              </Button>
            </div>
          </div>
        )}

        <Dialog open={booked} onOpenChange={setBooked}>
          <DialogContent>
            <DialogHeader><DialogTitle className="text-success flex items-center gap-2"><CheckCircle2 /> Confirmed!</DialogTitle></DialogHeader>
            <div className="space-y-3 py-4">
              <p className="text-sm text-muted-foreground">Your appointment with <strong>{selectedDoctor?.name}</strong> has been scheduled.</p>
              <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
                <div className="flex justify-between"><span>Hospital:</span><span className="font-medium">{hospitals.find(h => h.id === selectedHospital)?.name}</span></div>
                <div className="flex justify-between"><span>Time:</span><span className="font-medium">{timeSlots.find(s => s.id === selectedSlot)?.time}</span></div>
              </div>
            </div>
            <Button className="w-full" onClick={() => setBooked(false)}>Close</Button>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Appointments;