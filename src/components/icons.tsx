import type { SVGProps } from "react";

export function SwastikIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3v18M3 12h18" />
      <path d="M3 3h9v9" />
      <path d="M21 3h-9v9" />
      <path d="M3 21h9v-9" />
      <path d="M21 21h-9v-9" />
    </svg>
  );
}

export function KalashIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M6 14C6 11.2386 8.23858 9 11 9H13C15.7614 9 18 11.2386 18 14V15H6V14Z" />
            <path d="M8 17H16V19H8V17Z" />
            <path d="M5 21H19V20H5V21Z" />
            <path d="M10 6L12 2L14 6H10Z" />
            <path d="M8 8L6 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M16 8L18 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

export function DiyaIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M12 2C12 2 4 10 4 14C4 18.4183 7.58172 22 12 22C16.4183 22 20 18.4183 20 14C20 10 12 2 12 2ZM12 5.5C13.9 8.5 16.5 11.5 17.8 13.5C17.9284 13.722 18 13.9622 18 14.2092V14.2092C18 16.273 16.273 18 14.2092 18H9.79079C7.72704 18 6 16.273 6 14.2092C6 13.9622 6.07159 13.722 6.2 13.5C7.5 11.5 10.1 8.5 12 5.5Z" />
        </svg>
    );
}
