"use client";

export interface ExtractedMedicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface OCRResult {
  prescriptionId: string;
  extractedText: string;
  medicines: ExtractedMedicine[];
}

/**
 * Simulates the OCR and NLP extraction process.
 * In a production environment, this would call Google Vision API 
 * and a specialized medical NLP model.
 */
export const processPrescriptionML = async (imageUrl: string): Promise<OCRResult> => {
  // Simulate network delay for ML processing
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Mock extracted text from an image
  const mockExtractedText = `
    Dr. Sarah Johnson
    Reg No: 12345
    
    Patient: John Doe
    Date: 2024-05-20
    
    Rx
    1. Paracetamol 500mg - 1 tab 1-0-1 for 5 days
    2. Amoxicillin 250mg - 1 cap 1-1-1 for 7 days
    3. Cetirizine 10mg - 1 tab 0-0-1 for 3 days
    
    Signature: SJ
  `;

  // Simulated NLP parsing logic
  const medicines: ExtractedMedicine[] = [
    {
      id: Math.random().toString(36).substr(2, 9),
      name: "Paracetamol 500mg",
      dosage: "1 tablet",
      frequency: "1-0-1 (Morning, Night)",
      duration: "5 days"
    },
    {
      id: Math.random().toString(36).substr(2, 9),
      name: "Amoxicillin 250mg",
      dosage: "1 capsule",
      frequency: "1-1-1 (Morning, Afternoon, Night)",
      duration: "7 days"
    },
    {
      id: Math.random().toString(36).substr(2, 9),
      name: "Cetirizine 10mg",
      dosage: "1 tablet",
      frequency: "0-0-1 (Night)",
      duration: "3 days"
    }
  ];

  return {
    prescriptionId: `PRE-${Date.now()}`,
    extractedText: mockExtractedText,
    medicines
  };
};