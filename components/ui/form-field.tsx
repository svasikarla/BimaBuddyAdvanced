import { cn } from "@/lib/utils"

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  htmlFor?: string
  error?: string
}

export function FormField({ 
  children, 
  className, 
  label, 
  htmlFor, 
  error,
  ...props 
}: FormFieldProps) {
  return (
    <div className={cn("mb-6", className)} {...props}>
      {label && (
        <label 
          htmlFor={htmlFor} 
          className="text-sm font-medium text-gray-700 mb-1.5 block"
        >
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}