import Link from "next/link";

interface CardProps {
  eyebrow?: string;
  title: string;
  description: string;
  href: string;
  date?: string;
  className?: string;
}

export function Card({
  eyebrow,
  title,
  description,
  href,
  date,
  className = "",
}: CardProps) {
  return (
    <Link
      href={href}
      className={`group flex flex-col justify-between bg-white border border-border-subtle rounded-2xl p-8 lg:p-10 transition-all duration-500 hover:border-terracotta/30 hover:shadow-[0_8px_30px_rgba(25,25,24,0.04)] hover:-translate-y-1 ${className}`}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-6">
          {eyebrow && (
            <span className="font-ui text-[11px] uppercase tracking-[0.15em] font-semibold text-terracotta">
              {eyebrow}
            </span>
          )}
          {date && (
            <span className="font-ui text-[13px] text-text-muted">
              {date}
            </span>
          )}
        </div>
        <h3 className="font-display text-2xl lg:text-[28px] leading-[1.2] text-charcoal mb-4 group-hover:text-terracotta transition-colors duration-300">
          {title}
        </h3>
        <p className="font-body text-[17px] text-text-secondary leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      <div className="mt-12 flex items-center gap-2 font-ui text-[14px] font-medium text-charcoal group-hover:text-terracotta transition-colors duration-300">
        Read more
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transform transition-transform duration-300 group-hover:translate-x-1"
        >
          <path
            d="M1 7H13M13 7L7 1M13 7L7 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
}
