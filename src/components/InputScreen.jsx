import { useState, useRef, useCallback } from 'react';
import { mockTranscript } from '../data/mockResult';
import { useSimulatedLoading } from '../hooks/useCountdown';
import { CameraIcon, AlertTriangleIcon, SparklesIcon } from './Icons';

/**
 * InputScreen — State 1 of ResQBridge.
 * Shows emergency report form with transcript input and photo upload.
 */
export default function InputScreen({ onSubmit }) {
  const [transcript, setTranscript] = useState(mockTranscript);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleComplete = useCallback(() => {
    onSubmit();
  }, [onSubmit]);

  const { isLoading, startLoading } = useSimulatedLoading(handleComplete);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!transcript.trim()) return;
    startLoading();
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg animate-fade-in">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-critical/10 flex items-center justify-center border border-critical/20">
              <AlertTriangleIcon className="text-critical" size={24} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">
              ResQ<span className="text-critical">Bridge</span>
            </h1>
          </div>
          <p className="text-text-secondary text-sm max-w-xs mx-auto">
            Gemini-powered emergency response assistant for bystanders
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Transcript input */}
          <div>
            <label
              htmlFor="emergency-transcript"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Emergency Description
            </label>
            <textarea
              id="emergency-transcript"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={5}
              className="w-full bg-bg-input border border-border-default rounded-xl px-4 py-3 text-text-primary text-sm leading-relaxed resize-none transition-colors duration-200 focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-accent/30 placeholder:text-text-muted"
              placeholder="Describe the emergency situation..."
              disabled={isLoading}
              aria-describedby="transcript-help"
            />
            <p id="transcript-help" className="mt-1.5 text-xs text-text-muted">
              Include location, number of people, injuries, and any hazards
            </p>
          </div>

          {/* Photo upload */}
          <div>
            <label
              htmlFor="photo-upload"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Scene Photo (Optional)
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] min-w-[44px] bg-bg-card border border-border-default rounded-xl text-sm text-text-secondary hover:bg-bg-card-hover hover:border-border-focus transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Attach a photo of the accident scene"
              >
                <CameraIcon size={18} />
                <span>Attach Photo</span>
              </button>
              {fileName && (
                <span className="text-xs text-text-muted truncate max-w-[200px]" aria-live="polite">
                  📎 {fileName}
                </span>
              )}
            </div>
            <input
              ref={fileInputRef}
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
              disabled={isLoading}
              aria-label="Upload photo of accident scene"
            />
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !transcript.trim()}
              className="w-full min-h-[52px] bg-critical hover:bg-critical/90 disabled:bg-critical/40 disabled:cursor-not-allowed text-white font-semibold text-base rounded-xl transition-all duration-200 animate-pulse-glow focus-visible:ring-2 focus-visible:ring-critical focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
              aria-label="Report emergency and send details to Gemini for analysis"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <SparklesIcon size={18} className="animate-spin" />
                  Analysing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <AlertTriangleIcon size={18} />
                  Report Emergency
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Loading state */}
        {isLoading && (
          <div
            className="mt-6 animate-fade-in"
            role="status"
            aria-busy="true"
            aria-live="polite"
          >
            <div className="bg-bg-card border border-border-default rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <SparklesIcon size={16} className="text-warning" />
                <span className="text-sm font-medium text-warning">
                  Gemini is analysing...
                </span>
              </div>
              <div className="w-full h-1.5 bg-bg-primary rounded-full overflow-hidden">
                <div className="h-full rounded-full animate-shimmer-bar w-full" />
              </div>
              <p className="mt-2 text-xs text-text-muted">
                Extracting location, assessing severity, and preparing dispatch recommendations
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
