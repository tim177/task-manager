import { Github, Twitter } from "lucide-react";

export default function SocialButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
      >
        <Github className="h-5 w-5" />
        <span className="ml-2"> Github</span>
      </button>
      <button
        type="button"
        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
      >
        <Twitter className="h-5 w-5" />
        <span className="ml-2">Twitter</span>
      </button>
    </div>
  );
}
