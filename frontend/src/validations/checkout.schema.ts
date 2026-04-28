import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  address: z.string().trim().min(5, "Address must be at least 5 characters"),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
