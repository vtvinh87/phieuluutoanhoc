import React from 'react';

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const LightbulbIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.355a7.5 7.5 0 0 1-4.5 0m4.5 0v-.75A18.75 18.75 0 0 1 12 5.25c0-2.433.004-4.83.004-7.186a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75c0 2.356.004 4.753.004 7.186 0 2.217-.616 4.39-1.748 6.138H7.5a1.5 1.5 0 0 0 0 3h9a1.5 1.5 0 0 0 0-3h-.996a12.06 12.06 0 0 1-1.752-6.138V18Z" />
  </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    {/* Simplified Sparkles Icon Path for brevity, or use the original one */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.06 12.94a1.5 1.5 0 1 1-2.12-2.12 1.5 1.5 0 0 1 2.12 2.12ZM12 4.522a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75ZM5.478 6.522l1.06-1.06a.75.75 0 0 1 1.062 1.06l-1.06 1.06A.75.75 0 0 1 5.478 6.522ZM18.522 6.522a.75.75 0 0 1-1.06 1.06l-1.06-1.06a.75.75 0 1 1 1.06-1.06l1.06 1.06ZM19.478 13.06a.75.75 0 0 1-1.06-1.062l1.06-1.06a.75.75 0 1 1 1.06 1.06l-1.06 1.06ZM12 17.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 12 17.25ZM6.522 18.522l-1.06 1.06a.75.75 0 1 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 1.06ZM4.522 12a.75.75 0 0 1-.75-.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75Z" />
 </svg>
);

export const AlertTriangleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>
);

export const StarIconFilled: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = "w-5 h-5", style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.116 3.986 1.242 5.493c.269 1.192-.986 2.125-2.056 1.526L12 18.22l-4.994 2.795c-1.07.6-2.325-.334-2.056-1.526l1.242-5.493-4.116-3.986c-.887-.76-.415-2.212.749-2.305l5.404-.434L10.788 3.21Z" clipRule="evenodd" />
  </svg>
);

export const StarIconOutline: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.619.049.863.842.42 1.263l-4.096 3.982a.562.562 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.822.672l-4.908-2.873a.563.563 0 0 0-.626 0l-4.908 2.873a.562.562 0 0 1-.822-.672l1.285-5.385a.562.562 0 0 0-.182-.557l-4.096-3.982c-.443-.421-.199-1.214.42-1.263l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
  </svg>
);