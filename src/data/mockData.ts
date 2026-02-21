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
  // ===== RESPIRATORY =====
  {
    id: "1", name: "Common Cold", category: "Respiratory",
    description: "A viral infection of the upper respiratory tract affecting the nose and throat.",
    causes: ["Rhinovirus", "Coronavirus (common cold type)", "Close contact with infected person", "Weakened immune system"],
    symptoms: ["Runny or stuffy nose", "Sore throat", "Cough", "Mild body aches", "Sneezing", "Low-grade fever"],
    cures: ["Rest and hydration", "Warm fluids and soups", "Steam inhalation", "Saltwater gargle"],
    medicines: ["Paracetamol", "Cetirizine", "Nasal decongestant spray", "Vitamin C supplements"],
  },
  {
    id: "7", name: "Influenza (Flu)", category: "Respiratory",
    description: "A contagious respiratory illness caused by influenza viruses that infect the nose, throat, and lungs.",
    causes: ["Influenza virus A or B", "Airborne droplets", "Contact with contaminated surfaces", "Weakened immunity"],
    symptoms: ["High fever", "Severe body aches", "Dry cough", "Fatigue", "Chills", "Sore throat", "Headache"],
    cures: ["Bed rest", "Plenty of fluids", "Warm soups", "Humidifier use", "Isolation to prevent spread"],
    medicines: ["Oseltamivir (Tamiflu)", "Paracetamol", "Ibuprofen", "Cough suppressant"],
  },
  {
    id: "8", name: "Asthma", category: "Respiratory",
    description: "A chronic condition where airways narrow, swell, and produce extra mucus, making breathing difficult.",
    causes: ["Allergens (dust, pollen, pet dander)", "Air pollution", "Respiratory infections", "Exercise", "Genetic factors"],
    symptoms: ["Wheezing", "Shortness of breath", "Chest tightness", "Persistent cough", "Difficulty sleeping due to breathing"],
    cures: ["Avoid triggers", "Use prescribed inhalers", "Breathing exercises", "Regular check-ups", "Air purifiers"],
    medicines: ["Salbutamol inhaler", "Budesonide inhaler", "Montelukast", "Prednisolone (for flare-ups)"],
  },
  {
    id: "9", name: "Pneumonia", category: "Respiratory",
    description: "An infection that inflames the air sacs in one or both lungs, which may fill with fluid or pus.",
    causes: ["Bacteria (Streptococcus)", "Viruses", "Fungi", "Aspiration of food/liquid", "Weakened immune system"],
    symptoms: ["Cough with phlegm", "Fever and chills", "Difficulty breathing", "Chest pain", "Fatigue", "Nausea"],
    cures: ["Antibiotics (if bacterial)", "Rest", "Fluids", "Oxygen therapy if severe", "Hospitalization if needed"],
    medicines: ["Amoxicillin", "Azithromycin", "Levofloxacin", "Paracetamol"],
  },
  {
    id: "10", name: "Bronchitis", category: "Respiratory",
    description: "Inflammation of the lining of the bronchial tubes, which carry air to and from the lungs.",
    causes: ["Viral infections", "Smoking", "Air pollution", "Dust exposure", "Weakened immunity"],
    symptoms: ["Persistent cough", "Mucus production", "Fatigue", "Shortness of breath", "Chest discomfort", "Low fever"],
    cures: ["Rest", "Drink fluids", "Use humidifier", "Avoid irritants", "Steam inhalation"],
    medicines: ["Cough expectorant", "Bronchodilators", "Ibuprofen", "Antibiotics (if bacterial)"],
  },
  {
    id: "11", name: "Tuberculosis (TB)", category: "Respiratory",
    description: "A serious infectious disease caused by Mycobacterium tuberculosis, primarily affecting the lungs.",
    causes: ["Mycobacterium tuberculosis bacteria", "Airborne transmission", "Close contact with TB patients", "Weak immunity"],
    symptoms: ["Chronic cough (3+ weeks)", "Coughing blood", "Night sweats", "Weight loss", "Fever", "Fatigue"],
    cures: ["DOTS therapy", "Complete full antibiotic course", "Isolation during active phase", "Nutritious diet"],
    medicines: ["Isoniazid", "Rifampicin", "Pyrazinamide", "Ethambutol"],
  },
  {
    id: "12", name: "Sinusitis", category: "Respiratory",
    description: "Inflammation or swelling of the tissue lining the sinuses, often caused by infection.",
    causes: ["Viral infection", "Bacterial infection", "Allergies", "Nasal polyps", "Deviated septum"],
    symptoms: ["Facial pain/pressure", "Nasal congestion", "Thick nasal discharge", "Reduced smell", "Headache", "Cough"],
    cures: ["Nasal saline irrigation", "Steam inhalation", "Warm compresses", "Stay hydrated", "Rest"],
    medicines: ["Amoxicillin", "Nasal corticosteroid spray", "Decongestants", "Antihistamines"],
  },
  {
    id: "13", name: "COPD", category: "Respiratory",
    description: "Chronic Obstructive Pulmonary Disease — a group of lung diseases that block airflow and make breathing difficult.",
    causes: ["Long-term smoking", "Air pollution", "Chemical fumes exposure", "Genetic factors (alpha-1 antitrypsin deficiency)"],
    symptoms: ["Chronic cough", "Shortness of breath", "Wheezing", "Chest tightness", "Frequent respiratory infections"],
    cures: ["Quit smoking", "Pulmonary rehabilitation", "Oxygen therapy", "Regular exercise", "Vaccination against flu"],
    medicines: ["Tiotropium", "Salmeterol", "Fluticasone inhaler", "Prednisolone"],
  },
  // ===== GENERAL =====
  {
    id: "2", name: "Fever", category: "General",
    description: "An increase in body temperature above the normal range, often indicating an underlying infection.",
    causes: ["Bacterial infection", "Viral infection", "Heat exhaustion", "Inflammatory conditions"],
    symptoms: ["High body temperature (>100.4°F)", "Chills and shivering", "Sweating", "Headache", "Muscle aches", "Loss of appetite"],
    cures: ["Rest and hydration", "Cool compresses", "Light clothing", "Adequate fluid intake"],
    medicines: ["Paracetamol (Acetaminophen)", "Ibuprofen", "Aspirin (adults only)", "ORS sachets"],
  },
  {
    id: "14", name: "Malaria", category: "General",
    description: "A life-threatening disease caused by Plasmodium parasites transmitted through infected mosquito bites.",
    causes: ["Plasmodium parasite", "Anopheles mosquito bite", "Blood transfusion (rare)", "Travel to endemic areas"],
    symptoms: ["High fever with chills", "Sweating", "Headache", "Nausea/vomiting", "Muscle pain", "Fatigue", "Anemia"],
    cures: ["Antimalarial medication", "Rest", "Fluid intake", "Mosquito prevention", "Early diagnosis"],
    medicines: ["Chloroquine", "Artemether-Lumefantrine", "Quinine", "Primaquine"],
  },
  {
    id: "15", name: "Dengue Fever", category: "General",
    description: "A mosquito-borne viral infection causing severe flu-like illness, sometimes developing into a fatal complication.",
    causes: ["Dengue virus (DENV)", "Aedes aegypti mosquito", "Stagnant water breeding grounds", "Tropical climates"],
    symptoms: ["High fever", "Severe headache", "Pain behind eyes", "Joint/muscle pain", "Rash", "Mild bleeding (nose/gums)"],
    cures: ["Rest", "Plenty of fluids", "Pain relievers (avoid aspirin)", "Platelet monitoring", "Hospitalization if severe"],
    medicines: ["Paracetamol", "ORS", "IV fluids (if severe)", "Platelet transfusion (critical cases)"],
  },
  {
    id: "16", name: "Typhoid", category: "General",
    description: "A bacterial infection caused by Salmonella typhi, spread through contaminated food and water.",
    causes: ["Salmonella typhi bacteria", "Contaminated water", "Unhygienic food", "Poor sanitation"],
    symptoms: ["Prolonged high fever", "Weakness", "Abdominal pain", "Headache", "Loss of appetite", "Constipation or diarrhea"],
    cures: ["Antibiotics", "Hydration", "Rest", "Hygienic food preparation", "Clean water"],
    medicines: ["Azithromycin", "Ciprofloxacin", "Ceftriaxone", "Paracetamol"],
  },
  {
    id: "17", name: "Chickenpox", category: "General",
    description: "A highly contagious viral infection causing an itchy, blister-like rash on the skin.",
    causes: ["Varicella-zoster virus", "Direct contact with infected person", "Airborne droplets", "Not vaccinated"],
    symptoms: ["Itchy red blisters", "Fever", "Tiredness", "Loss of appetite", "Headache", "Rash spreading across body"],
    cures: ["Rest", "Calamine lotion for itch", "Cool baths", "Avoid scratching", "Isolation until scabs form"],
    medicines: ["Acyclovir", "Calamine lotion", "Paracetamol", "Antihistamines (for itch)"],
  },
  {
    id: "18", name: "Measles", category: "General",
    description: "A highly contagious viral disease characterized by fever, cough, and a distinctive red rash.",
    causes: ["Measles virus (Morbillivirus)", "Airborne transmission", "Direct contact", "Unvaccinated individuals"],
    symptoms: ["High fever", "Cough", "Runny nose", "Red eyes", "White spots in mouth (Koplik spots)", "Skin rash"],
    cures: ["Supportive care", "Rest", "Fluids", "Vitamin A supplements", "Fever management"],
    medicines: ["Paracetamol", "Vitamin A", "Ibuprofen", "Cough syrup"],
  },
  {
    id: "19", name: "Mumps", category: "General",
    description: "A viral infection that primarily affects the salivary glands, causing swelling and pain.",
    causes: ["Mumps virus (Paramyxovirus)", "Respiratory droplets", "Close contact", "Not vaccinated"],
    symptoms: ["Swollen salivary glands", "Fever", "Headache", "Muscle aches", "Fatigue", "Pain while chewing"],
    cures: ["Rest", "Cold/warm compresses on swollen glands", "Soft foods", "Plenty of fluids", "Isolation"],
    medicines: ["Paracetamol", "Ibuprofen", "Pain relievers", "Anti-inflammatory drugs"],
  },
  {
    id: "20", name: "Food Poisoning", category: "General",
    description: "Illness caused by consuming contaminated food or beverages containing bacteria, viruses, or parasites.",
    causes: ["Bacteria (Salmonella, E. coli)", "Contaminated food", "Improper food storage", "Undercooked meat", "Poor hygiene"],
    symptoms: ["Nausea", "Vomiting", "Diarrhea", "Stomach cramps", "Fever", "Dehydration"],
    cures: ["Oral rehydration", "BRAT diet", "Rest", "Avoid dairy/spicy foods", "Small frequent meals"],
    medicines: ["ORS", "Ondansetron (anti-nausea)", "Loperamide", "Probiotics"],
  },
  // ===== CHRONIC =====
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
    id: "21", name: "Diabetes (Type 1)", category: "Chronic",
    description: "An autoimmune condition where the pancreas produces little or no insulin.",
    causes: ["Autoimmune destruction of beta cells", "Genetic factors", "Environmental triggers", "Viral infections"],
    symptoms: ["Extreme thirst", "Frequent urination", "Unexplained weight loss", "Fatigue", "Blurred vision", "Irritability"],
    cures: ["Insulin therapy (lifelong)", "Blood glucose monitoring", "Carb counting", "Regular exercise", "Healthy diet"],
    medicines: ["Insulin (rapid-acting)", "Insulin (long-acting)", "Glucagon kit", "Continuous glucose monitor"],
  },
  {
    id: "22", name: "Heart Disease (Coronary Artery)", category: "Chronic",
    description: "A condition where the coronary arteries become narrowed or blocked, reducing blood flow to the heart.",
    causes: ["Atherosclerosis", "High cholesterol", "Smoking", "Diabetes", "Hypertension", "Obesity"],
    symptoms: ["Chest pain (angina)", "Shortness of breath", "Heart palpitations", "Fatigue", "Dizziness", "Nausea"],
    cures: ["Heart-healthy diet", "Regular exercise", "Quit smoking", "Stress management", "Weight control"],
    medicines: ["Aspirin", "Statins (Atorvastatin)", "Beta-blockers", "ACE inhibitors", "Nitroglycerin"],
  },
  {
    id: "23", name: "Chronic Kidney Disease", category: "Chronic",
    description: "Gradual loss of kidney function over time, affecting the body's ability to filter waste from blood.",
    causes: ["Diabetes", "High blood pressure", "Glomerulonephritis", "Polycystic kidney disease", "Prolonged NSAID use"],
    symptoms: ["Fatigue", "Swollen ankles/feet", "Decreased urination", "Nausea", "Shortness of breath", "Confusion"],
    cures: ["Manage underlying cause", "Low-protein diet", "Control blood pressure", "Dialysis (advanced)", "Kidney transplant"],
    medicines: ["ACE inhibitors", "Erythropoietin", "Phosphate binders", "Vitamin D supplements"],
  },
  {
    id: "24", name: "Hypothyroidism", category: "Chronic",
    description: "A condition where the thyroid gland doesn't produce enough thyroid hormones.",
    causes: ["Hashimoto's thyroiditis", "Thyroid surgery", "Radiation therapy", "Iodine deficiency", "Medications"],
    symptoms: ["Fatigue", "Weight gain", "Cold sensitivity", "Dry skin", "Constipation", "Depression", "Hair loss"],
    cures: ["Thyroid hormone replacement", "Regular monitoring", "Balanced diet with iodine", "Exercise"],
    medicines: ["Levothyroxine", "Liothyronine", "Iodine supplements", "Selenium supplements"],
  },
  {
    id: "25", name: "Hyperthyroidism", category: "Chronic",
    description: "A condition where the thyroid gland produces too much thyroid hormone, accelerating metabolism.",
    causes: ["Graves' disease", "Thyroid nodules", "Thyroiditis", "Excess iodine intake", "Medications"],
    symptoms: ["Weight loss", "Rapid heartbeat", "Tremors", "Sweating", "Anxiety", "Insomnia", "Heat intolerance"],
    cures: ["Anti-thyroid medication", "Radioactive iodine therapy", "Surgery", "Beta-blockers for symptoms"],
    medicines: ["Methimazole", "Propylthiouracil", "Propranolol", "Radioactive iodine"],
  },
  {
    id: "26", name: "Anemia", category: "Chronic",
    description: "A condition where the blood doesn't have enough healthy red blood cells to carry adequate oxygen.",
    causes: ["Iron deficiency", "Vitamin B12 deficiency", "Chronic disease", "Blood loss", "Genetic disorders"],
    symptoms: ["Fatigue", "Pale skin", "Shortness of breath", "Dizziness", "Cold hands/feet", "Headache", "Brittle nails"],
    cures: ["Iron-rich diet", "Vitamin supplements", "Treat underlying cause", "Blood transfusion (severe)"],
    medicines: ["Ferrous sulfate", "Vitamin B12 injections", "Folic acid", "Erythropoietin"],
  },
  {
    id: "27", name: "Epilepsy", category: "Chronic",
    description: "A neurological disorder characterized by recurrent, unprovoked seizures due to abnormal brain activity.",
    causes: ["Genetic factors", "Brain injury", "Stroke", "Brain tumors", "Infections (meningitis)", "Developmental disorders"],
    symptoms: ["Seizures", "Temporary confusion", "Staring spells", "Uncontrollable jerking", "Loss of consciousness", "Anxiety"],
    cures: ["Anti-seizure medication", "Ketogenic diet", "Surgery (severe cases)", "Vagus nerve stimulation", "Avoid triggers"],
    medicines: ["Valproate", "Levetiracetam", "Carbamazepine", "Lamotrigine"],
  },
  {
    id: "28", name: "GERD (Acid Reflux)", category: "Chronic",
    description: "Gastroesophageal reflux disease — chronic acid reflux where stomach acid frequently flows back into the esophagus.",
    causes: ["Weak lower esophageal sphincter", "Obesity", "Hiatal hernia", "Smoking", "Certain foods", "Pregnancy"],
    symptoms: ["Heartburn", "Acid regurgitation", "Difficulty swallowing", "Chest pain", "Chronic cough", "Hoarse voice"],
    cures: ["Avoid trigger foods", "Eat smaller meals", "Don't lie down after eating", "Elevate head while sleeping", "Lose weight"],
    medicines: ["Omeprazole", "Ranitidine", "Antacids (Gaviscon)", "Pantoprazole"],
  },
  {
    id: "29", name: "Rheumatoid Arthritis", category: "Chronic",
    description: "An autoimmune disorder that primarily affects joints, causing painful swelling and bone erosion.",
    causes: ["Autoimmune response", "Genetic factors", "Hormonal changes", "Smoking", "Environmental triggers"],
    symptoms: ["Joint pain and swelling", "Morning stiffness", "Fatigue", "Fever", "Joint deformity", "Reduced range of motion"],
    cures: ["Physical therapy", "Regular exercise", "Hot/cold therapy", "Joint protection", "Anti-inflammatory diet"],
    medicines: ["Methotrexate", "Hydroxychloroquine", "Prednisolone", "Adalimumab"],
  },
  {
    id: "30", name: "Osteoarthritis", category: "Chronic",
    description: "Degenerative joint disease where cartilage that cushions joints breaks down over time.",
    causes: ["Aging", "Joint overuse", "Obesity", "Joint injuries", "Genetic predisposition"],
    symptoms: ["Joint pain", "Stiffness", "Swelling", "Decreased flexibility", "Bone spurs", "Grating sensation"],
    cures: ["Exercise", "Weight management", "Physical therapy", "Hot/cold compresses", "Joint protection"],
    medicines: ["Acetaminophen", "Ibuprofen", "Topical NSAIDs", "Glucosamine supplements"],
  },
  // ===== NEUROLOGICAL =====
  {
    id: "5", name: "Migraine", category: "Neurological",
    description: "A type of headache characterized by intense, debilitating pain often accompanied by nausea and light sensitivity.",
    causes: ["Stress", "Hormonal changes", "Certain foods", "Sleep changes", "Bright lights", "Weather changes"],
    symptoms: ["Throbbing head pain", "Nausea/vomiting", "Light sensitivity", "Sound sensitivity", "Aura (visual disturbances)"],
    cures: ["Rest in dark room", "Cold compress on forehead", "Adequate sleep", "Stress management", "Identify triggers"],
    medicines: ["Sumatriptan", "Ibuprofen", "Naproxen", "Rizatriptan"],
  },
  {
    id: "31", name: "Alzheimer's Disease", category: "Neurological",
    description: "A progressive neurodegenerative disorder that causes memory loss, cognitive decline, and behavioral changes.",
    causes: ["Age (65+)", "Genetics (APOE gene)", "Family history", "Head injuries", "Cardiovascular risk factors"],
    symptoms: ["Memory loss", "Confusion", "Difficulty with familiar tasks", "Language problems", "Mood changes", "Disorientation"],
    cures: ["Cognitive stimulation", "Physical exercise", "Social engagement", "Structured routine", "Caregiver support"],
    medicines: ["Donepezil", "Memantine", "Rivastigmine", "Galantamine"],
  },
  {
    id: "32", name: "Parkinson's Disease", category: "Neurological",
    description: "A progressive nervous system disorder that affects movement, causing tremors and stiffness.",
    causes: ["Loss of dopamine neurons", "Genetic mutations", "Environmental toxins", "Age", "Head trauma"],
    symptoms: ["Tremors", "Slowed movement", "Rigid muscles", "Impaired posture", "Speech changes", "Writing changes"],
    cures: ["Physical therapy", "Regular exercise", "Speech therapy", "Occupational therapy", "Deep brain stimulation"],
    medicines: ["Levodopa/Carbidopa", "Pramipexole", "Selegiline", "Amantadine"],
  },
  {
    id: "33", name: "Stroke", category: "Neurological",
    description: "A medical emergency when blood supply to part of the brain is interrupted, causing brain cells to die.",
    causes: ["Blood clot (ischemic)", "Ruptured blood vessel (hemorrhagic)", "High blood pressure", "Diabetes", "Smoking", "Atrial fibrillation"],
    symptoms: ["Sudden numbness (face/arm/leg)", "Confusion", "Trouble speaking", "Vision problems", "Severe headache", "Loss of balance"],
    cures: ["Emergency medical care (FAST)", "Clot-busting drugs", "Surgery", "Rehabilitation therapy", "Lifestyle changes"],
    medicines: ["tPA (tissue plasminogen activator)", "Aspirin", "Clopidogrel", "Warfarin"],
  },
  {
    id: "34", name: "Bell's Palsy", category: "Neurological",
    description: "Sudden, temporary weakness or paralysis of the muscles on one side of the face.",
    causes: ["Viral infections (herpes simplex)", "Inflammation of facial nerve", "Immune disorders", "Stress"],
    symptoms: ["Facial drooping", "Inability to close eye", "Drooling", "Pain around jaw/ear", "Headache", "Loss of taste"],
    cures: ["Physical therapy", "Facial exercises", "Eye protection", "Moist heat application", "Rest"],
    medicines: ["Prednisolone", "Acyclovir", "Artificial tears", "Pain relievers"],
  },
  {
    id: "35", name: "Meningitis", category: "Neurological",
    description: "Inflammation of the membranes surrounding the brain and spinal cord, usually caused by infection.",
    causes: ["Bacterial infection", "Viral infection", "Fungal infection", "Parasites", "Non-infectious causes"],
    symptoms: ["Severe headache", "Stiff neck", "High fever", "Sensitivity to light", "Nausea/vomiting", "Confusion", "Seizures"],
    cures: ["Immediate medical treatment", "IV antibiotics (bacterial)", "Supportive care", "Hospitalization", "Vaccination"],
    medicines: ["Ceftriaxone", "Vancomycin", "Dexamethasone", "Acyclovir (viral)"],
  },
  // ===== DERMATOLOGY =====
  {
    id: "6", name: "Skin Allergy", category: "Dermatology",
    description: "An immune system reaction to substances that come into contact with the skin.",
    causes: ["Pollen", "Certain foods", "Cosmetics", "Detergents", "Insect bites", "Medications"],
    symptoms: ["Redness", "Itching", "Rash", "Swelling", "Hives", "Dry or scaly skin"],
    cures: ["Avoid allergens", "Cool compresses", "Moisturize skin", "Oatmeal baths"],
    medicines: ["Cetirizine", "Hydrocortisone cream", "Calamine lotion", "Fexofenadine"],
  },
  {
    id: "36", name: "Eczema (Atopic Dermatitis)", category: "Dermatology",
    description: "A chronic condition causing dry, itchy, and inflamed skin patches.",
    causes: ["Genetic factors", "Immune system dysfunction", "Environmental triggers", "Dry skin", "Stress"],
    symptoms: ["Dry, scaly skin", "Intense itching", "Red/brown patches", "Small raised bumps", "Thickened skin", "Raw skin from scratching"],
    cures: ["Moisturize frequently", "Avoid triggers", "Lukewarm baths", "Gentle soaps", "Stress management"],
    medicines: ["Hydrocortisone cream", "Tacrolimus ointment", "Cetirizine", "Moisturizing creams"],
  },
  {
    id: "37", name: "Psoriasis", category: "Dermatology",
    description: "An autoimmune condition causing rapid skin cell buildup, resulting in scaling on the skin's surface.",
    causes: ["Immune system dysfunction", "Genetics", "Stress", "Infections", "Skin injuries", "Cold weather"],
    symptoms: ["Red patches with silvery scales", "Dry/cracked skin", "Itching", "Burning", "Thickened nails", "Stiff joints"],
    cures: ["Moisturize skin", "Sunlight exposure (moderate)", "Stress reduction", "Avoid triggers", "Medicated shampoos"],
    medicines: ["Topical corticosteroids", "Methotrexate", "Calcipotriol", "Adalimumab"],
  },
  {
    id: "38", name: "Acne", category: "Dermatology",
    description: "A skin condition that occurs when hair follicles become clogged with oil and dead skin cells.",
    causes: ["Excess oil production", "Clogged pores", "Bacteria", "Hormonal changes", "Diet", "Stress"],
    symptoms: ["Whiteheads", "Blackheads", "Pimples", "Cysts", "Nodules", "Scarring", "Oily skin"],
    cures: ["Regular face washing", "Non-comedogenic products", "Avoid touching face", "Balanced diet", "Adequate sleep"],
    medicines: ["Benzoyl peroxide", "Adapalene gel", "Clindamycin gel", "Isotretinoin (severe cases)"],
  },
  {
    id: "39", name: "Fungal Skin Infection (Ringworm)", category: "Dermatology",
    description: "A common fungal infection that causes a ring-shaped, red, itchy rash on the skin.",
    causes: ["Dermatophyte fungi", "Direct contact", "Shared towels/clothing", "Warm/humid environments", "Pets"],
    symptoms: ["Ring-shaped rash", "Red scaly border", "Itching", "Blistering", "Hair loss in affected area"],
    cures: ["Keep skin dry and clean", "Avoid sharing personal items", "Wash clothes in hot water", "Antifungal treatment"],
    medicines: ["Clotrimazole cream", "Terbinafine cream", "Ketoconazole", "Griseofulvin (oral)"],
  },
  {
    id: "40", name: "Vitiligo", category: "Dermatology",
    description: "A condition causing loss of skin color in patches due to destruction of melanocytes.",
    causes: ["Autoimmune response", "Genetics", "Sunburn", "Stress", "Chemical exposure"],
    symptoms: ["White patches on skin", "Premature hair whitening", "Color loss inside mouth", "Color change in retina"],
    cures: ["Sunscreen protection", "Phototherapy", "Camouflage cosmetics", "Stress management", "Support groups"],
    medicines: ["Topical corticosteroids", "Tacrolimus ointment", "Psoralen (phototherapy)", "Vitamin D analogs"],
  },
  {
    id: "41", name: "Urticaria (Hives)", category: "Dermatology",
    description: "Raised, itchy welts on the skin that are often triggered by allergic reactions.",
    causes: ["Food allergies", "Medications", "Insect stings", "Infections", "Stress", "Temperature changes"],
    symptoms: ["Red/skin-colored welts", "Itching", "Swelling", "Burning sensation", "Welts that change shape"],
    cures: ["Identify and avoid triggers", "Cool compresses", "Loose clothing", "Anti-itch creams", "Stress reduction"],
    medicines: ["Cetirizine", "Loratadine", "Ranitidine", "Epinephrine (severe)"],
  },
  {
    id: "42", name: "Scabies", category: "Dermatology",
    description: "A contagious skin infestation caused by tiny mites that burrow into the skin.",
    causes: ["Sarcoptes scabiei mite", "Skin-to-skin contact", "Shared bedding/clothing", "Crowded living conditions"],
    symptoms: ["Intense itching (worse at night)", "Thin burrow tracks", "Rash", "Sores from scratching", "Blisters"],
    cures: ["Prescription treatment", "Wash all clothing/bedding in hot water", "Treat all household members", "Vacuum furniture"],
    medicines: ["Permethrin cream 5%", "Ivermectin (oral)", "Lindane lotion", "Antihistamines (for itch)"],
  },
  // ===== GASTROINTESTINAL =====
  {
    id: "43", name: "Gastritis", category: "Gastrointestinal",
    description: "Inflammation of the stomach lining, which can cause pain, nausea, and digestive issues.",
    causes: ["H. pylori bacteria", "Excessive alcohol", "NSAIDs overuse", "Stress", "Bile reflux", "Autoimmune disorders"],
    symptoms: ["Upper abdominal pain", "Nausea", "Vomiting", "Bloating", "Loss of appetite", "Indigestion"],
    cures: ["Avoid spicy/acidic foods", "Eat smaller meals", "Reduce stress", "Limit alcohol", "Avoid NSAIDs"],
    medicines: ["Omeprazole", "Ranitidine", "Antacids", "Sucralfate"],
  },
  {
    id: "44", name: "Peptic Ulcer", category: "Gastrointestinal",
    description: "Open sores that develop on the inside lining of the stomach or upper small intestine.",
    causes: ["H. pylori infection", "Long-term NSAID use", "Excessive acid production", "Smoking", "Stress"],
    symptoms: ["Burning stomach pain", "Bloating", "Heartburn", "Nausea", "Dark/bloody stools", "Unexplained weight loss"],
    cures: ["Avoid irritating foods", "Quit smoking", "Limit alcohol", "Manage stress", "Complete prescribed treatment"],
    medicines: ["Omeprazole", "Amoxicillin + Clarithromycin (H. pylori)", "Sucralfate", "Bismuth subsalicylate"],
  },
  {
    id: "45", name: "Irritable Bowel Syndrome (IBS)", category: "Gastrointestinal",
    description: "A chronic disorder affecting the large intestine, causing cramping, bloating, and altered bowel habits.",
    causes: ["Muscle contractions in intestine", "Nervous system abnormalities", "Gut microbiome changes", "Stress", "Food triggers"],
    symptoms: ["Abdominal cramping", "Bloating", "Gas", "Diarrhea or constipation", "Mucus in stool", "Food intolerance"],
    cures: ["Dietary modifications (low-FODMAP)", "Stress management", "Regular exercise", "Adequate fiber", "Probiotics"],
    medicines: ["Mebeverine", "Loperamide", "Fiber supplements", "Probiotics"],
  },
  {
    id: "46", name: "Diarrhea", category: "Gastrointestinal",
    description: "Frequent loose or watery bowel movements, often caused by infection or dietary issues.",
    causes: ["Viral/bacterial infection", "Food intolerance", "Medications", "Parasites", "Digestive disorders"],
    symptoms: ["Watery stools", "Abdominal cramps", "Nausea", "Urgency", "Dehydration", "Fever"],
    cures: ["Oral rehydration", "BRAT diet", "Rest", "Avoid dairy and caffeine", "Probiotics"],
    medicines: ["ORS", "Loperamide", "Zinc supplements", "Probiotics"],
  },
  {
    id: "47", name: "Constipation", category: "Gastrointestinal",
    description: "Infrequent bowel movements or difficult passage of stools that persists for several weeks.",
    causes: ["Low fiber diet", "Dehydration", "Lack of exercise", "Medications", "Ignoring urge", "Stress"],
    symptoms: ["Fewer than 3 bowel movements/week", "Hard stools", "Straining", "Bloating", "Abdominal discomfort", "Incomplete evacuation"],
    cures: ["Increase fiber intake", "Drink more water", "Regular exercise", "Don't ignore urge", "Establish routine"],
    medicines: ["Psyllium husk", "Lactulose", "Bisacodyl", "Polyethylene glycol"],
  },
  {
    id: "48", name: "Jaundice", category: "Gastrointestinal",
    description: "Yellowing of the skin and eyes caused by excess bilirubin in the blood, often indicating liver problems.",
    causes: ["Hepatitis", "Gallstones", "Liver cirrhosis", "Hemolytic anemia", "Pancreatic cancer", "Medications"],
    symptoms: ["Yellow skin and eyes", "Dark urine", "Pale stools", "Itching", "Abdominal pain", "Fatigue", "Weight loss"],
    cures: ["Treat underlying cause", "Rest", "Adequate hydration", "Avoid alcohol", "Liver-friendly diet"],
    medicines: ["Ursodeoxycholic acid", "Antibiotics (if infectious)", "Vitamin K", "Corticosteroids (autoimmune)"],
  },
  {
    id: "49", name: "Hepatitis B", category: "Gastrointestinal",
    description: "A serious liver infection caused by the hepatitis B virus, which can become chronic.",
    causes: ["Hepatitis B virus", "Contaminated blood/needles", "Sexual contact", "Mother to child", "Unsterile medical equipment"],
    symptoms: ["Jaundice", "Dark urine", "Extreme fatigue", "Nausea/vomiting", "Abdominal pain", "Joint pain"],
    cures: ["Vaccination (prevention)", "Antiviral treatment", "Liver monitoring", "Avoid alcohol", "Healthy diet"],
    medicines: ["Entecavir", "Tenofovir", "Interferon alfa", "Hepatitis B vaccine"],
  },
  {
    id: "50", name: "Appendicitis", category: "Gastrointestinal",
    description: "Inflammation of the appendix causing severe abdominal pain, typically requiring surgery.",
    causes: ["Blockage of appendix lining", "Infection", "Enlarged lymph tissue", "Fecal matter blockage", "Tumors"],
    symptoms: ["Sudden pain near navel moving to lower right", "Worsening pain", "Nausea/vomiting", "Fever", "Loss of appetite", "Abdominal swelling"],
    cures: ["Emergency surgery (appendectomy)", "Antibiotics", "Hospital monitoring", "Rest post-surgery"],
    medicines: ["Ceftriaxone (pre-surgery)", "Metronidazole", "Pain relievers", "IV antibiotics"],
  },
  // ===== MUSCULOSKELETAL =====
  {
    id: "51", name: "Back Pain (Lumbar)", category: "Musculoskeletal",
    description: "Pain in the lower back area, one of the most common reasons for missed work and doctor visits.",
    causes: ["Muscle strain", "Poor posture", "Herniated disc", "Arthritis", "Osteoporosis", "Sedentary lifestyle"],
    symptoms: ["Dull aching pain", "Stiffness", "Radiating leg pain", "Limited flexibility", "Muscle spasms", "Difficulty standing"],
    cures: ["Stay active", "Stretching exercises", "Proper posture", "Ergonomic setup", "Hot/cold therapy", "Core strengthening"],
    medicines: ["Ibuprofen", "Muscle relaxants", "Topical analgesics", "Acetaminophen"],
  },
  {
    id: "52", name: "Osteoporosis", category: "Musculoskeletal",
    description: "A bone disease where bone density decreases, making bones fragile and more prone to fractures.",
    causes: ["Aging", "Menopause", "Calcium/Vitamin D deficiency", "Sedentary lifestyle", "Smoking", "Certain medications"],
    symptoms: ["Back pain", "Loss of height", "Stooped posture", "Fractures from minor falls", "Bone pain"],
    cures: ["Weight-bearing exercise", "Calcium-rich diet", "Vitamin D supplementation", "Fall prevention", "Quit smoking"],
    medicines: ["Alendronate", "Calcium supplements", "Vitamin D3", "Denosumab"],
  },
  {
    id: "53", name: "Gout", category: "Musculoskeletal",
    description: "A form of arthritis characterized by sudden, severe attacks of pain, swelling in joints, especially the big toe.",
    causes: ["High uric acid levels", "Purine-rich diet", "Obesity", "Kidney problems", "Genetics", "Alcohol"],
    symptoms: ["Intense joint pain", "Swelling", "Redness", "Warmth in affected joint", "Limited motion", "Lingering discomfort"],
    cures: ["Low-purine diet", "Adequate hydration", "Limit alcohol", "Maintain healthy weight", "Avoid trigger foods"],
    medicines: ["Colchicine", "Allopurinol", "Indomethacin", "Febuxostat"],
  },
  {
    id: "54", name: "Sciatica", category: "Musculoskeletal",
    description: "Pain radiating along the sciatic nerve from the lower back down through the leg.",
    causes: ["Herniated disc", "Bone spur", "Spinal stenosis", "Piriformis syndrome", "Injury", "Prolonged sitting"],
    symptoms: ["Sharp pain from lower back to leg", "Numbness", "Tingling", "Muscle weakness", "Pain worsens with sitting"],
    cures: ["Physical therapy", "Stretching", "Hot/cold packs", "Regular movement", "Core strengthening"],
    medicines: ["Ibuprofen", "Gabapentin", "Pregabalin", "Muscle relaxants"],
  },
  {
    id: "55", name: "Fibromyalgia", category: "Musculoskeletal",
    description: "A chronic condition characterized by widespread musculoskeletal pain, fatigue, and tenderness.",
    causes: ["Genetics", "Infections", "Physical/emotional trauma", "Stress", "Abnormal pain processing"],
    symptoms: ["Widespread pain", "Fatigue", "Cognitive difficulties (fibro fog)", "Sleep problems", "Headaches", "Depression"],
    cures: ["Regular exercise", "Stress management", "Good sleep habits", "Cognitive behavioral therapy", "Relaxation techniques"],
    medicines: ["Duloxetine", "Pregabalin", "Amitriptyline", "Tramadol"],
  },
  // ===== MENTAL HEALTH =====
  {
    id: "56", name: "Depression", category: "Mental Health",
    description: "A mood disorder causing persistent feelings of sadness, hopelessness, and loss of interest in activities.",
    causes: ["Brain chemistry imbalance", "Genetics", "Life events", "Chronic illness", "Medications", "Substance abuse"],
    symptoms: ["Persistent sadness", "Loss of interest", "Sleep changes", "Fatigue", "Appetite changes", "Difficulty concentrating", "Suicidal thoughts"],
    cures: ["Therapy (CBT/counseling)", "Regular exercise", "Social support", "Mindfulness meditation", "Structured routine"],
    medicines: ["Fluoxetine (Prozac)", "Sertraline (Zoloft)", "Escitalopram", "Venlafaxine"],
  },
  {
    id: "57", name: "Anxiety Disorder", category: "Mental Health",
    description: "A mental health condition characterized by excessive worry, fear, and nervousness that interferes with daily life.",
    causes: ["Genetics", "Brain chemistry", "Life experiences", "Chronic stress", "Trauma", "Medical conditions"],
    symptoms: ["Excessive worry", "Restlessness", "Rapid heartbeat", "Sweating", "Trembling", "Difficulty sleeping", "Panic attacks"],
    cures: ["Cognitive behavioral therapy", "Deep breathing exercises", "Regular exercise", "Meditation", "Limit caffeine"],
    medicines: ["Escitalopram", "Buspirone", "Alprazolam", "Propranolol"],
  },
  {
    id: "58", name: "Insomnia", category: "Mental Health",
    description: "A sleep disorder characterized by difficulty falling asleep, staying asleep, or getting quality sleep.",
    causes: ["Stress", "Anxiety", "Poor sleep habits", "Caffeine", "Medical conditions", "Medications", "Screen time"],
    symptoms: ["Difficulty falling asleep", "Waking up frequently", "Daytime sleepiness", "Irritability", "Poor concentration", "Fatigue"],
    cures: ["Sleep hygiene routine", "Limit screens before bed", "Regular sleep schedule", "Relaxation techniques", "Dark quiet room"],
    medicines: ["Melatonin", "Zolpidem", "Trazodone", "Diphenhydramine"],
  },
  {
    id: "59", name: "PTSD (Post-Traumatic Stress Disorder)", category: "Mental Health",
    description: "A mental health condition triggered by experiencing or witnessing a traumatic event.",
    causes: ["Traumatic events", "Combat exposure", "Physical/sexual assault", "Accidents", "Natural disasters", "Childhood abuse"],
    symptoms: ["Flashbacks", "Nightmares", "Severe anxiety", "Avoidance of triggers", "Emotional numbness", "Hypervigilance"],
    cures: ["Trauma-focused therapy", "EMDR therapy", "Support groups", "Mindfulness", "Regular exercise"],
    medicines: ["Sertraline", "Paroxetine", "Prazosin (nightmares)", "Venlafaxine"],
  },
  {
    id: "60", name: "ADHD", category: "Mental Health",
    description: "Attention Deficit Hyperactivity Disorder — a neurodevelopmental condition affecting focus, impulse control, and activity levels.",
    causes: ["Genetics", "Brain structure differences", "Prenatal exposure to toxins", "Premature birth", "Low birth weight"],
    symptoms: ["Inattention", "Hyperactivity", "Impulsivity", "Difficulty organizing", "Forgetfulness", "Restlessness"],
    cures: ["Behavioral therapy", "Structured routines", "Exercise", "Mindfulness training", "Organizational tools"],
    medicines: ["Methylphenidate", "Amphetamine salts", "Atomoxetine", "Guanfacine"],
  },
  // ===== UROLOGICAL =====
  {
    id: "61", name: "Urinary Tract Infection (UTI)", category: "Urological",
    description: "An infection in any part of the urinary system — kidneys, bladder, ureters, or urethra.",
    causes: ["E. coli bacteria", "Sexual activity", "Poor hygiene", "Holding urine", "Catheter use", "Weakened immunity"],
    symptoms: ["Burning during urination", "Frequent urination", "Cloudy urine", "Strong-smelling urine", "Pelvic pain", "Blood in urine"],
    cures: ["Drink plenty of water", "Cranberry juice", "Urinate frequently", "Proper hygiene", "Complete antibiotics course"],
    medicines: ["Nitrofurantoin", "Trimethoprim", "Ciprofloxacin", "Phenazopyridine (pain relief)"],
  },
  {
    id: "62", name: "Kidney Stones", category: "Urological",
    description: "Hard deposits of minerals and salts that form inside the kidneys and can cause intense pain.",
    causes: ["Dehydration", "High-sodium diet", "Obesity", "Excess calcium/oxalate", "Family history", "Medical conditions"],
    symptoms: ["Severe flank pain", "Pain radiating to groin", "Blood in urine", "Nausea/vomiting", "Frequent urination", "Fever (if infected)"],
    cures: ["Drink plenty of water", "Low-sodium diet", "Limit oxalate-rich foods", "Pain management", "Medical procedures (large stones)"],
    medicines: ["Tamsulosin", "Ibuprofen", "Potassium citrate", "Diclofenac"],
  },
  // ===== EYE =====
  {
    id: "63", name: "Conjunctivitis (Pink Eye)", category: "Eye",
    description: "Inflammation or infection of the transparent membrane (conjunctiva) that lines the eyelid and eyeball.",
    causes: ["Viral infection", "Bacterial infection", "Allergies", "Chemical irritants", "Contact lens use"],
    symptoms: ["Redness", "Itching", "Tearing", "Discharge", "Crusting of eyelids", "Swollen eyelids", "Sensitivity to light"],
    cures: ["Warm compresses", "Clean eyes gently", "Avoid touching eyes", "Discard old eye makeup", "Don't share towels"],
    medicines: ["Antibiotic eye drops", "Antihistamine drops", "Artificial tears", "Moxifloxacin eye drops"],
  },
  {
    id: "64", name: "Glaucoma", category: "Eye",
    description: "A group of eye conditions that damage the optic nerve, often caused by abnormally high eye pressure.",
    causes: ["High intraocular pressure", "Age (over 60)", "Family history", "Diabetes", "Eye injuries", "Corticosteroid use"],
    symptoms: ["Gradual vision loss", "Tunnel vision", "Eye pain", "Halos around lights", "Redness", "Blurred vision"],
    cures: ["Regular eye exams", "Prescribed eye drops", "Laser treatment", "Surgery", "Monitor eye pressure"],
    medicines: ["Timolol eye drops", "Latanoprost", "Brimonidine", "Acetazolamide"],
  },
  {
    id: "65", name: "Cataracts", category: "Eye",
    description: "Clouding of the normally clear lens of the eye, leading to decreased vision.",
    causes: ["Aging", "Diabetes", "UV exposure", "Smoking", "Eye injury", "Corticosteroid use", "Genetics"],
    symptoms: ["Clouded/blurred vision", "Difficulty with night vision", "Light sensitivity", "Fading colors", "Double vision", "Frequent prescription changes"],
    cures: ["Cataract surgery", "Stronger lighting", "Anti-glare sunglasses", "Magnifying lenses", "Regular eye exams"],
    medicines: ["No medication to reverse (surgery required)", "Anti-inflammatory drops (post-surgery)", "Lubricant eye drops"],
  },
  // ===== ENT =====
  {
    id: "66", name: "Tonsillitis", category: "ENT",
    description: "Inflammation of the tonsils, typically caused by viral or bacterial infection.",
    causes: ["Streptococcus bacteria", "Viral infections", "Weakened immunity", "Close contact with infected person"],
    symptoms: ["Sore throat", "Difficulty swallowing", "Red/swollen tonsils", "White patches on tonsils", "Fever", "Bad breath", "Neck stiffness"],
    cures: ["Rest", "Warm saltwater gargle", "Soft foods", "Plenty of fluids", "Cool mist humidifier"],
    medicines: ["Amoxicillin", "Penicillin", "Ibuprofen", "Paracetamol"],
  },
  {
    id: "67", name: "Otitis Media (Ear Infection)", category: "ENT",
    description: "An infection of the middle ear causing pain, fever, and sometimes temporary hearing loss.",
    causes: ["Bacterial infection", "Viral infection", "Eustachian tube dysfunction", "Upper respiratory infections", "Allergies"],
    symptoms: ["Ear pain", "Fever", "Hearing difficulty", "Fluid drainage", "Irritability", "Balance problems"],
    cures: ["Warm compress on ear", "Rest", "Pain management", "Avoid water in ears", "Antibiotics if bacterial"],
    medicines: ["Amoxicillin", "Ear drops (analgesic)", "Ibuprofen", "Ciprofloxacin ear drops"],
  },
  {
    id: "68", name: "Pharyngitis (Sore Throat)", category: "ENT",
    description: "Inflammation of the pharynx (back of the throat) causing pain and scratchiness.",
    causes: ["Viral infections", "Strep bacteria", "Allergies", "Dry air", "Irritants (smoke)", "GERD"],
    symptoms: ["Throat pain", "Difficulty swallowing", "Swollen glands", "Hoarse voice", "Fever", "Cough"],
    cures: ["Saltwater gargle", "Warm liquids", "Honey and lemon", "Rest voice", "Humidifier"],
    medicines: ["Paracetamol", "Ibuprofen", "Throat lozenges", "Penicillin (if bacterial)"],
  },
  // ===== DENTAL =====
  {
    id: "69", name: "Dental Cavity (Tooth Decay)", category: "Dental",
    description: "Permanent damage to the hard surface of teeth resulting in tiny holes caused by bacteria and acids.",
    causes: ["Poor oral hygiene", "Sugary foods/drinks", "Bacteria", "Dry mouth", "Acidic foods", "Not flossing"],
    symptoms: ["Toothache", "Sensitivity to hot/cold/sweet", "Visible holes in teeth", "Dark spots", "Pain when biting"],
    cures: ["Regular brushing (2x/day)", "Flossing daily", "Limit sugar", "Dental check-ups", "Fluoride treatment"],
    medicines: ["Fluoride toothpaste", "Ibuprofen (pain)", "Clove oil (topical)", "Chlorhexidine mouthwash"],
  },
  {
    id: "70", name: "Gingivitis", category: "Dental",
    description: "Mild gum disease causing irritation, redness, and swelling of the gingiva (gum tissue).",
    causes: ["Poor oral hygiene", "Plaque buildup", "Smoking", "Diabetes", "Hormonal changes", "Certain medications"],
    symptoms: ["Red/swollen gums", "Bleeding while brushing", "Bad breath", "Receding gums", "Tender gums"],
    cures: ["Proper brushing technique", "Daily flossing", "Antiseptic mouthwash", "Professional dental cleaning", "Quit smoking"],
    medicines: ["Chlorhexidine mouthwash", "Metronidazole gel", "Ibuprofen", "Fluoride toothpaste"],
  },
  // ===== REPRODUCTIVE =====
  {
    id: "71", name: "PCOS (Polycystic Ovary Syndrome)", category: "Reproductive",
    description: "A hormonal disorder causing enlarged ovaries with small cysts, affecting women of reproductive age.",
    causes: ["Hormonal imbalance", "Insulin resistance", "Genetics", "Inflammation", "Excess androgen"],
    symptoms: ["Irregular periods", "Excess hair growth", "Acne", "Weight gain", "Thinning hair", "Darkened skin patches"],
    cures: ["Weight management", "Regular exercise", "Balanced diet", "Stress management", "Hormonal treatment"],
    medicines: ["Metformin", "Oral contraceptives", "Spironolactone", "Clomiphene (for fertility)"],
  },
  {
    id: "72", name: "Endometriosis", category: "Reproductive",
    description: "A condition where tissue similar to the uterus lining grows outside the uterus, causing pain.",
    causes: ["Retrograde menstruation", "Immune system disorders", "Hormonal imbalance", "Genetics", "Surgical scars"],
    symptoms: ["Pelvic pain", "Painful periods", "Pain during intercourse", "Heavy bleeding", "Infertility", "Fatigue"],
    cures: ["Pain management", "Hormonal therapy", "Conservative surgery", "Fertility treatment", "Regular exercise"],
    medicines: ["Ibuprofen", "Naproxen", "Oral contraceptives", "GnRH agonists"],
  },
  // ===== PEDIATRIC =====
  {
    id: "73", name: "Hand, Foot and Mouth Disease", category: "Pediatric",
    description: "A mild, contagious viral illness common in young children, causing sores in the mouth and rash on hands/feet.",
    causes: ["Coxsackievirus", "Enterovirus", "Direct contact", "Respiratory droplets", "Contaminated surfaces"],
    symptoms: ["Fever", "Sore throat", "Painful mouth sores", "Rash on palms/soles", "Loss of appetite", "Irritability"],
    cures: ["Rest", "Cold fluids", "Soft foods", "Pain relief", "Good hygiene", "Self-limiting (7-10 days)"],
    medicines: ["Paracetamol", "Ibuprofen", "Oral numbing spray", "Mouthwash (for sores)"],
  },
  {
    id: "74", name: "Whooping Cough (Pertussis)", category: "Pediatric",
    description: "A highly contagious respiratory infection characterized by severe coughing fits followed by a whooping sound.",
    causes: ["Bordetella pertussis bacteria", "Airborne droplets", "Close contact", "Lack of vaccination"],
    symptoms: ["Severe coughing fits", "Whooping sound when breathing in", "Vomiting after coughing", "Fatigue", "Red/blue face during cough"],
    cures: ["Antibiotics (early stage)", "Rest", "Small frequent meals", "Fluids", "Avoid triggers", "Vaccination (prevention)"],
    medicines: ["Azithromycin", "Erythromycin", "Trimethoprim-Sulfamethoxazole", "Paracetamol"],
  },
  // ===== ALLERGIES =====
  {
    id: "75", name: "Allergic Rhinitis (Hay Fever)", category: "Allergies",
    description: "An allergic response causing cold-like symptoms such as sneezing, congestion, and runny nose.",
    causes: ["Pollen", "Dust mites", "Pet dander", "Mold", "Cockroach droppings"],
    symptoms: ["Sneezing", "Runny/stuffy nose", "Itchy eyes/nose/throat", "Watery eyes", "Fatigue", "Dark circles under eyes"],
    cures: ["Avoid allergens", "Use air purifiers", "Keep windows closed", "Shower after outdoor activity", "Nasal rinse"],
    medicines: ["Cetirizine", "Fluticasone nasal spray", "Loratadine", "Montelukast"],
  },
  {
    id: "76", name: "Food Allergy", category: "Allergies",
    description: "An immune system reaction that occurs after eating certain foods, even in small amounts.",
    causes: ["Peanuts/tree nuts", "Milk/eggs", "Fish/shellfish", "Wheat/soy", "Genetic predisposition"],
    symptoms: ["Hives/itching", "Swelling (face/throat)", "Abdominal pain", "Nausea/vomiting", "Dizziness", "Anaphylaxis (severe)"],
    cures: ["Strict avoidance of allergen", "Read food labels", "Carry epinephrine", "Wear medical ID", "Allergy testing"],
    medicines: ["Epinephrine auto-injector", "Cetirizine", "Diphenhydramine", "Prednisolone"],
  },
  // ===== INFECTIOUS =====
  {
    id: "77", name: "COVID-19", category: "Infectious",
    description: "A respiratory illness caused by SARS-CoV-2 virus with varying severity from mild to severe.",
    causes: ["SARS-CoV-2 virus", "Respiratory droplets", "Airborne transmission", "Contact with contaminated surfaces"],
    symptoms: ["Fever", "Cough", "Fatigue", "Loss of taste/smell", "Shortness of breath", "Body aches", "Sore throat"],
    cures: ["Rest", "Hydration", "Isolation", "Monitor oxygen levels", "Vaccination", "Medical care if severe"],
    medicines: ["Paracetamol", "Paxlovid (antiviral)", "Dexamethasone (severe)", "Monoclonal antibodies"],
  },
  {
    id: "78", name: "Rabies", category: "Infectious",
    description: "A deadly viral disease spread to humans through the bite or scratch of an infected animal.",
    causes: ["Rabies virus", "Dog/bat bites", "Animal scratches", "Contact with infected animal saliva"],
    symptoms: ["Fever", "Headache", "Anxiety", "Confusion", "Hydrophobia", "Excessive salivation", "Paralysis"],
    cures: ["Post-exposure prophylaxis (PEP)", "Wound cleaning immediately", "Vaccination", "Avoid stray animals"],
    medicines: ["Rabies vaccine", "Rabies immunoglobulin", "Wound antiseptic", "Tetanus booster"],
  },
  {
    id: "79", name: "HIV/AIDS", category: "Infectious",
    description: "HIV attacks the immune system; if untreated, it leads to AIDS, making the body vulnerable to infections.",
    causes: ["HIV virus", "Unprotected sex", "Contaminated needles", "Mother-to-child transmission", "Blood transfusion (rare)"],
    symptoms: ["Flu-like symptoms (early)", "Weight loss", "Recurring infections", "Night sweats", "Chronic diarrhea", "Swollen lymph nodes"],
    cures: ["Antiretroviral therapy (ART) — lifelong", "Safe practices", "Regular monitoring", "Healthy lifestyle", "Support groups"],
    medicines: ["Tenofovir + Emtricitabine", "Dolutegravir", "Efavirenz", "PrEP (prevention)"],
  },
  {
    id: "80", name: "Cholera", category: "Infectious",
    description: "An acute diarrheal illness caused by infection of the intestine with Vibrio cholerae bacteria.",
    causes: ["Vibrio cholerae bacteria", "Contaminated water", "Contaminated food", "Poor sanitation"],
    symptoms: ["Profuse watery diarrhea", "Vomiting", "Severe dehydration", "Muscle cramps", "Rapid heart rate", "Low blood pressure"],
    cures: ["Oral rehydration therapy", "IV fluids (severe)", "Clean water", "Sanitation improvement", "Vaccination"],
    medicines: ["ORS", "IV fluids", "Doxycycline", "Azithromycin"],
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
