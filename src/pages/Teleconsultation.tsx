"use client";

import React, { useState } from "react";
import { Video, Star, Clock, Calendar, ShieldCheck, Search, Filter, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { doctors, timeSlots, type Doctor } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Teleconsultation = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedSlot) return;
    
    const appointmentId = Math.random().toString(36).substr(2, 9).toUpperCase();
    toast.success("Teleconsultation booked successfully!", {
      description: `Your session with ${selectedDoctor.name} is confirmed.`
    });
    
    // In a real app, we'd save this to a database. 
    // For now, we'll navigate to the video call page.
    setTimeout(() => {
      navigate(`/video-call/${appointmentId}`, { 
        state: { doctor: selectedDoctor, slot: timeSlots.find(s => s.id === selectedSlot)?.time } 
      });
    }, 1500);
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl hero-gradient text-white">
                <Video className="h-5 w-5" />
              </div>
              Teleconsultation
            </h1>
            <p className="mt-1 text-muted-foreground">Connect with top specialists from the comfort of your home.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search doctors..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor, i) => (
            <Card key={doctor.id} className="overflow-hidden card-shadow hover:card-shadow-hover transition-all animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-primary/10">
                      <img src={doctor.photoUrl} alt={doctor.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{doctor.name}</CardTitle>
                      <CardDescription className="text-primary font-medium">{doctor.specialty}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                    Online
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-warning">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-bold">{doctor.rating}</span>
                    <span className="text-muted-foreground">(120+ reviews)</span>
                  </div>
                  <div className="text-muted-foreground">
                    {doctor.experience} yrs exp.
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  Verified Specialist • Secure Connection
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-lg font-bold">₹{doctor.fee}</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="hero-gradient" onClick={() => setSelectedDoctor(doctor)}>
                        Book Video Call
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Select Time Slot</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                          <img src={doctor.photoUrl} className="h-12 w-12 rounded-full object-cover" />
                          <div>
                            <p className="font-bold">{doctor.name}</p>
                            <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map(slot => (
                            <Button
                              key={slot.id}
                              variant={selectedSlot === slot.id ? "default" : "outline"}
                              size="sm"
                              disabled={!slot.available}
                              className="text-xs"
                              onClick={() => setSelectedSlot(slot.id)}
                            >
                              {slot.time}
                            </Button>
                          ))}
                        </div>
                        
                        <Button className="w-full hero-gradient" disabled={!selectedSlot} onClick={handleBookAppointment}>
                          Confirm & Pay ₹{doctor.fee}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Appointments Section */}
        <div className="mt-12">
          <h2 className="text-xl font-heading font-bold mb-4">Upcoming Consultations</h2>
          <Card className="border-dashed border-2 bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No active appointments found.</p>
              <Button variant="link" className="text-primary">View History</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Teleconsultation;