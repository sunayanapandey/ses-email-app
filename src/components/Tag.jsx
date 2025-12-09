import React from 'react';

/**
 * Tag Component
 * 
 * Implements the design system tag/badge styles for various statuses.
 * 
 * Props:
 * - variant: 'approved' | 'verified' | 'rejected' | 'not_verified' | 'pending' | 'submitted' | 'default'
 * - children: ReactNode
 * - className: string (additional classes)
 */
const Tag = ({ variant = 'default', children, className = '' }) => {
    // Base styles from specs:
    // Height: 22px
    // Padding: 2px 12px
    // Radius: 12px
    // Gap: 4px
    // Font: Lexend Deca (default sans), Light (300), 14px, 18px line-height
    const baseStyles = "inline-flex items-center justify-center gap-[4px] font-light text-[14px] leading-[18px] rounded-[12px] px-[12px] py-[2px] h-[22px] whitespace-nowrap transition-all duration-200";

    const variants = {
        approved: "bg-success-500 text-white",
        verified: "bg-success-500 text-white",
        rejected: "bg-error-500 text-white",
        not_verified: "bg-error-500 text-white",
        pending: "bg-warning-500 text-white",
        submitted: "bg-secondary-500 text-white",
        default: "bg-surface-100 text-surface-800"
    };

    return (
        <span className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}>
            {children}
        </span>
    );
};

export default Tag;
