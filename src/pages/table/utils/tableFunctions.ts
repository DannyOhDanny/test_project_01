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

const getStrkeColor = (value: number) => {
  if (!value) return;
  if (value < 15) return '#ef4444';
  if (value < 45 && value >= 15) return '#f97316';
  if (value >= 45 && value < 80) return '#facc15';
  if (value >= 80 && value <= 100) return '#22c55e';
  return '#9ca3af';
};
function getRandomStock(min: number, max: number) {
  if (max <= min) return min;
  return Math.floor(Math.random() * (max - min)) + min;
}

export { getQueryErrorMessage, getRandomStock, getStrkeColor };
