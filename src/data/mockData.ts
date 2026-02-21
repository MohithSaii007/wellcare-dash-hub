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

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  experience: number;
  avatar: string;
  homeVisit: boolean;
  fee: number;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  specialties: string[];
  rating: number;
  image: string;
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  description: string;
  usage: string;
  price: number;
  requiresPrescription: boolean;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export const diseases: Disease[] = [
  {
    id: "1", name: "Common Cold", category: "Respiratory",
    description: "A viral infection of the upper respiratory tract affecting the nose and throat.",
    causes: ["Rhinovirus", "Coronavirus (common cold type)", "Close contact with infected person", "Weakened immune system"],
    symptoms: ["Runny or stuffy nose", "Sore throat", "Cough", "Mild body aches", "Sneezing", "Low-grade fever"],
    cures: ["Rest and hydration", "Warm fluids and soups", "Steam inhalation", "Saltwater gargle"],
    medicines: ["Paracetamol", "Cetirizine", "Nasal decongestant spray", "Vitamin C supplements"],
  },
  {
    id: "2", name: "Fever", category: "General",
    description: "An increase in body temperature above the normal range, often indicating an underlying infection.",
    causes: ["Bacterial infection", "Viral infection", "Heat exhaustion", "Inflammatory conditions"],
    symptoms: ["High body temperature (>100.4°F)", "Chills and shivering", "Sweating", "Headache", "Muscle aches", "Loss of appetite"],
    cures: ["Rest and hydration", "Cool compresses", "Light clothing", "Adequate fluid intake"],
    medicines: ["Paracetamol (Acetaminophen)", "Ibuprofen", "Aspirin (adults only)", "ORS sachets"],
  },
  {
    id: "3", name: "Diabetes (Type 2)", category: "Chronic",
    description: "A chronic metabolic condition where the body doesn't use insulin effectively, leading to high blood sugar.",
    causes: ["Obesity", "Sedentary lifestyle", "Genetic predisposition", "Poor diet", "Age (over 45)"],
    symptoms: ["Increased thirst", "Frequent urination", "Blurred vision", "Fatigue", "Slow-healing wounds", "Tingling in hands/feet"],
    cures: ["Regular exercise", "Balanced diet", "Weight management", "Blood sugar monitoring", "Stress management"],
    medicines: ["Metformin", "Glimepiride", "Insulin (if prescribed)", "Sitagliptin"],
  },
  {
    id: "4", name: "Hypertension", category: "Chronic",
    description: "A condition in which blood pressure in the arteries is persistently elevated.",
    causes: ["High salt intake", "Obesity", "Stress", "Smoking", "Family history", "Sedentary lifestyle"],
    symptoms: ["Headaches", "Shortness of breath", "Nosebleeds", "Dizziness", "Chest pain", "Often no symptoms"],
    cures: ["Low-sodium diet", "Regular exercise", "Stress reduction", "Limit alcohol", "Maintain healthy weight"],
    medicines: ["Amlodipine", "Losartan", "Atenolol", "Hydrochlorothiazide"],
  },
  {
    id: "5", name: "Migraine", category: "Neurological",
    description: "A type of headache characterized by intense, debilitating pain often accompanied by nausea and light sensitivity.",
    causes: ["Stress", "Hormonal changes", "Certain foods", "Sleep changes", "Bright lights", "Weather changes"],
    symptoms: ["Throbbing head pain", "Nausea/vomiting", "Light sensitivity", "Sound sensitivity", "Aura (visual disturbances)"],
    cures: ["Rest in dark room", "Cold compress on forehead", "Adequate sleep", "Stress management", "Identify triggers"],
    medicines: ["Sumatriptan", "Ibuprofen", "Naproxen", "Rizatriptan"],
  },
  {
    id: "6", name: "Skin Allergy", category: "Dermatology",
    description: "An immune system reaction to substances that come into contact with the skin.",
    causes: ["Pollen", "Certain foods", "Cosmetics", "Detergents", "Insect bites", "Medications"],
    symptoms: ["Redness", "Itching", "Rash", "Swelling", "Hives", "Dry or scaly skin"],
    cures: ["Avoid allergens", "Cool compresses", "Moisturize skin", "Oatmeal baths"],
    medicines: ["Cetirizine", "Hydrocortisone cream", "Calamine lotion", "Fexofenadine"],
  },
];

export const doctors: Doctor[] = [
  { id: "1", name: "Dr. Sarah Johnson", specialty: "General Physician", hospital: "City Medical Center", rating: 4.8, experience: 12, avatar: "SJ", homeVisit: true, fee: 500 },
  { id: "2", name: "Dr. Rajesh Kumar", specialty: "Cardiologist", hospital: "Heart Care Hospital", rating: 4.9, experience: 18, avatar: "RK", homeVisit: false, fee: 1200 },
  { id: "3", name: "Dr. Emily Chen", specialty: "Dermatologist", hospital: "Skin & Care Clinic", rating: 4.7, experience: 10, avatar: "EC", homeVisit: true, fee: 800 },
  { id: "4", name: "Dr. Michael Brown", specialty: "Neurologist", hospital: "City Medical Center", rating: 4.6, experience: 15, avatar: "MB", homeVisit: false, fee: 1000 },
  { id: "5", name: "Dr. Priya Sharma", specialty: "Endocrinologist", hospital: "Metro Health Hospital", rating: 4.8, experience: 14, avatar: "PS", homeVisit: true, fee: 900 },
  { id: "6", name: "Dr. James Wilson", specialty: "General Physician", hospital: "Green Valley Hospital", rating: 4.5, experience: 8, avatar: "JW", homeVisit: true, fee: 450 },
];

export const hospitals: Hospital[] = [
  { id: "1", name: "City Medical Center", location: "123 Main Street, Downtown", specialties: ["General Medicine", "Cardiology", "Neurology", "Orthopedics"], rating: 4.7, image: "🏥" },
  { id: "2", name: "Heart Care Hospital", location: "456 Health Avenue, Midtown", specialties: ["Cardiology", "Cardiac Surgery", "Vascular Medicine"], rating: 4.9, image: "🏥" },
  { id: "3", name: "Skin & Care Clinic", location: "789 Beauty Lane, Uptown", specialties: ["Dermatology", "Cosmetology", "Allergy Treatment"], rating: 4.6, image: "🏥" },
  { id: "4", name: "Metro Health Hospital", location: "321 Central Road, Metro Area", specialties: ["Endocrinology", "General Medicine", "Pediatrics", "Gynecology"], rating: 4.8, image: "🏥" },
  { id: "5", name: "Green Valley Hospital", location: "654 Park Drive, Suburbs", specialties: ["General Medicine", "ENT", "Ophthalmology", "Dental"], rating: 4.5, image: "🏥" },
];

export const medicines: Medicine[] = [
  { id: "1", name: "Paracetamol 500mg", category: "Fever", description: "Pain reliever and fever reducer", usage: "1-2 tablets every 4-6 hours as needed", price: 30, requiresPrescription: false },
  { id: "2", name: "Cetirizine 10mg", category: "Cold & Cough", description: "Antihistamine for allergies and cold symptoms", usage: "1 tablet daily", price: 45, requiresPrescription: false },
  { id: "3", name: "Ibuprofen 400mg", category: "Fever", description: "Anti-inflammatory and pain reliever", usage: "1 tablet every 6-8 hours with food", price: 55, requiresPrescription: false },
  { id: "4", name: "Metformin 500mg", category: "Chronic Diseases", description: "Helps control blood sugar levels in Type 2 Diabetes", usage: "As prescribed by doctor", price: 120, requiresPrescription: true },
  { id: "5", name: "Amlodipine 5mg", category: "Chronic Diseases", description: "Calcium channel blocker for hypertension", usage: "1 tablet daily as prescribed", price: 95, requiresPrescription: true },
  { id: "6", name: "Dextromethorphan Syrup", category: "Cold & Cough", description: "Cough suppressant syrup", usage: "10ml every 6-8 hours", price: 85, requiresPrescription: false },
  { id: "7", name: "Hydrocortisone Cream", category: "Skin Diseases", description: "Topical corticosteroid for skin inflammation", usage: "Apply thin layer to affected area 2-3 times daily", price: 110, requiresPrescription: false },
  { id: "8", name: "Calamine Lotion", category: "Skin Diseases", description: "Soothes itchy and irritated skin", usage: "Apply to affected area as needed", price: 65, requiresPrescription: false },
  { id: "9", name: "ORS Sachets (Pack of 10)", category: "Fever", description: "Oral rehydration salts for dehydration", usage: "Dissolve 1 sachet in 1 liter of clean water", price: 40, requiresPrescription: false },
  { id: "10", name: "Sumatriptan 50mg", category: "Chronic Diseases", description: "For acute migraine treatment", usage: "1 tablet at onset of migraine", price: 180, requiresPrescription: true },
  { id: "11", name: "Vitamin C 500mg", category: "Cold & Cough", description: "Immune system booster", usage: "1 tablet daily", price: 75, requiresPrescription: false },
  { id: "12", name: "Antifungal Cream", category: "Skin Diseases", description: "Treats fungal skin infections", usage: "Apply twice daily to affected area", price: 130, requiresPrescription: false },
];

export const timeSlots: TimeSlot[] = [
  { id: "1", time: "09:00 AM", available: true },
  { id: "2", time: "09:30 AM", available: true },
  { id: "3", time: "10:00 AM", available: false },
  { id: "4", time: "10:30 AM", available: true },
  { id: "5", time: "11:00 AM", available: true },
  { id: "6", time: "11:30 AM", available: false },
  { id: "7", time: "12:00 PM", available: true },
  { id: "8", time: "02:00 PM", available: true },
  { id: "9", time: "02:30 PM", available: false },
  { id: "10", time: "03:00 PM", available: true },
  { id: "11", time: "03:30 PM", available: true },
  { id: "12", time: "04:00 PM", available: true },
];

export const medicineCategories = ["All", "Fever", "Cold & Cough", "Skin Diseases", "Chronic Diseases"];
