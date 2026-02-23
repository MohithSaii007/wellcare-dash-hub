"use client";

import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { ExtractedMedicine } from "./ocrService";

export const uploadPrescriptionImage = async (userId: string, file: File): Promise<string> => {
  const storageRef = ref(storage, `prescriptions/${userId}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

export const savePrescriptionData = async (userId: string, data: {
  imageUrl: string;
  extractedText: string;
  medicines: ExtractedMedicine[];
  status: "pending" | "confirmed";
}) => {
  const docRef = await addDoc(collection(db, "prescriptions"), {
    ...data,
    userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
};

export const confirmPrescriptionMedicines = async (prescriptionId: string, medicines: ExtractedMedicine[]) => {
  const docRef = doc(db, "prescriptions", prescriptionId);
  await updateDoc(docRef, {
    medicines,
    status: "confirmed",
    updatedAt: Timestamp.now()
  });
};