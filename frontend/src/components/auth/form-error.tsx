interface FormErrorProps {
  error?: string;
  visible: boolean;
}

export default function FormError({ error, visible }: FormErrorProps) {
  if (!error || !visible) return null;

  return (
    <div className="text-sm text-red-500 mt-1" role="alert">
      {error}
    </div>
  );
}
