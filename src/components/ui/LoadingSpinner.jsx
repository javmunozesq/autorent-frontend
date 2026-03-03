export default function LoadingSpinner() {
  return (
    <div className="loading-spinner" aria-label="loading">
      <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
        <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="4" strokeOpacity="0.2" />
        <path d="M45 25a20 20 0 0 1-20 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
}