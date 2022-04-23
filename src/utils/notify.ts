import { toast } from 'react-toastify';

export const notify = (type: string, message: string) => {
  if (type === 'success') {
    toast.success(message);
  } else {
    toast.error(message);
  }
};
