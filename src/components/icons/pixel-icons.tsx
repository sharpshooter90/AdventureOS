import React from "react";

interface PixelIconProps {
  className?: string;
}

export function FolderIcon({ className = "" }: PixelIconProps) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6H12L14 8H28V26H4V6Z"
        fill="#FFCC33"
        stroke="#996600"
        strokeWidth="2"
      />
      <path
        d="M4 8H28V26H4V8Z"
        fill="#FFDD77"
        stroke="#996600"
        strokeWidth="2"
      />
    </svg>
  );
}

export function FileIcon({ className = "" }: PixelIconProps) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 4H19L24 9V28H8V4Z"
        fill="#FFFFFF"
        stroke="#666666"
        strokeWidth="2"
      />
      <path
        d="M19 4L24 9H19V4Z"
        fill="#CCCCCC"
        stroke="#666666"
        strokeWidth="2"
      />
    </svg>
  );
}

export function TextFileIcon({ className = "" }: PixelIconProps) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 4H19L24 9V28H8V4Z"
        fill="#FFFFFF"
        stroke="#666666"
        strokeWidth="2"
      />
      <path
        d="M19 4L24 9H19V4Z"
        fill="#CCCCCC"
        stroke="#666666"
        strokeWidth="2"
      />
      <path
        d="M12 14H20M12 18H20M12 22H16"
        stroke="#666666"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function ImageFileIcon({ className = "" }: PixelIconProps) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 4H19L24 9V28H8V4Z"
        fill="#FFFFFF"
        stroke="#666666"
        strokeWidth="2"
      />
      <path
        d="M19 4L24 9H19V4Z"
        fill="#CCCCCC"
        stroke="#666666"
        strokeWidth="2"
      />
      <path
        d="M12 14L16 18L14 20L10 16L12 14Z"
        fill="#33CC33"
        stroke="#009900"
        strokeWidth="1"
      />
      <circle cx="18" cy="16" r="2" fill="#FFCC33" stroke="#996600" />
    </svg>
  );
}

export function ComputerIcon({ className = "" }: PixelIconProps) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 6H26V22H6V6Z"
        fill="#CCCCCC"
        stroke="#666666"
        strokeWidth="2"
      />
      <path d="M10 10H22V18H10V10Z" fill="#000080" stroke="#0000CC" />
      <path d="M12 22H20V24H12V22Z" fill="#666666" />
      <path d="M10 24H22V26H10V24Z" fill="#333333" />
    </svg>
  );
}

export function RecycleBinIcon({ className = "" }: PixelIconProps) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 8H24V28H8V8Z"
        fill="#CCCCCC"
        stroke="#666666"
        strokeWidth="2"
      />
      <path
        d="M12 4H20V8H12V4Z"
        fill="#666666"
        stroke="#333333"
        strokeWidth="2"
      />
      <path d="M12 12V24M16 12V24M20 12V24" stroke="#666666" strokeWidth="2" />
    </svg>
  );
}
