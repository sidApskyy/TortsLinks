import { z } from "zod";
import { CAMPAIGNS, OTHER_CAMPAIGN } from "./campaigns";

const ALL_CAMPAIGNS = [...CAMPAIGNS.map((c) => c.name), OTHER_CAMPAIGN];

export const leadSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Last name is required").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(30)
    .regex(/^[\d\s()+.-]+$/, "Enter a valid phone number"),
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code"),
  campaign: z.string().refine((v) => ALL_CAMPAIGNS.includes(v), "Select a campaign"),
  description: z.string().trim().max(4000).optional().default(""),
  consent: z.literal("on", { error: "Consent is required" }),
  company: z.string().max(500).optional().default(""),
  ts: z.coerce.number().int().positive(),
  certUrl: z.string().max(2000).optional().default(""),
  certToken: z.string().max(2000).optional().default(""),
  turnstileToken: z.string().optional().default(""),
});

export type LeadInput = z.infer<typeof leadSchema>;
