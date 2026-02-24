export type NotificationType = 
  | "ORDER_CONFIRMED" 
  | "ORDER_DELIVERED" 
  | "APPOINTMENT_CONFIRMED" 
  | "APPOINTMENT_REMINDER" 
  | "PAYMENT_SUCCESS" 
  | "MEDICINE_REMINDER" 
  | "EMERGENCY_ALERT"
  | "DOCTOR_EN_ROUTE"
  | "TELECONSULT_START"
  | "PRESCRIPTION_READY"
  | "HEALTH_ALERT_HIGH"
  | "HEALTH_ALERT_LOW"
  | "OTP_CODE";

interface MessageData {
  name?: string;
  id?: string;
  time?: string;
  doctor?: string;
  medicine?: string;
  amount?: string;
  metric?: string;
  value?: string;
  code?: string;
}

export const generateNotificationMessage = (type: NotificationType, data: MessageData) => {
  switch (type) {
    case "OTP_CODE":
      return {
        title: "Security Code 🔐",
        body: `Your MedCare verification code is ${data.code}. Do not share this with anyone.`,
        sms: `MedCare: Your OTP is ${data.code}. Valid for 5 minutes.`,
      };
    case "ORDER_CONFIRMED":
      return {
        title: "Order Confirmed! 💊",
        body: `Great news! Your order ${data.id ? `#${data.id}` : ""} is confirmed and being packed. We'll notify you when it's out for delivery.`,
        sms: `WellCare: Order ${data.id} confirmed. Our team is preparing your medicines. Stay healthy!`,
      };
    case "ORDER_DELIVERED":
      return {
        title: "Order Delivered 🏠",
        body: `Your medicines have been delivered. Please check your doorstep. Thank you for choosing WellCare!`,
        sms: `WellCare: Your order has been delivered. Hope you feel better soon!`,
      };
    case "APPOINTMENT_CONFIRMED":
      return {
        title: "Booking Confirmed 🏥",
        body: `Confirmed! ${data.doctor || "Your doctor"} is looking forward to seeing you at ${data.time || "the scheduled time"}.`,
        sms: `WellCare: Appointment confirmed with ${data.doctor} at ${data.time}. Please arrive 15 mins early.`,
      };
    case "APPOINTMENT_REMINDER":
      return {
        title: "Appointment Reminder ⏰",
        body: `Just a friendly reminder: You have an appointment with ${data.doctor || "your doctor"} in 1 hour.`,
        sms: `WellCare Reminder: Your appointment with ${data.doctor} is in 1 hour. See you soon!`,
      };
    case "PAYMENT_SUCCESS":
      return {
        title: "Payment Successful ✅",
        body: `We've received your payment of ${data.amount || "the amount"}. Your transaction ID is ${data.id || "N/A"}.`,
        sms: `WellCare: Payment of ${data.amount} received. Thank you!`,
      };
    case "MEDICINE_REMINDER":
      return {
        title: "Medicine Time! 💧",
        body: `It's time for your ${data.medicine || "scheduled medicine"}. Remember to stay hydrated!`,
        sms: `WellCare: Time for your ${data.medicine}. Don't forget to take it with water!`,
      };
    case "EMERGENCY_ALERT":
      return {
        title: "Emergency Alert 🚨",
        body: `CRITICAL: A medical professional has been notified of your emergency. Please stay calm and keep your phone nearby.`,
        sms: `WellCare URGENT: Emergency help is being coordinated. Stay where you are. Help is coming.`,
      };
    case "DOCTOR_EN_ROUTE":
      return {
        title: "Doctor is on the way! 🚗",
        body: `${data.doctor || "The doctor"} has started the journey to your location and should arrive shortly.`,
        sms: `WellCare: ${data.doctor} is en route to your address for the home visit.`,
      };
    case "TELECONSULT_START":
      return {
        title: "Consultation Starting 🎥",
        body: `${data.doctor || "The doctor"} is waiting for you in the video room. Join now!`,
        sms: `WellCare: Your video consultation with ${data.doctor} is starting now. Click to join.`,
      };
    case "PRESCRIPTION_READY":
      return {
        title: "E-Prescription Ready 📄",
        body: `Your prescription from ${data.doctor || "the doctor"} is now available in your profile.`,
        sms: `WellCare: Your e-prescription is ready. You can now order medicines directly from the app.`,
      };
    case "HEALTH_ALERT_HIGH":
      return {
        title: "Health Alert: High Reading ⚠️",
        body: `Your ${data.metric} reading of ${data.value} is above the normal range. Please consult a doctor if you feel unwell.`,
        sms: `WellCare Alert: High ${data.metric} detected (${data.value}). Please monitor your symptoms.`,
      };
    case "HEALTH_ALERT_LOW":
      return {
        title: "Health Alert: Low Reading ⚠️",
        body: `Your ${data.metric} reading of ${data.value} is below the normal range. Please consult a doctor if you feel unwell.`,
        sms: `WellCare Alert: Low ${data.metric} detected (${data.value}). Please monitor your symptoms.`,
      };
    default:
      return {
        title: "New Notification",
        body: "You have a new update from WellCare.",
        sms: "WellCare: You have a new update in your app.",
      };
  }
};