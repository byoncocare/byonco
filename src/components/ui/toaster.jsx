import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CheckCircle2, XCircle, Info, AlertCircle } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  const getIcon = (variant) => {
    switch (variant) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
      case "info":
        return <Info className="h-5 w-5 text-blue-400 flex-shrink-0" />
      default:
        return <AlertCircle className="h-5 w-5 text-white/60 flex-shrink-0" />
    }
  }

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant = "default", ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-start gap-3 flex-1">
              {getIcon(variant)}
              <div className="grid gap-1 flex-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
