import React from 'react';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="text-red-600 mt-0.5" size={20} />
                    <div>
                        <h3 className="text-red-800 font-medium">Something went wrong</h3>
                        <p className="text-red-600 text-sm mt-1">
                            The editor encountered an error. Please try refreshing the page.
                        </p>
                        <button
                            onClick={() => this.setState({ hasError: false })}
                            className="mt-2 text-sm text-red-700 underline hover:text-red-800"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
