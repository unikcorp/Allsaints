import React from "react";

interface FacilityIconProps {
  id?: number;
  name?: string;
  className?: string;
}

export default function FacilityIcon({ id, name, className = "w-6 h-6" }: FacilityIconProps) {
  // Normalize based on ID or Name
  const normalized = (name || "").toLowerCase();

  // 1. Smart Classrooms
  if (id === 1 || normalized.includes("smart") || normalized.includes("classroom")) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="13" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 16v5" />
        <path d="M7 8l3 3 4-4 3 3" />
        <circle cx="17" cy="7" r="0.8" fill="currentColor" />
      </svg>
    );
  }

  // 2. Science Laboratories
  if (id === 2 || normalized.includes("science") || normalized.includes("laborator")) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 18h8" />
        <path d="M3 21h14" />
        <path d="M9 3v4" />
        <path d="M10 7a4 4 0 0 1 4 4v3" />
        <path d="M13 14l3.5-3.5a2.12 2.12 0 1 0-3-3L10 11" />
        <circle cx="6" cy="14" r="1.5" />
        <path d="M19 19a2 2 0 0 1-2 2h-1" />
      </svg>
    );
  }

  // 3. Computer & Language Lab
  if (id === 3 || normalized.includes("computer") || normalized.includes("language")) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M2 19h20" />
        <path d="M9 16v3" />
        <path d="M15 16v3" />
        <path d="M8 9l2 2-2 2" />
        <path d="M12 13h4" />
      </svg>
    );
  }

  // 4. Resourceful Library
  if (id === 4 || normalized.includes("library") || normalized.includes("book")) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="8" y1="10" x2="14" y2="10" />
      </svg>
    );
  }

  // 5. Auditorium & Staff Rooms
  if (id === 5 || normalized.includes("auditorium") || normalized.includes("staff")) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 21h18" />
        <path d="M5 21V10" />
        <path d="M19 21V10" />
        <path d="M9 21V10" />
        <path d="M14 21V10" />
        <path d="M2 10l10-7 10 7H2z" />
        <circle cx="12" cy="7" r="1" fill="currentColor" />
      </svg>
    );
  }

  // 6. Vast Sports Grounds
  if (id === 6 || normalized.includes("sport") || normalized.includes("ground")) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a9 9 0 0 1 7.8 4.5L14 9.5l-2-2.5-2 2.5L4.2 7.5A9 9 0 0 1 12 3z" />
        <path d="M12 21a9 9 0 0 1-7.8-4.5L10 14.5l2 2.5 2-2.5 5.8 2A9 9 0 0 1 12 21z" />
        <path d="M3 12a9 9 0 0 1 1.2-4.5L8.5 10v4l-4.3 2.5A9 9 0 0 1 3 12z" />
        <path d="M21 12a9 9 0 0 1-1.2 4.5L15.5 14v-4l4.3-2.5A9 9 0 0 1 21 12z" />
      </svg>
    );
  }

  // 7. Clean Amenities & Pure Water
  if (id === 7 || normalized.includes("water") || normalized.includes("amenities")) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        <path d="M12 12a3 3 0 0 0 3 3" />
      </svg>
    );
  }

  // 8. Safety & CCTV Surveillance
  if (id === 8 || normalized.includes("safety") || normalized.includes("cctv") || normalized.includes("surveillance")) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    );
  }

  // 9. Eco-Friendly & Green Farm Campus
  if (id === 9 || normalized.includes("eco") || normalized.includes("green") || normalized.includes("farm")) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 20A7 7 0 0 1 4 13C4 7 11 3 11 3s7 4 7 10a7 7 0 0 1-7 7z" />
        <path d="M11 20v-9" />
        <path d="M11 15c2.5-1 4-3 4-5" />
      </svg>
    );
  }

  // Fallback
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}
