/**
 * Zod schema for validating scraped doctor data
 */
import { z } from "zod";

export const DoctorSchema = z.object({
  source: z.literal("zenonco"),
  listing_page_url: z.string().url(),
  profile_url: z.string().url().nullable(),
  name: z.string().min(1),
  designation: z.string().nullable(),
  specialty: z.string().nullable(),
  sub_specialties: z.array(z.string()).default([]),
  years_experience: z.string().nullable(),
  hospital_affiliations: z.array(z.string()).default([]),
  clinic_address: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  languages: z.array(z.string()).default([]),
  education: z.array(z.string()).default([]),
  qualifications: z.array(z.string()).default([]),
  awards_memberships: z.array(z.string()).default([]),
  conditions_treated: z.array(z.string()).default([]),
  procedures: z.array(z.string()).default([]),
  about: z.string().nullable(),
  consultation_fee: z.string().nullable(),
  availability: z.string().nullable(),
  phone: z.string().nullable(),
  rating: z.string().nullable(),
  reviews_count: z.string().nullable(),
  raw_text_snapshot: z.string().max(500).nullable(),
  scraped_at: z.string().datetime()
});

export function validateDoctor(data) {
  try {
    return { success: true, data: DoctorSchema.parse(data) };
  } catch (error) {
    return { success: false, error: error.errors };
  }
}

