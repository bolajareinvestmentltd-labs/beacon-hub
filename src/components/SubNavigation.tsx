import Link from "next/link";

export default function SubNavigation() {
  // These act as our dynamic high-traffic micro-tags
  const tags = [
    { name: "📈 Trending", href: "#", isActive: true },
    { name: "2027 Elections", href: "#", isActive: false },
    { name: "Market Yields", href: "#", isActive: false },
    { name: "Aries Season", href: "#", isActive: false },
    { name: "Tech Layoffs", href: "#", isActive: false },
    { name: "Kwara Politics", href: "#", isActive: false },
    { name: "Real Estate", href: "#", isActive: false },
    { name: "Crypto Update", href: "#", isActive: false },
    { name: "Startup Funding", href: "#", isActive: false },
  ];

  return (
    <div className="w-full border-b border-slate-200 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Scrollable Container with Hidden Scrollbar */}
        <div className="flex items-center gap-3 py-3 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {tags.map((tag, index) => (
            <Link
              key={index}
              href={tag.href}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                tag.isActive
                  ? "bg-[#0A1128] text-[#FAFAFA] shadow-md border border-[#0A1128]"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-[#0A1128] hover:text-[#0A1128]"
              }`}
            >
              {tag.name}
            </Link>
          ))}

        </div>
      </div>
    </div>
  );
}
