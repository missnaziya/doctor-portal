export { }
declare global {
    interface Window {
      Intercom: (...args: any[]) => void;
    }
  }