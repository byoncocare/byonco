/**
 * Patient Profile utilities and types
 * Used for Journey Builder and Get Started form
 */

// Patient Profile Type
export const PatientProfile = {
  patientName: null,
  isSelfPatient: false,
  relationToPatient: "Self", // "Self" | "Father" | "Mother" | "Spouse" | "Son" | "Daughter" | "Grandfather" | "Grandmother" | "Relative" | "Other"
  cancerType: "",
  cancerStage: "", // "I" | "II" | "III" | "IV" | "Not Diagnosed Yet"
  city: "",
  country: "",
  preferredCities: [], // string[]
  budgetCurrency: "", // "USD", "INR", etc.
  budgetRangeLabel: "", // human-readable like "$50K–$200K USD"
  urgency: null, // "immediately" | "within_week" | "two_to_three_weeks" | "within_month"
};

/**
 * Build default journey prompt from patient profile
 */
export function buildDefaultJourneyPrompt(profile) {
  if (!profile) return null;

  const { relationToPatient, cancerStage, cancerType, city, country, preferredCities, budgetRangeLabel } = profile;

  // Validate required fields
  if (!cancerType || !cancerStage || !city || !country || !preferredCities?.length || !budgetRangeLabel) {
    return null;
  }

  // Extract stage number from "Stage III" format
  const stageNum = cancerStage.replace(/[^IV]/g, '').trim() || cancerStage;

  // Build relation phrase
  let relationPhrase;
  if (relationToPatient === "Self" || profile.isSelfPatient) {
    relationPhrase = "I have been diagnosed with";
  } else {
    const relation = relationToPatient.toLowerCase();
    relationPhrase = `My ${relation} has been diagnosed with`;
  }

  // Build preferred cities string
  let preferredCitiesJoined;
  if (preferredCities.length === 1) {
    preferredCitiesJoined = preferredCities[0];
  } else if (preferredCities.length === 2) {
    preferredCitiesJoined = `${preferredCities[0]} or ${preferredCities[1]}`;
  } else {
    const lastCity = preferredCities[preferredCities.length - 1];
    const otherCities = preferredCities.slice(0, -1).join(", ");
    preferredCitiesJoined = `${otherCities}, and ${lastCity}`;
  }

  // Build the prompt
  const prompt = `${relationPhrase} Stage ${stageNum} ${cancerType}. We currently live in ${city}, ${country}. I am looking for treatment options in ${preferredCitiesJoined} as we have relatives there. Our budget is roughly ${budgetRangeLabel}. We need help with travel and stay arrangements as well.`;

  return prompt;
}

/**
 * Get patient profile from localStorage (temporary solution)
 * TODO: Replace with real store/API/context
 */
export function getPatientProfile() {
  try {
    const stored = localStorage.getItem('byonco_patient_profile');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading patient profile:', e);
  }
  return null;
}

/**
 * Save patient profile to localStorage (temporary solution)
 * TODO: Replace with real store/API/context
 */
export function savePatientProfile(profile) {
  try {
    localStorage.setItem('byonco_patient_profile', JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving patient profile:', e);
  }
}

/**
 * Check if patient profile is complete
 */
export function isPatientProfileComplete(profile) {
  if (!profile) return false;
  
  return !!(
    profile.cancerType &&
    profile.cancerStage &&
    profile.city &&
    profile.country &&
    profile.preferredCities?.length > 0 &&
    profile.budgetRangeLabel
  );
}

/**
 * Get initials from a name
 * Examples: "John Doe" -> "JD", "Ajinkya Jadhav" -> "AJ", "Mary" -> "M"
 */
export function getInitials(name) {
  if (!name) return "PT";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0][0]?.toUpperCase() ?? "P";
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Get display name from patient profile or auth user
 */
export function getDisplayName(patientProfile, authUser) {
  if (patientProfile?.patientName) {
    return patientProfile.patientName;
  }
  if (authUser?.full_name) {
    return authUser.full_name;
  }
  if (authUser?.name) {
    return authUser.name;
  }
  return "Patient";
}

