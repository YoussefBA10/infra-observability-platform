import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  type: 'error' | 'success' | 'info' | 'warning';
  message: string;
  onClose?: () => void;
  dismissible?: boolean;
}

const Alert = ({ type, message, onClose, dismissible = true }: AlertProps) => {
  const styles = {
    error: 'bg-red-900/20 border-red-800 text-red-200',
    success: 'bg-green-900/20 border-green-800 text-green-200',
    info: 'bg-blue-900/20 border-blue-800 text-blue-200',
    warning: 'bg-yellow-900/20 border-yellow-800 text-yellow-200',
  };

  const icons = {
    error: <AlertCircle className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
  };

  return (
    <div className={`border rounded-lg p-4 flex items-start gap-3 ${styles[type]}`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="flex-1">
        <p>{message}</p>
      </div>
      {dismissible && onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-75 transition-opacity"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Alert;