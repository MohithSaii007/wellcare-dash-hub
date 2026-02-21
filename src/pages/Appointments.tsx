import { useState } from "react";
import { MapPin, Star, Clock, CheckCircle2, Building2 } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { hospitals, doctors, timeSlots, type Doctor } from "@/data/mockData";
import { generateNotificationMessage } from "@/utils/notificationEngine";

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
            <Building2 className="h-5 w-5 text-primary" /> Select Hospital
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hospitals.map((h) => (
              <button
                key={h.id}
                onClick={() => { setSelectedHospital(h.id); setSelectedDoctor(null); setSelectedSlot(null); }}
                className={`rounded-xl border p-5 text-left transition-all ${
                  selectedHospital === h.id ? "border-primary bg-accent" : "bg-card hover:border-primary"
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
            <h2 className="mb-4 text-lg font-heading font-semibold">Available Doctors</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDoctors.map((d) => (
                <button
                  key={d.id}
                  onClick={() => { setSelectedDoctor(d); setSelectedSlot(null); }}
                  className={`rounded-xl border p-5 text-left transition-all ${
                    selectedDoctor?.id === d.id ? "border-primary bg-accent" : "bg-card hover:border-primary"
                  }`}
                >
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.specialty}</p>
                </button>
              ))}
            </div>
          </div>
        )}

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
                    !s.available ? "opacity-50 cursor-not-allowed" : selectedSlot === s.id ? "bg-primary text-primary-foreground" : "bg-card hover:border-primary"
                  }`}
                >
                  {s.time}
                </button>
              ))}
            </div>
            <Input className="mt-4 max-w-md" placeholder="Reason (optional)" value={reason} onChange={(e) => setReason(e.target.value)} />
            <Button className="mt-4" onClick={handleBook} disabled={!selectedSlot}>Confirm Appointment</Button>
          </div>
        )}

        <Dialog open={booked} onOpenChange={setBooked}>
          <DialogContent>
            <DialogHeader><DialogTitle className="text-success flex items-center gap-2"><CheckCircle2 /> Confirmed!</DialogTitle></DialogHeader>
            <p className="text-sm text-muted-foreground">Your appointment is booked. Check your notifications for details.</p>
            <Button className="w-full mt-4" onClick={() => setBooked(false)}>Close</Button>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Appointments;