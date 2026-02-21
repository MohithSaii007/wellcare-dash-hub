"use client";

import React, { useState, useEffect } from "react";
import { User, Shield, HeartPulse, PhoneCall, Save, Loader2, Camera } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";

interface UserProfile {
  personal: {
    fullName: string;
    phone: string;
    dob: string;
    gender: string;
    address: string;
  };
  medical: {
    bloodGroup: string;
    allergies: string;
    chronicConditions: string;
    medications: string;
  };
  emergency: {
    contactName: string;
    relation: string;
    contactPhone: string;
  };
}

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    personal: { fullName: "", phone: "", dob: "", gender: "", address: "" },
    medical: { bloodGroup: "", allergies: "", chronicConditions: "", medications: "" },
    emergency: { contactName: "", relation: "", contactPhone: "" }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, "profiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          // Initialize with user's display name if available
          setProfile(prev => ({
            ...prev,
            personal: { ...prev.personal, fullName: user.displayName || "" }
          }));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "profiles", user.uid), profile);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <div className="mb-8 flex flex-col md:flex-row items-center gap-6 animate-fade-in">
          <div className="relative">
            <div className="h-24 w-24 rounded-full hero-gradient flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-xl">
              {profile.personal.fullName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
            </div>
            <Button size="icon" variant="secondary" className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow-md">
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-heading font-bold">{profile.personal.fullName || "User Profile"}</h1>
            <p className="text-muted-foreground">{user?.email}</p>
            <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                Verified Account
              </Badge>
              {profile.medical.bloodGroup && (
                <Badge variant="outline" className="bg-destructive/5 text-destructive border-destructive/20">
                  Blood Group: {profile.medical.bloodGroup}
                </Badge>
              )}
            </div>
          </div>
          <div className="md:ml-auto">
            <Button onClick={handleSave} disabled={saving} className="hero-gradient shadow-lg">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="personal" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="personal" className="gap-2">
              <User className="h-4 w-4" /> <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="medical" className="gap-2">
              <HeartPulse className="h-4 w-4" /> <span className="hidden sm:inline">Medical</span>
            </TabsTrigger>
            <TabsTrigger value="emergency" className="gap-2">
              <PhoneCall className="h-4 w-4" /> <span className="hidden sm:inline">Emergency</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Manage your basic contact and identity details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName" 
                      value={profile.personal.fullName} 
                      onChange={(e) => setProfile({...profile, personal: {...profile.personal, fullName: e.target.value}})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={profile.personal.phone} 
                      onChange={(e) => setProfile({...profile, personal: {...profile.personal, phone: e.target.value}})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input 
                      id="dob" 
                      type="date"
                      value={profile.personal.dob} 
                      onChange={(e) => setProfile({...profile, personal: {...profile.personal, dob: e.target.value}})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select 
                      value={profile.personal.gender} 
                      onValueChange={(v) => setProfile({...profile, personal: {...profile.personal, gender: v}})}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select Gender" />
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
                  <Label htmlFor="address">Residential Address</Label>
                  <Textarea 
                    id="address" 
                    value={profile.personal.address} 
                    onChange={(e) => setProfile({...profile, personal: {...profile.personal, address: e.target.value}})}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medical" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Medical Records
                </CardTitle>
                <CardDescription>This information helps doctors provide better care during consultations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select 
                    value={profile.medical.bloodGroup} 
                    onValueChange={(v) => setProfile({...profile, medical: {...profile.medical, bloodGroup: v}})}
                  >
                    <SelectTrigger id="bloodGroup">
                      <SelectValue placeholder="Select Blood Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                        <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea 
                    id="allergies" 
                    placeholder="e.g. Penicillin, Peanuts, Latex..."
                    value={profile.medical.allergies} 
                    onChange={(e) => setProfile({...profile, medical: {...profile.medical, allergies: e.target.value}})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chronic">Chronic Conditions</Label>
                  <Textarea 
                    id="chronic" 
                    placeholder="e.g. Diabetes, Hypertension, Asthma..."
                    value={profile.medical.chronicConditions} 
                    onChange={(e) => setProfile({...profile, medical: {...profile.medical, chronicConditions: e.target.value}})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea 
                    id="medications" 
                    placeholder="List any medicines you take regularly..."
                    value={profile.medical.medications} 
                    onChange={(e) => setProfile({...profile, medical: {...profile.medical, medications: e.target.value}})}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency" className="animate-fade-in">
            <Card className="border-destructive/20">
              <CardHeader className="bg-destructive/5">
                <CardTitle className="text-destructive flex items-center gap-2">
                  <PhoneCall className="h-5 w-5" />
                  Emergency Contact
                </CardTitle>
                <CardDescription>Who should we contact in case of a medical emergency?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Person Name</Label>
                    <Input 
                      id="contactName" 
                      value={profile.emergency.contactName} 
                      onChange={(e) => setProfile({...profile, emergency: {...profile.emergency, contactName: e.target.value}})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relation">Relationship</Label>
                    <Input 
                      id="relation" 
                      placeholder="e.g. Spouse, Parent, Sibling"
                      value={profile.emergency.relation} 
                      onChange={(e) => setProfile({...profile, emergency: {...profile.emergency, relation: e.target.value}})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Emergency Phone Number</Label>
                  <Input 
                    id="contactPhone" 
                    value={profile.emergency.contactPhone} 
                    onChange={(e) => setProfile({...profile, emergency: {...profile.emergency, contactPhone: e.target.value}})}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

const Badge = ({ children, variant = "default", className }: { children: React.ReactNode; variant?: "default" | "outline"; className?: string }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
    variant === "outline" ? "border" : "bg-primary text-primary-foreground"
  } ${className}`}>
    {children}
  </span>
);

export default Profile;