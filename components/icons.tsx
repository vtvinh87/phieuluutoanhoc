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
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.619.049.863.842.42 1.263l-4.096 3.982a.562.562 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.822.672l-4.908-2.873a.563.563 0 0 0-.626 0l-4.908 2.873a.562.562 0 0 1-.822-.672l1.285-5.385a.562.562 0 0 0-.182.557l-4.096-3.982c-.443-.421-.199-1.214.42-1.263l5.518-.442a.563.563 0 0 0 .475.345L11.48 3.5Z" />
  </svg>
);

export const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 12a2.25 2.25 0 0 0-2.25 2.25m4.5 0a2.25 2.25 0 0 1-2.25 2.25M12 12a2.25 2.25 0 0 0 2.25-2.25m-4.5 0a2.25 2.25 0 0 1 2.25-2.25" />
  </svg>
);

export const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
  </svg>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

export const HeartIconFilled: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.218l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
  </svg>
);

export const HeartIconBroken: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25c-1.5 0-2.25.75-2.25 2.25s.75 2.25 2.25 2.25c1.5 0 2.25-.75 2.25-2.25S13.5 8.25 12 8.25ZM12.75 11.25H11.25V9.75h1.5v1.5Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a8.25 8.25 0 0 0 6.096-2.706.75.75 0 0 0-.256-1.048l-.042-.025a13.498 13.498 0 0 0-3.175-1.579 8.358 8.358 0 0 1-3.242-.352.75.75 0 0 0-.61.168A8.192 8.192 0 0 0 8.25 15c0 .101.006.2.018.298a8.286 8.286 0 0 0 3.732 5.702Zm0 0c-.23.18-.475.352-.724.516a8.98 8.98 0 0 1-1.396.818c-1.202.628-2.618.96-4.088.96A8.25 8.25 0 0 1 3 12.75c0-1.89.626-3.626 1.705-4.992.837-1.091 2.003-2.022 3.328-2.672a13.498 13.498 0 0 1 3.962-1.332A8.25 8.25 0 0 1 12 3a8.25 8.25 0 0 1 4.096 1.05.75.75 0 0 0 .256 1.048l.042.025a13.498 13.498 0 0 0 3.175 1.579 8.358 8.358 0 0 1 3.242.352.75.75 0 0 0 .61-.168A8.192 8.192 0 0 0 15.75 9c0-.101-.006-.2-.018-.298A8.286 8.286 0 0 0 12 2.998Z" />
  </svg>
);

export const TrophyIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-4.5A3.375 3.375 0 0 0 12.75 9.75H11.25A3.375 3.375 0 0 0 7.5 13.125V18.75m9 0h1.5M4.5 18.75H3M12 12.75a.75.75 0 0 0 .75-.75V6.375c0-.621-.504-1.125-1.125-1.125H12a1.125 1.125 0 0 0-1.125 1.125v5.625c0 .414.336.75.75.75Zm0 0h.01M12 3.375a2.25 2.25 0 0 0-2.25 2.25c0 .06.002.119.006.177H8.25a.75.75 0 0 0-.75.75V10.5a.75.75 0 0 0 .75.75h.536c.004.058.006.117.006.177a2.25 2.25 0 1 0 4.5 0c0-.06-.002-.119-.006-.177H15a.75.75 0 0 0 .75-.75V8.25a.75.75 0 0 0-.75-.75h-.536A2.25 2.25 0 0 0 12 3.375Z" />
  </svg>
);

export const LockClosedIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
  </svg>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

export const CollectionIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);


export const AcademicCapIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path d="M12 14.25L5.25 9.75M12 14.25L18.75 9.75M12 14.25V21M12 3.75L4.5 8.25M12 3.75L19.5 8.25M4.5 8.25V15.75L12 21L19.5 15.75V8.25L12 3.75Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.125 9.375L3 10.125M21 10.125L19.875 9.375M12 21V14.25" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75L4.5 8.25v7.5L12 21l7.5-5.25v-7.5L12 3.75z" />
 </svg>
);

export const TreasureChestIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.507 4.208C12.194 4.072 11.806 4.072 11.493 4.208L3.018 7.875C2.378 8.143 2.25 8.974 2.715 9.542L4.018 11.25H20.007L21.285 9.542C21.75 8.974 21.622 8.143 20.982 7.875L12.507 4.208Z" />
    <path fillRule="evenodd" d="M2.25 12.75V18A.75.75 0 0 0 3 18.75h18A.75.75 0 0 0 21.75 18v-5.25H2.25ZM12 14.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);

export const GiftIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.75 2.25a.75.75 0 0 0-1.5 0v1.5h-2.25V2.25a.75.75 0 0 0-1.5 0V3.75A2.25 2.25 0 0 0 5.25 6H3.75a.75.75 0 0 0 0 1.5H12v8.25H3.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H12V7.5h8.25a.75.75 0 0 0 0-1.5H14.25A2.25 2.25 0 0 0 12 3.75V2.25ZM9.75 17.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM11.25 6a.75.75 0 0 0-.75.75v3.75a.75.75 0 0 0 1.5 0V6.75a.75.75 0 0 0-.75-.75Z" />
    <path fillRule="evenodd" d="M5.25 6H11.25V3.75A2.25 2.25 0 0 0 9 2.115V2.25a.75.75 0 0 1-1.5 0v-.363A2.25 2.25 0 0 0 5.25 3.75V6ZM14.25 6V3.75A2.25 2.25 0 0 0 12 2.115V2.25a.75.75 0 0 1-1.5 0v-.363A2.25 2.25 0 0 0 8.25 3.75V6h6Z" clipRule="evenodd" />
  </svg>
);
