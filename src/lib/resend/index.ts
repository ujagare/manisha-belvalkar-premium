export { getResend, sendEmail } from "./client";
export {
  enquiryAdminEmail,
  orderConfirmationEmail,
  bookingAdminEmail,
  sessionReminderEmail,
  paymentDisputeAdminEmail,
} from "./templates";
export { isEmailConfigured } from "@/lib/env";
