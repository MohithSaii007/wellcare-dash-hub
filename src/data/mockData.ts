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
  price: number;
  requiresPrescription: boolean;
  prices?: MedicinePrice[];
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
      { pharmacyId: "p3", price: 32, stock: 50, discount: 0 }
    ]
  },
  { 
    id: "2", name: "Cetirizine 10mg", category: "Cold & Cough", 
    description: "Antihistamine for allergies and cold symptoms", 
    usage: "1 tablet daily", 
    price: 45, requiresPrescription: false,
    prices: [
      { pharmacyId: "p1", price: 42, stock: 80, discount: 8 },
      { pharmacyId: "p2", price: 40, stock: 120, discount: 12 }
    ]
  },
  { 
    id: "3", name: "Amoxicillin 500mg", category: "Infectious", 
    description: "Antibiotic used to treat various bacterial infections", 
    usage: "As prescribed by doctor", 
    price: 150, requiresPrescription: true,
    prices: [
      { pharmacyId: "p1", price: 145, stock: 30, discount: 5 },
      { pharmacyId: "p3", price: 155, stock: 20, discount: 0 }
    ]
  },
  { 
    id: "4", name: "Metformin 500mg", category: "Chronic Diseases", 
    description: "Helps control blood sugar levels in Type 2 Diabetes", 
    usage: "As prescribed by doctor", 
    price: 120, requiresPrescription: true,
    prices: [
      { pharmacyId: "p1", price: 115, stock: 40, discount: 5 },
      { pharmacyId: "p2", price: 110, stock: 60, discount: 15 }
    ]
  },
  { 
    id: "5", name: "Atorvastatin 10mg", category: "Chronic Diseases", 
    description: "Used to lower cholesterol and reduce risk of heart disease", 
    usage: "1 tablet daily at night", 
    price: 180, requiresPrescription: true,
    prices: [
      { pharmacyId: "p1", price: 175, stock: 50, discount: 5 },
      { pharmacyId: "p4", price: 170, stock: 45, discount: 10 }
    ]
  },
  { 
    id: "m6", name: "Ibuprofen 400mg", category: "Fever", 
    description: "Nonsteroidal anti-inflammatory drug (NSAID) for pain and fever", 
    usage: "1 tablet every 6-8 hours", 
    price: 55, requiresPrescription: false,
    prices: [
      { pharmacyId: "p1", price: 50, stock: 100, discount: 10 },
      { pharmacyId: "p3", price: 58, stock: 40, discount: 0 }
    ]
  },
  { 
    id: "m7", name: "Azithromycin 500mg", category: "Infectious", 
    description: "Broad-spectrum antibiotic for respiratory and skin infections", 
    usage: "Once daily for 3-5 days", 
    price: 210, requiresPrescription: true,
    prices: [
      { pharmacyId: "p2", price: 195, stock: 25, discount: 15 },
      { pharmacyId: "p4", price: 205, stock: 15, discount: 5 }
    ]
  },
  { 
    id: "m8", name: "Hydrocortisone Cream", category: "Skin Diseases", 
    description: "Topical steroid for skin inflammation and itching", 
    usage: "Apply to affected area 2-3 times daily", 
    price: 85, requiresPrescription: false,
    prices: [
      { pharmacyId: "p1", price: 80, stock: 60, discount: 5 },
      { pharmacyId: "p3", price: 90, stock: 30, discount: 0 }
    ]
  },
  { 
    id: "m9", name: "Loratadine 10mg", category: "Cold & Cough", 
    description: "Non-drowsy antihistamine for allergy relief", 
    usage: "1 tablet daily", 
    price: 40, requiresPrescription: false,
    prices: [
      { pharmacyId: "p2", price: 35, stock: 150, discount: 10 },
      { pharmacyId: "p4", price: 38, stock: 90, discount: 5 }
    ]
  },
  { 
    id: "m10", name: "Omeprazole 20mg", category: "Chronic Diseases", 
    description: "Proton pump inhibitor for acid reflux and ulcers", 
    usage: "1 capsule daily before breakfast", 
    price: 95, requiresPrescription: true,
    prices: [
      { pharmacyId: "p1", price: 90, stock: 70, discount: 5 },
      { pharmacyId: "p2", price: 85, stock: 100, discount: 15 }
    ]
  }
];

export const medicineCategories = ["All", "Fever", "Cold & Cough", "Skin Diseases", "Chronic Diseases", "Infectious"];

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

export const diseases: Disease[] = [
  {
    id: "d1", name: "Malaria", category: "Infectious",
    description: "A disease caused by a plasmodium parasite, transmitted by the bite of infected mosquitoes.",
    causes: ["Anopheles mosquito bite", "Plasmodium parasite", "Contaminated blood transfusion"],
    symptoms: ["Chills", "Fatigue", "Fever", "Night sweats", "Shivering"],
    cures: ["Antimalarial treatment", "Fluid replacement", "Rest"],
    medicines: ["Chloroquine", "Artemether", "Lumefantrine"],
  },
  {
    id: "d2", name: "Diabetes Mellitus", category: "Chronic",
    description: "A group of diseases that result in too much sugar in the blood (high blood glucose).",
    causes: ["Insulin resistance", "Genetics", "Obesity", "Lack of exercise"],
    symptoms: ["Increased thirst", "Frequent urination", "Hunger", "Fatigue", "Blurred vision"],
    cures: ["Dietary changes", "Physical activity", "Blood sugar monitoring"],
    medicines: ["Metformin", "Insulin", "Glipizide"],
  },
  {
    id: "d3", name: "Asthma", category: "Respiratory",
    description: "A condition in which a person's airways become inflamed, narrow and swell, and produce extra mucus.",
    causes: ["Allergens (pollen, dust)", "Air pollution", "Respiratory infections", "Cold air"],
    symptoms: ["Difficulty breathing", "Chest pain", "Cough", "Wheezing"],
    cures: ["Avoiding triggers", "Breathing exercises", "Regular checkups"],
    medicines: ["Albuterol", "Fluticasone", "Montelukast"],
  },
  {
    id: "d4", name: "Dengue Fever", category: "Infectious",
    description: "A mosquito-borne viral disease occurring in tropical and subtropical areas.",
    causes: ["Aedes mosquito bite", "Dengue virus (DENV)", "Stagnant water near living areas"],
    symptoms: ["High fever", "Severe headache", "Pain behind eyes", "Joint and muscle pain", "Skin rash"],
    cures: ["Hydration", "Complete bed rest", "Monitoring platelet count"],
    medicines: ["Paracetamol", "Electrolyte solutions"],
  },
  {
    id: "d5", name: "Hypertension", category: "Chronic",
    description: "A condition in which the force of the blood against the artery walls is too high.",
    causes: ["High salt intake", "Lack of physical activity", "Stress", "Genetics"],
    symptoms: ["Headaches", "Shortness of breath", "Nosebleeds", "Dizziness"],
    cures: ["Low-sodium diet", "Regular exercise", "Stress management"],
    medicines: ["Amlodipine", "Losartan", "Telmisartan"],
  },
  {
    id: "d6", name: "Common Cold", category: "Respiratory",
    description: "A viral infection of the upper respiratory tract affecting the nose and throat.",
    causes: ["Rhinovirus", "Coronavirus", "Close contact with infected person"],
    symptoms: ["Runny or stuffy nose", "Sore throat", "Cough", "Sneezing", "Low-grade fever"],
    cures: ["Rest and hydration", "Warm fluids", "Steam inhalation"],
    medicines: ["Paracetamol", "Cetirizine", "Vitamin C"],
  },
  {
    id: "d7", name: "Tuberculosis (TB)", category: "Infectious",
    description: "A potentially serious infectious bacterial disease that mainly affects the lungs.",
    causes: ["Mycobacterium tuberculosis bacteria", "Airborne droplets from coughs/sneezes"],
    symptoms: ["Persistent cough", "Chest pain", "Coughing up blood", "Weight loss", "Night sweats"],
    cures: ["Long-term antibiotic course", "DOTS therapy", "Nutritional support"],
    medicines: ["Isoniazid", "Rifampin", "Ethambutol", "Pyrazinamide"],
  },
  {
    id: "d8", name: "Typhoid Fever", category: "Infectious",
    description: "A bacterial infection that can spread throughout the body, affecting many organs.",
    causes: ["Salmonella typhi bacteria", "Contaminated food or water", "Poor sanitation"],
    symptoms: ["High fever", "Headache", "Stomach pain", "Constipation or diarrhea", "Rose-colored spots"],
    cures: ["Antibiotics", "Fluid replacement", "Soft diet"],
    medicines: ["Ciprofloxacin", "Ceftriaxone", "Azithromycin"],
  },
  {
    id: "d9", name: "Pneumonia", category: "Respiratory",
    description: "Infection that inflames air sacs in one or both lungs, which may fill with fluid.",
    causes: ["Bacteria (Streptococcus pneumoniae)", "Viruses (Flu, COVID-19)", "Fungi"],
    symptoms: ["Cough with phlegm", "Fever", "Chills", "Difficulty breathing", "Chest pain"],
    cures: ["Antibiotics or antivirals", "Oxygen therapy", "Rest"],
    medicines: ["Amoxicillin", "Azithromycin", "Levofloxacin"],
  },
  {
    id: "d10", name: "Arthritis", category: "Musculoskeletal",
    description: "Inflammation of one or more joints, causing pain and stiffness that can worsen with age.",
    causes: ["Wear and tear (Osteoarthritis)", "Autoimmune response (Rheumatoid)", "Infection"],
    symptoms: ["Joint pain", "Stiffness", "Swelling", "Redness", "Decreased range of motion"],
    cures: ["Physical therapy", "Weight management", "Low-impact exercise"],
    medicines: ["Ibuprofen", "Methotrexate", "Naproxen"],
  },
  {
    id: "d11", name: "Migraine", category: "Neurological",
    description: "A neurological condition that can cause multiple symptoms, most notably intense headaches.",
    causes: ["Hormonal changes", "Stress", "Certain foods", "Sleep changes", "Sensory stimuli"],
    symptoms: ["Severe throbbing pain", "Nausea", "Sensitivity to light/sound", "Aura"],
    cures: ["Dark room rest", "Hydration", "Stress reduction"],
    medicines: ["Sumatriptan", "Ibuprofen", "Propranolol"],
  },
  {
    id: "d12", name: "Psoriasis", category: "Dermatology",
    description: "A condition in which skin cells build up and form scales and itchy, dry patches.",
    causes: ["Immune system problem", "Genetics", "Triggers like stress or cold"],
    symptoms: ["Red patches of skin", "Silvery scales", "Dry, cracked skin", "Itching or burning"],
    cures: ["Moisturizing", "Light therapy", "Avoiding triggers"],
    medicines: ["Hydrocortisone", "Methotrexate", "Cyclosporine"],
  }
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
  { id: "3", name: "Dr. Anita Desai", specialty: "Pediatrician", hospital: "City Medical Center", rating: 4.7, experience: 10, avatar: "AD", photoUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200", homeVisit: true, fee: 600 },
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
  { id: "2", name: "Heart Care Hospital", location: "456 Cardiac Lane, Uptown", specialties: ["Cardiology", "Vascular Surgery"], rating: 4.9, image: "❤️" },
];

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export const timeSlots: TimeSlot[] = [
  { id: "1", time: "09:00 AM", available: true },
  { id: "2", time: "09:30 AM", available: true },
  { id: "3", time: "10:00 AM", available: true },
  { id: "4", time: "10:30 AM", available: true },
  { id: "5", time: "11:00 AM", available: true },
  { id: "6", time: "11:30 AM", available: true },
];