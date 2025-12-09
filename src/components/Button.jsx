import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

/**
 * Button Component
 * 
 * Implements the design system button variants and states.
 * 
 * Props:
 * - variant: 'primary' | 'secondary' | 'dashed' | 'link' | 'ghost' (default: 'primary')
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - isLoading: boolean (default: false)
 * - icon: LucideIcon component (optional)
 * - iconPosition: 'left' | 'right' (default: 'left')
 * - fullWidth: boolean (default: false)
 * - className: string (additional classes)
 * - children: ReactNode
 * - to: string (optional, renders as Link if present)
 * - ...props: other button props (onClick, disabled, type, etc.)
 */
const Button = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon: Icon,
    iconPosition = 'left',
    fullWidth = false,
    className = '',
    children,
    disabled,
    to,
    ...props
}) => {
    // Base styles - 4px border radius, gap-2 (8px) for icon spacing
    // Typography: Lexend Deca (inherited), 400 weight, 14px size, 18px line-height, centered
    const baseStyles = "inline-flex items-center justify-center gap-2 font-normal text-[14px] leading-[18px] text-center transition-all duration-200 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

    // Size styles - All buttons follow user specifications (135x32px with 4px 16px padding)
    const sizeStyles = {
        sm: "px-[16px] py-[4px] min-w-[100px] h-[28px]",
        md: "px-[16px] py-[4px] min-w-[135px] h-[32px]", // User specification
        lg: "px-[20px] py-[6px] min-w-[160px] h-[40px]",
    };

    // Variant styles - 1px border width included
    const variantStyles = {
        primary: "bg-primary-500 text-white border border-primary-500 hover:bg-primary-300 hover:border-primary-300 active:bg-primary-700 active:border-primary-700 focus:ring-primary-500 shadow-sm",
        secondary: "bg-surface-10 text-surface-900 border border-surface-200 hover:border-primary-300 active:border-primary-500 active:text-primary-500 focus:ring-primary-500",
        dashed: "bg-surface-10 text-surface-900 border border-dashed border-surface-200 hover:border-primary-300 hover:text-primary-500 active:border-primary-500 active:text-primary-500 focus:ring-primary-500",
        link: "text-surface-900 hover:text-primary-300 active:text-primary-500 underline-offset-4 hover:underline focus:ring-primary-500 border-none active:scale-100",
        ghost: "bg-transparent text-surface-900 border border-transparent hover:bg-surface-25 hover:border-surface-100 active:bg-primary-50 active:text-primary-600 active:border-primary-200 focus:ring-surface-200",
        destructive: "bg-error-500 text-white border border-error-500 hover:bg-error-300 hover:border-error-300 active:bg-error-700 active:border-error-700 focus:ring-error-500 shadow-sm",
    };

    // Combine styles
    const classes = `
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
    `;

    const content = (
        <>
            {isLoading && (
                <Loader2 className="w-4 h-4 animate-spin" />
            )}

            {!isLoading && Icon && iconPosition === 'left' && (
                <Icon className="w-5 h-5" />
            )}

            {children}

            {!isLoading && Icon && iconPosition === 'right' && (
                <Icon className="w-5 h-5" />
            )}
        </>
    );

    if (to) {
        return (
            <Link to={to} className={classes.trim()} {...props}>
                {content}
            </Link>
        );
    }

    return (
        <button
            className={classes.trim()}
            disabled={disabled || isLoading}
            {...props}
        >
            {content}
        </button>
    );
};

export default Button;
