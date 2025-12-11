import { HTMLAttributes } from "react";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  fallback?: string;
}

export function Avatar({
  src,
  alt = "Avatar",
  size = "md",
  fallback,
  className = "",
  ...props
}: AvatarProps) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const baseStyles =
    "rounded-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold";

  if (src) {
    return (
      <div className={`${sizes[size]} ${className}`} {...props}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full rounded-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`${baseStyles} ${sizes[size]} ${className}`} {...props}>
      {fallback || alt.charAt(0).toUpperCase()}
    </div>
  );
}
