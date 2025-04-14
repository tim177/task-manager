import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  text: string;
  isLoading?: boolean;
}

export default function SubmitButton({
  text,
  isLoading = false,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...
        </span>
      ) : (
        text
      )}
    </button>
  );
}
