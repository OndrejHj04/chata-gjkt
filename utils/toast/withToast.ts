import ToastManager from "./ToastManager";
import { MessagePaths } from "./types";

export const withToast = async (func: Promise<{ success: boolean, message?: MessagePaths }>, { message, onSuccess, onError }: { message: MessagePaths, onSuccess?: () => void, onError?: () => void }) => {
  const { success: successfulyResolved, message: rewriteMessage } = await func
  
  if (successfulyResolved) {
    if (onSuccess) onSuccess()
    ToastManager.show(`${(rewriteMessage ?? message)}.success`)
  }
  else {
    if (onError) onError()
    ToastManager.show(`${(rewriteMessage ?? message)}.error`)
  }

  return successfulyResolved
}
