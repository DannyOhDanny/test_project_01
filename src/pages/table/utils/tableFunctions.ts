import axios from 'axios';
function getQueryErrorMessage(error: unknown): string {
  if (error !== null && typeof error === 'object' && 'userMessage' in error) {
    const userMessage = (error as { userMessage?: unknown }).userMessage;
    if (typeof userMessage === 'string' && userMessage.length > 0) {
      return userMessage;
    }
  }
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === 'object' && 'message' in data) {
      const msg = (data as { message?: unknown }).message;
      if (typeof msg === 'string' && msg.length > 0) {
        return msg;
      }
    }
    if (typeof error.message === 'string' && error.message.length > 0) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export { getQueryErrorMessage };
