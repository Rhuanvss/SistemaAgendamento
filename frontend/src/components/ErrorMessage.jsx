import { AlertCircle } from "lucide-react";

export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2.5 rounded-lg bg-red-50/80 border border-red-200 p-4 text-sm text-red-700 animate-in fade-in slide-in-from-top-2 duration-300">
      <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
      <div className="flex-1 font-medium">{message}</div>
    </div>
  );
}