export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="MedTriage logo"
    >
      <path
        d="M16 2L28.7 9.5V24.5L16 32L3.3 24.5V9.5L16 2Z"
        fill="var(--primary)"
      />
      <path
        d="M16 9v14M9 16h14"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}