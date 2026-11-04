import Link from 'next/link';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-xs text-[#6e6b7c]">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="font-semibold hover:text-[#d92867]">
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            <span aria-hidden="true">»</span>
            {item.href ? (
              <Link href={item.href} className="font-semibold hover:text-[#d92867]">
                {item.label}
              </Link>
            ) : (
              <span aria-current={index === items.length - 1 ? 'page' : undefined}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
