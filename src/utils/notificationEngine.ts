export type NotificationType = 
  | "ORDER_CONFIRMED" 
  | "ORDER_DELIVERED" 
  | "APPOINTMENT_CONFIRMED" 
  | "APPOINTMENT_REMINDER" 
  | "PAYMENT_SUCCESS" 
  | "MEDICINE_REMINDER" 
  | "EMERGENCY_ALERT"
  | "DOCTOR_EN_ROUTE";

interface MessageData {
  name?: string;
  id?: string;
  time?: string;
  doctor?: string;
  medicine?: string;
  amount?: string;
}

export const generateNotificationMessage = (type: NotificationType, data: MessageData) => {
  switch (type) {
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
    default:
      return {
        title: "New Notification",
        body: "You have a new update from WellCare.",
        sms: "WellCare: You have a new update in your app.",
      };
  }
};