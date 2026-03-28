/**
 * Hospital matching utility for ResQBridge.
 * Maps extracted location and incident data to the best hospital + ETA.
 */

/** @typedef {{ name: string, specialisation: string[], zones: string[], base_eta: number }} Hospital */

/** @type {Hospital[]} */
const HOSPITALS = [
  {
    name: 'Manipal Hospital, Whitefield',
    specialisation: ['trauma', 'TBI', 'orthopaedics'],
    zones: ['whitefield', 'kr puram', 'nh-48', 'nelamangala', 'tumkur'],
    base_eta: 6,
  },
  {
    name: 'Victoria Hospital',
    specialisation: ['trauma', 'burns', 'general emergency'],
    zones: ['city centre', 'majestic', 'shivajinagar', 'mg road'],
    base_eta: 9,
  },
  {
    name: 'Sakra World Hospital',
    specialisation: ['cardiac', 'stroke', 'neuro'],
    zones: ['bellandur', 'outer ring road', 'sarjapur', 'hsr'],
    base_eta: 11,
  },
  {
    name: 'MS Ramaiah Hospital',
    specialisation: ['trauma', 'general emergency', 'paediatric'],
    zones: ['hebbal', 'yeshwanthpur', 'mathikere', 'peenya'],
    base_eta: 14,
  },
  {
    name: 'NIMHANS',
    specialisation: ['neuro', 'TBI', 'psychiatric emergency'],
    zones: ['koramangala', 'jayanagar', 'btm', 'bannerghatta'],
    base_eta: 17,
  },
];

const DEFAULT_HOSPITAL = HOSPITALS[0];

/**
 * Compute a traffic-adjusted ETA.
 * Adds a random integer between -1 and +3 to the base ETA (minimum 1 min).
 * @param {number} baseEta
 * @returns {number}
 */
function adjustEta(baseEta) {
  const variance = Math.floor(Math.random() * 5) - 1; // -1 to +3
  return Math.max(1, baseEta + variance);
}

/**
 * Check whether any zone keyword appears in the location string.
 * @param {string} location - Lowercased location string.
 * @param {string[]} zones
 * @returns {boolean}
 */
function zonesMatch(location, zones) {
  return zones.some((zone) => location.includes(zone));
}

/**
 * Score a hospital's specialisation relevance to the incident.
 * Higher is better.
 * @param {Hospital} hospital
 * @param {string} incidentType - Lowercased incident type.
 * @param {{ total?: number, critical?: number }} casualties
 * @returns {number}
 */
function specialisationScore(hospital, incidentType, casualties) {
  let score = 0;
  const needsTrauma =
    (casualties?.critical ?? 0) > 0 &&
    (incidentType.includes('collision') || incidentType.includes('crash') || incidentType.includes('accident'));

  if (needsTrauma && hospital.specialisation.includes('trauma')) {
    score += 3;
  }

  if (incidentType.includes('tbi') && hospital.specialisation.includes('TBI')) {
    score += 2;
  }

  for (const spec of hospital.specialisation) {
    if (incidentType.includes(spec.toLowerCase())) {
      score += 1;
    }
  }

  return score;
}

/**
 * Match the best hospital for a given location, incident type, and casualty info.
 *
 * @param {string} locationString - Location extracted from the transcript.
 * @param {string} [incidentType=''] - Type of incident (e.g. "Multi-vehicle collision").
 * @param {{ total?: number, critical?: number }} [casualties={}] - Casualty summary.
 * @returns {{ hospital_name: string, eta_minutes: number, reason: string }}
 */
export function matchHospital(locationString, incidentType = '', casualties = {}) {
  const location = (locationString || '').toLowerCase();
  const incident = (incidentType || '').toLowerCase();

  /* 1. Find hospitals whose zones match the location */
  const zoneMatches = HOSPITALS.filter((h) => zonesMatch(location, h.zones));

  let best;
  let reason;

  if (zoneMatches.length > 0) {
    /* 2. Among zone matches, pick the one with the highest specialisation score */
    zoneMatches.sort(
      (a, b) =>
        specialisationScore(b, incident, casualties) -
        specialisationScore(a, incident, casualties),
    );
    best = zoneMatches[0];
    reason = `Zone match for "${locationString}" with ${best.specialisation[0]} capability`;
  } else {
    /* 3. No zone match — default to Manipal Whitefield */
    best = DEFAULT_HOSPITAL;
    reason = `Default hospital — no zone match for "${locationString}"`;
  }

  return {
    hospital_name: best.name,
    eta_minutes: adjustEta(best.base_eta),
    reason,
  };
}
