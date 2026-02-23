import { storage, db } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, updateDoc, getDoc, Timestamp } from "firebase/firestore";

export interface ExtractedMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface PrescriptionRecord {
  id?: string;
  userId: string;
  imageUrl: string;
  status: 'pending' | 'processed' | 'confirmed';
  extractedData?: ExtractedMedicine[];
  confirmedData?: ExtractedMedicine[];
  createdAt: any;
}

// Simulated OCR & NLP Processing (Mimicking Google Vision + Custom NLP)
export const processPrescriptionAI = async (imageUrl: string): Promise<ExtractedMedicine[]> => {
  // In a real production app, this would call a Firebase Cloud Function 
  // that interacts with Google Vision API or AWS Textract.
  await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate heavy ML processing

  // Mocking the extraction logic based on common prescription patterns
  return [
    { name: "Paracetamol 500mg", dosage: "1 tablet", frequency: "1-0-1", duration: "5 days" },
    { name: "Amoxicillin 250mg", dosage: "1 capsule", frequency: "1-1-1", duration: "7 days" },
    { name: "Cetirizine 10mg", dosage: "1 tablet", frequency: "0-0-1", duration: "10 days" }
  ];
};

export const uploadPrescription = async (userId: string, file: File): Promise<string> => {
  const fileId = Math.random().toString(36).substring(7);
  const storageRef = ref(storage, `prescriptions/${userId}/${fileId}_${file.name}`);
  
  const snapshot = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  
  const docRef = await addDoc(collection(db, "prescriptions"), {
    userId,
    imageUrl: downloadUrl,
    status: 'pending',
    createdAt: Timestamp.now()
  });

  return docRef.id;
};

export const saveConfirmedMedicines = async (prescriptionId: string, medicines: ExtractedMedicine[]) => {
  const docRef = doc(db, "prescriptions", prescriptionId);
  await updateDoc(docRef, {
    confirmedData: medicines,
    status: 'confirmed'
  });
};