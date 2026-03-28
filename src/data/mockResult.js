/**
 * Mock result data for ResQBridge emergency response.
 * In production, this would be returned by the Gemini API.
 */
export const mockResult = {
  location: "NH-48, near Nelamangala Toll, Bengaluru",
  incident_type: "Multi-vehicle collision",
  casualties: {
    total: 4,
    critical: 1,
    description: "1 unconscious — possible TBI",
  },
  dispatch: {
    unit: "ALS Ambulance",
    hospital: "Manipal Hospital, Whitefield",
    eta_minutes: 6,
    alert_sent: "Victoria Hospital trauma team notified",
  },
  bystander_instructions: [
    "Do not move the unconscious person",
    "Keep airway clear — tilt head back gently if no spinal injury suspected",
    "Apply firm pressure to any visible bleeding wounds",
    "Stay on this screen — paramedic will call you in 90 seconds",
  ],
  severity: "CRITICAL",
  confidence_score: 0.91,
};

export const mockTranscript =
  "There's a truck, it hit two cars near the Nelamangala toll, NH-48 Bengaluru side, I think someone is unconscious, there's blood, maybe 3-4 people hurt";
