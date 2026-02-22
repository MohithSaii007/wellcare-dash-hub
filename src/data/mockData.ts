export interface Pharmacy {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string;
  deliveryCharge: number;
}

export interface MedicinePrice {
  pharmacyId: string;
  price: number;
  stock: number;
  discount: number;
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  description: string;
  usage: string;
  price: number; // Base price
  requiresPrescription: boolean;
  prices?: MedicinePrice[]; // Comparison data
}

export const pharmacies: Pharmacy[] = [
  { id: "p1", name: "Apollo Pharmacy", rating: 4.8, deliveryTime: "30-45 mins", deliveryCharge: 20 },
  { id: "p2", name: "Netmeds Plus", rating: 4.6, deliveryTime: "1-2 hours", deliveryCharge: 0 },
  { id: "p3", name: "Wellness Forever", rating: 4.9, deliveryTime: "20-30 mins", deliveryCharge: 40 },
  { id: "p4", name: "MedPlus Express", rating: 4.5, deliveryTime: "45-60 mins", deliveryCharge: 15 },
];

export const medicines: Medicine[] = [
  { 
    id: "1", name: "Paracetamol 500mg", category: "Fever", 
    description: "Pain reliever and fever reducer", 
    usage: "1-2 tablets every 4-6 hours as needed", 
    price: 30, requiresPrescription: false,
    prices: [
      { pharmacyId: "p1", price: 28, stock: 150, discount: 5 },
      { pharmacyId: "p2", price: 25, stock: 200, discount: 10 },
      { pharmacyId: "p3", price: 32, stock: 50, discount: 0 },
      { pharmacyId: "p4", price: 29, stock: 100, discount: 2 }
    ]
  },
  { 
    id: "2", name: "Cetirizine 10mg", category: "Cold & Cough", 
    description: "Antihistamine for allergies and cold symptoms", 
    usage: "1 tablet daily", 
    price: 45, requiresPrescription: false,
    prices: [
      { pharmacyId: "p1", price: 42, stock: 80, discount: 8 },
      { pharmacyId: "p2", price: 40, stock: 120, discount: 12 },
      { pharmacyId: "p3", price: 48, stock: 30, discount: 0 }
    ]
  },
  { 
    id: "4", name: "Metformin 500mg", category: "Chronic Diseases", 
    description: "Helps control blood sugar levels in Type 2 Diabetes", 
    usage: "As prescribed by doctor", 
    price: 120, requiresPrescription: true,
    prices: [
      { pharmacyId: "p1", price: 115, stock: 40, discount: 5 },
      { pharmacyId: "p2", price: 110, stock: 60, discount: 15 },
      { pharmacyId: "p4", price: 118, stock: 25, discount: 0 }
    ]
  },
];

export const medicineCategories = ["All", "Fever", "Cold & Cough", "Skin Diseases", "Chronic Diseases"];

export interface Disease {
  id: string;
  name: string;
  description: string;
  causes: string[];
  symptoms: string[];
  cures: string[];
  medicines: string[];
  category: string;
}

// Sorted from Newest (ID 3) to Oldest (ID 1)
export const diseases: Disease[] = [
  {
    id: "3", name: "Dengue Fever", category: "Infectious",
    description: "A mosquito-borne viral disease occurring in tropical and subtropical areas.",
    causes: ["Aedes mosquito bite", "Dengue virus (DENV)", "Stagnant water near living areas"],
    symptoms: ["High fever", "Severe headache", "Pain behind eyes", "Joint and muscle pain", "Skin rash"],
    cures: ["Hydration", "Complete bed rest", "Monitoring platelet count"],
    medicines: ["Paracetamol (Avoid Aspirin/Ibuprofen)", "Electrolyte solutions"],
  },
  {
    id: "2", name: "Hypertension", category: "Chronic",
    description: "A condition in which the force of the blood against the artery walls is too high.",
    causes: ["High salt intake", "Lack of physical activity", "Stress", "Genetics"],
    symptoms: ["Headaches", "Shortness of breath", "Nosebleeds", "Dizziness"],
    cures: ["Low-sodium diet", "Regular exercise", "Stress management"],
    medicines: ["Amlodipine", "Losartan", "Telmisartan"],
  },
  {
    id: "1", name: "Common Cold", category: "Respiratory",
    description: "A viral infection of the upper respiratory tract affecting the nose and throat.",
    causes: ["Rhinovirus", "Coronavirus (common cold type)", "Close contact with infected person"],
    symptoms: ["Runny or stuffy nose", "Sore throat", "Cough", "Sneezing", "Low-grade fever"],
    cures: ["Rest and hydration", "Warm fluids", "Steam inhalation"],
    medicines: ["Paracetamol", "Cetirizine", "Vitamin C"],
  },
];

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  experience: number;
  avatar: string;
  photoUrl?: string;
  homeVisit: boolean;
  fee: number;
}

export const doctors: Doctor[] = [
  { id: "1", name: "Dr. Sarah Johnson", specialty: "General Physician", hospital: "City Medical Center", rating: 4.8, experience: 12, avatar: "SJ", photoUrl: "https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=200&h=200", homeVisit: true, fee: 500 },
  { id: "2", name: "Dr. Rajesh Kumar", specialty: "Cardiologist", hospital: "Heart Care Hospital", rating: 4.9, experience: 18, avatar: "RK", photoUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200", homeVisit: false, fee: 1200 },
];

export interface Hospital {
  id: string;
  name: string;
  location: string;
  specialties: string[];
  rating: number;
  image: string;
}

export const hospitals: Hospital[] = [
  { id: "1", name: "City Medical Center", location: "123 Main Street, Downtown", specialties: ["General Medicine", "Cardiology", "Neurology", "Orthopedics"], rating: 4.7, image: "🏥" },
];

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export const timeSlots: TimeSlot[] = [
  { id: "1", time: "09:00 AM", available: true },
  { id: "2", time: "09:30 AM", available: true },
  { id: "3", time: "10:00 AM", available: false },
];