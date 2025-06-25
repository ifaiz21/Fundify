import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Configure default options for toast notifications
const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored", // Or "light", "dark"
};

/**
 * Displays a success toast notification.
 * @param {string} message - The message to display.
 * @param {object} options - Optional configuration for the toast.
 */
export const showSuccessMessage = (message, options = {}) => {
  toast.success(message, { ...toastConfig, ...options });
};

/**
 * Displays an error toast notification.
 * @param {string} message - The message to display.
 * @param {object} options - Optional configuration for the toast.
 */
export const showErrorMessage = (message, options = {}) => {
  toast.error(message, { ...toastConfig, ...options });
};