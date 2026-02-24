"use client";

import React, { useState, useEffect } from "react";
import { 
  Droplets, Hospital, UserPlus, Search, 
  Phone, MapPin, Clock, AlertTriangle, 
  CheckCircle2, Loader2, Filter, ArrowRight,
  Heart, ShieldCheck, Info
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { hospitals, bloodGroups } from "@/data/mockData";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, onSnapshot, Timestamp } from "firebase/firestore";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

const Blood = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("availability");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("All");
  const [loading, setLoading] = useState(false);
  const [donors, setDonors] = useState<any[]>([]);

  // Fetch donors for matching
  useEffect(() => {
    const q = query(collection(db, "blood_donors"), where("availability", "==", "Available"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDonors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const filteredHospitals = hospitals.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         h.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBlood = selectedBloodGroup === "All" || (h.bloodStock[selectedBloodGroup] > 0);
    return matchesSearch && matchesBlood;
  });

  const handleDonorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to register as a donor.");
    
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      userId: user.uid,
      fullName: formData.get("fullName"),
      bloodGroup: formData.get("bloodGroup"),
      age: formData.get("age"),
      gender: formData.get("gender"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      availability: "Available",
      lastDonation: formData.get("lastDonation") || "Never",
      timestamp: Timestamp.now()
    };

    try {
      await addDoc(collection(db, "blood_donors"), data);
      toast.success("Registered as a donor! Thank you for your contribution.");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to request blood.");

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      userId: user.uid,
      patientName: formData.get("patientName"),
      bloodGroup: formData.get("bloodGroup"),
      units: formData.get("units"),
      urgency: formData.get("urgency"),
      hospital: formData.get("hospital"),
      contact: formData.get("contact"),
      address: formData.get("address"),
      status: "Pending",
      timestamp: Timestamp.now()
    };

    try {
      await addDoc(collection(db, "blood_requests"), data);
      toast.success("Blood request posted! We are matching you with donors.");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error("Failed to post request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-8 max-w-6xl">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive text-white shadow-lg shadow-destructive/20">
                <Droplets className="h-5 w-5" />
              </div>
              Blood Ecosystem
            </h1>
            <p className="mt-1 text-muted-foreground">Real-time availability, donor matching, and emergency requests.</p>
          </div>
          <Badge variant="outline" className="bg-destructive/5 text-destructive border-destructive/20 px-4 py-1.5 font-bold">
            <Heart className="h-3 w-3 mr-2 fill-current" /> 124 Lives Saved Today
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 h-14 rounded-2xl bg-muted/50 p-1.5">
            <TabsTrigger value="availability" className="rounded-xl gap-2 font-bold data-[state=active]:bg-destructive data-[state=active]:text-white">
              <Hospital className="h-4 w-4" /> <span className="hidden sm:inline">Availability</span>
            </TabsTrigger>
            <TabsTrigger value="receiver" className="rounded-xl gap-2 font-bold data-[state=active]:bg-destructive data-[state=active]:text-white">
              <Search className="h-4 w-4" /> <span className="hidden sm:inline">Receiver</span>
            </TabsTrigger>
            <TabsTrigger value="donor" className="rounded-xl gap-2 font-bold data-[state=active]:bg-destructive data-[state=active]:text-white">
              <UserPlus className="h-4 w-4" /> <span className="hidden sm:inline">Donor</span>
            </TabsTrigger>
          </TabsList>

          {/* Availability Tab */}
          <TabsContent value="availability" className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search hospitals or locations..." 
                  className="pl-9 h-12 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedBloodGroup} onValueChange={setSelectedBloodGroup}>
                <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl">
                  <SelectValue placeholder="Blood Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Groups</SelectItem>
                  {bloodGroups.map(bg => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredHospitals.map((h) => (
                <Card key={h.id} className="overflow-hidden card-shadow hover:card-shadow-hover transition-all border-border/50">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{h.image}</div>
                        <div>
                          <CardTitle className="text-lg">{h.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 text-[10px] uppercase font-bold">
                            <MapPin className="h-3 w-3" /> {h.location}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(h.bloodStock).map(([group, units]) => (
                        <div 
                          key={group} 
                          className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-colors ${
                            units > 0 ? 'bg-destructive/5 border-destructive/20' : 'bg-muted/50 border-border opacity-40'
                          } ${selectedBloodGroup === group ? 'ring-2 ring-destructive' : ''}`}
                        >
                          <span className="text-xs font-bold text-destructive">{group}</span>
                          <span className="text-[10px] font-medium">{units} Units</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-dashed flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" /> Updated 12m ago
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive font-bold h-8 gap-1">
                        <Phone className="h-3 w-3" /> Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Receiver Tab */}
          <TabsContent value="receiver" className="grid gap-8 lg:grid-cols-12 animate-fade-in">
            <div className="lg:col-span-5">
              <Card className="rounded-[2rem] border-destructive/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Request Blood
                  </CardTitle>
                  <CardDescription>Post an emergency request to notify nearby donors.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRequestSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Patient Full Name</Label>
                      <Input name="patientName" placeholder="Enter patient name" required className="rounded-xl" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Blood Group</Label>
                        <Select name="bloodGroup" required>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {bloodGroups.map(bg => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Units Required</Label>
                        <Input name="units" type="number" placeholder="e.g. 2" required className="rounded-xl" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Urgency Level</Label>
                      <Select name="urgency" defaultValue="Normal">
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select Urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="Urgent">Urgent (Within 6h)</SelectItem>
                          <SelectItem value="Emergency">Emergency (Immediate)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Hospital & Address</Label>
                      <Textarea name="address" placeholder="Hospital name and complete address" required className="rounded-xl resize-none" rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Number</Label>
                      <Input name="contact" type="tel" placeholder="+1 (555) 000-0000" required className="rounded-xl" />
                    </div>
                    <Button type="submit" className="w-full bg-destructive hover:bg-destructive/90 h-12 rounded-xl font-bold shadow-lg shadow-destructive/20" disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Droplets className="h-4 w-4 mr-2" />}
                      Post Request
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  Matching Donors
                </h3>
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                  {donors.length} Available
                </Badge>
              </div>
              
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {donors.map((donor, i) => (
                    <Card key={i} className="rounded-2xl border-border/50 hover:border-destructive/20 transition-all group">
                      <CardContent className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive font-bold text-lg">
                            {donor.bloodGroup}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{donor.fullName}</p>
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {donor.address}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="rounded-xl h-9 gap-2 border-destructive/20 text-destructive hover:bg-destructive/5">
                            <Phone className="h-3 w-3" /> Call
                          </Button>
                          <Button size="sm" className="rounded-xl h-9 bg-destructive hover:bg-destructive/90">
                            Request
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {donors.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed rounded-[2rem] bg-muted/20">
                      <UserPlus className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                      <p className="text-muted-foreground font-medium">No matching donors found yet.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          {/* Donor Tab */}
          <TabsContent value="donor" className="animate-fade-in">
            <div className="grid gap-8 lg:grid-cols-2 items-start">
              <div className="space-y-6">
                <div className="rounded-[2.5rem] bg-destructive/5 p-10 border border-destructive/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Heart className="h-32 w-32 fill-destructive" />
                  </div>
                  <Badge className="bg-destructive text-white mb-6 px-4 py-1 font-bold uppercase tracking-widest text-[10px]">Be a Hero</Badge>
                  <h2 className="text-4xl font-heading font-extrabold text-destructive mb-6 leading-tight">Your Blood Can <br />Save Three Lives</h2>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    Every donation counts. Join our network of 5,000+ verified donors and get notified when someone in your area needs help.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      </div>
                      <p className="text-sm font-bold">Verified Medical Profile</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      </div>
                      <p className="text-sm font-bold">Emergency Alerts in your Area</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      </div>
                      <p className="text-sm font-bold">Track your Donation History</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-muted/30 border border-dashed border-border flex gap-4">
                  <Info className="h-6 w-6 text-primary shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong>Eligibility:</strong> You must be between 18-65 years old, weigh at least 50kg, and be in good general health. Please consult a doctor if you have chronic conditions.
                  </p>
                </div>
              </div>

              <Card className="rounded-[2.5rem] border-border/50 shadow-2xl">
                <CardHeader>
                  <CardTitle>Donor Registration</CardTitle>
                  <CardDescription>Fill in your details to join the donor network.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleDonorSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input name="fullName" placeholder="John Doe" required className="rounded-xl h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label>Blood Group</Label>
                        <Select name="bloodGroup" required>
                          <SelectTrigger className="rounded-xl h-12">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {bloodGroups.map(bg => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Age</Label>
                        <Input name="age" type="number" placeholder="Years" required className="rounded-xl h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select name="gender" required>
                          <SelectTrigger className="rounded-xl h-12">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input name="phone" type="tel" placeholder="+1 (555) 000-0000" required className="rounded-xl h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label>Current Address / Location</Label>
                      <Textarea name="address" placeholder="Enter your city or complete address" required className="rounded-xl h-12 resize-none" />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Donation Date (Optional)</Label>
                      <Input name="lastDonation" type="date" className="rounded-xl h-12" />
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                      <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        By registering, you agree to be contacted by MedCare or verified hospitals in case of a matching blood request. Your data is encrypted and secure.
                      </p>
                    </div>
                    <Button type="submit" className="w-full bg-destructive hover:bg-destructive/90 h-14 rounded-2xl font-bold text-lg shadow-xl shadow-destructive/20" disabled={loading}>
                      {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <UserPlus className="h-5 w-5 mr-2" />}
                      Register as Donor
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Blood;