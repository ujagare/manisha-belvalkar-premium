export { getResend, sendEmail } from "./client";
export {
  enquiryAdminEmail,
  orderConfirmationEmail,
  bookingAdminEmail,
  sessionReminderEmail,
  sessionAftercareEmail,
  paymentDisputeAdminEmail,
  shipmentDispatchedEmail,
  shipmentOutForDeliveryEmail,
  shipmentDeliveredEmail,
} from "./templates";
export { isEmailConfigured } from "@/lib/env";
