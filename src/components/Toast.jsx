import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 5000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
    const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
    const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);
    const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);

    return (
        <ToastContext.Provider value={{ success, error, info, warning, addToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer = ({ toasts, onRemove }) => {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
};

const Toast = ({ toast, onRemove }) => {
    const { id, message, type } = toast;

    const config = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-500',
            text: 'text-green-900',
            icon: CheckCircle,
            iconColor: 'text-green-500'
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-500',
            text: 'text-red-900',
            icon: AlertCircle,
            iconColor: 'text-red-500'
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-500',
            text: 'text-yellow-900',
            icon: AlertCircle,
            iconColor: 'text-yellow-500'
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-500',
            text: 'text-blue-900',
            icon: Info,
            iconColor: 'text-blue-500'
        }
    };

    const { bg, border, text, icon: Icon, iconColor } = config[type] || config.info;

    return (
        <div className={`${bg} border-l-4 ${border} p-4 rounded-lg shadow-lg animate-slide-in flex items-start gap-3`}>
            <Icon className={`${iconColor} flex-shrink-0`} size={20} />
            <p className={`${text} text-sm font-medium flex-1`}>{message}</p>
            <button
                onClick={() => onRemove(id)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
