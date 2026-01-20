"use client";

type AuthLoginToggleProps = {
  isSignUp: boolean;
  isBusy: boolean;
  onToggle: () => void;
};

export function AuthLoginToggle({ isSignUp, isBusy, onToggle }: AuthLoginToggleProps) {
  return (
    <div className="text-center text-sm">
      <button
        type="button"
        onClick={onToggle}
        className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
        disabled={isBusy}
      >
        {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
      </button>
    </div>
  );
}
