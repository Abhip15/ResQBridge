import { mockResult } from '../data/mockResult';
import { useCountdown } from '../hooks/useCountdown';
import { padTime } from '../utils/formatters';
import CircularProgress from './CircularProgress';
import {
  AlertTriangleIcon,
  MapPinIcon,
  AmbulanceIcon,
  HospitalIcon,
  ClockIcon,
  UsersIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  BellIcon,
  ListOrderedIcon,
  RotateCcwIcon,
  CarCrashIcon,
} from './Icons';

/**
 * ResultsScreen — State 2 of ResQBridge.
 * Displays the Gemini analysis results with dispatch info,
 * bystander instructions, and confidence score.
 */
export default function ResultsScreen({ onReset }) {
  const data = mockResult;
  const { minutes, seconds } = useCountdown(data.dispatch.eta_minutes);

  return (
    <div
      className="min-h-screen px-4 py-6 md:py-8"
      aria-live="polite"
      aria-label="Emergency analysis results"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* ── Header: Severity badge + Location ── */}
        <header className="animate-fade-in-up stagger-1 opacity-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3">
            {/* Severity badge */}
            <div
              role="alert"
              className="inline-flex items-center gap-2 px-4 py-2 bg-critical/15 border border-critical/30 rounded-full animate-pulse-critical"
            >
              <AlertTriangleIcon className="text-critical" size={18} />
              <span className="text-critical font-bold text-sm tracking-wider font-data">
                {data.severity}
              </span>
            </div>
            {/* Location */}
            <div className="flex items-center gap-2 text-text-secondary">
              <MapPinIcon className="text-text-muted flex-shrink-0" size={16} />
              <span className="text-sm font-data">{data.location}</span>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-critical/40 via-border-default to-transparent" />
        </header>

        {/* ── Main grid: Incident + Dispatch ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Incident Summary Card */}
          <section
            className="bg-bg-card border border-border-default rounded-2xl p-5 animate-fade-in-up stagger-2 opacity-0 hover:border-border-focus transition-colors duration-300"
            aria-labelledby="incident-heading"
          >
            <div className="flex items-center gap-2 mb-4">
              <CarCrashIcon className="text-warning" size={20} />
              <h2 id="incident-heading" className="text-lg font-semibold text-text-primary">
                Incident Summary
              </h2>
            </div>

            <div className="space-y-4">
              {/* Type */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangleIcon className="text-warning" size={16} />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide mb-0.5">
                    Type
                  </p>
                  <p className="text-sm font-medium text-text-primary font-data">
                    {data.incident_type}
                  </p>
                </div>
              </div>

              {/* Casualties */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-critical/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <UsersIcon className="text-critical" size={16} />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide mb-0.5">
                    Casualties
                  </p>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl font-bold text-text-primary font-data">
                      {data.casualties.total}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-critical/15 text-critical rounded-md font-data border border-critical/20">
                      {data.casualties.critical} critical
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    {data.casualties.description}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Dispatch Details Card */}
          <section
            className="bg-bg-card border border-border-default rounded-2xl p-5 animate-fade-in-up stagger-3 opacity-0 hover:border-border-focus transition-colors duration-300"
            aria-labelledby="dispatch-heading"
          >
            <div className="flex items-center gap-2 mb-4">
              <AmbulanceIcon className="text-success" size={20} />
              <h2 id="dispatch-heading" className="text-lg font-semibold text-text-primary">
                Dispatch Details
              </h2>
            </div>

            <div className="space-y-4">
              {/* Unit */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AmbulanceIcon className="text-success" size={16} />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide mb-0.5">
                    Unit Dispatched
                  </p>
                  <p className="text-sm font-medium text-text-primary font-data">
                    {data.dispatch.unit}
                  </p>
                </div>
              </div>

              {/* Hospital */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <HospitalIcon className="text-accent" size={16} />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide mb-0.5">
                    Destination Hospital
                  </p>
                  <p className="text-sm font-medium text-text-primary font-data">
                    {data.dispatch.hospital}
                  </p>
                </div>
              </div>

              {/* ETA Countdown */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ClockIcon className="text-warning" size={16} />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide mb-0.5">
                    ETA
                  </p>
                  <p
                    className="text-2xl font-bold text-warning font-data tabular-nums"
                    aria-label={`Estimated arrival in ${minutes} minutes and ${seconds} seconds`}
                    aria-live="off"
                  >
                    {padTime(minutes)}:{padTime(seconds)}
                  </p>
                </div>
              </div>

              {/* Alert sent */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BellIcon className="text-success" size={16} />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide mb-0.5">
                    Alert Status
                  </p>
                  <div className="flex items-center gap-1.5">
                    <CheckCircleIcon className="text-success flex-shrink-0" size={14} />
                    <p className="text-sm text-success font-medium">
                      {data.dispatch.alert_sent}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ── Bottom grid: Instructions + Confidence ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bystander Instructions */}
          <section
            className="md:col-span-2 bg-bg-card border border-border-default rounded-2xl p-5 animate-fade-in-up stagger-3 opacity-0 hover:border-border-focus transition-colors duration-300"
            aria-labelledby="instructions-heading"
          >
            <div className="flex items-center gap-2 mb-4">
              <ListOrderedIcon className="text-warning" size={20} />
              <h2 id="instructions-heading" className="text-lg font-semibold text-text-primary">
                Bystander Instructions
              </h2>
            </div>

            <ol className="space-y-3" role="list">
              {data.bystander_instructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full bg-warning/15 text-warning text-xs font-bold flex items-center justify-center font-data border border-warning/20"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <p className="text-base text-text-primary leading-relaxed pt-0.5">
                    {instruction}
                  </p>
                </li>
              ))}
            </ol>

            {/* Safety reminder */}
            <div className="mt-5 flex items-center gap-2 px-3 py-2 bg-success/5 border border-success/20 rounded-lg">
              <ShieldCheckIcon className="text-success flex-shrink-0" size={16} />
              <p className="text-xs text-success">
                Your safety comes first — do not put yourself at risk
              </p>
            </div>
          </section>

          {/* Confidence Score */}
          <section
            className="bg-bg-card border border-border-default rounded-2xl p-5 flex flex-col items-center justify-center animate-fade-in-up stagger-4 opacity-0 hover:border-border-focus transition-colors duration-300"
            aria-labelledby="confidence-heading"
          >
            <h2
              id="confidence-heading"
              className="text-sm font-medium text-text-secondary mb-4"
            >
              Analysis Confidence
            </h2>
            <CircularProgress score={data.confidence_score} size={130} />
            <p className="mt-3 text-xs text-text-muted text-center max-w-[160px]">
              Based on transcript analysis &amp; scene data
            </p>
          </section>
        </div>

        {/* ── Reset button ── */}
        <div className="flex justify-center pt-2 pb-4 animate-fade-in-up stagger-4 opacity-0">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-6 py-3 min-h-[48px] bg-bg-card border border-border-default rounded-xl text-sm font-medium text-text-secondary hover:bg-bg-card-hover hover:border-border-focus hover:text-text-primary transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            aria-label="Report another emergency — return to input screen"
          >
            <RotateCcwIcon size={16} />
            Report Another Emergency
          </button>
        </div>
      </div>
    </div>
  );
}
