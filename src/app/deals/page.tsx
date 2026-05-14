import Link from "next/link";
import { ShieldCheck, ArrowUpRight } from "lucide-react";

export default function DealsPage() {
  // Architect Note: These are our premium frontend placeholders. 
  // We will replace these with real database items later.
  const assets = [
    {
      id: "123", // This matches the Escrow detail page we built
      title: "Lekki Phase 1 - 4 Bedroom Duplex (Off-Plan)",
      vendor: "Ay'Smart Realtors",
      price: 150000000,
      category: "Real Estate",
      imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: "124",
      title: "Henna By Kawthar - Platinum Bridal Suite",
      vendor: "Apaokagi Kawthar",
      price: 250000,
      category: "VIP Services",
      imageUrl: "https://images.unsplash.com/photo-1590408544866-e88102377bce?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: "125",
      title: "JCLs Digital Distribution & Audiomack Verification",
      vendor: "JCLs Intelligence",
      price: 150000,
      category: "Digital Assets",
      imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200&auto=format&fit=crop"
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black font-playfair text-black dark:text-[#F9F6F0] mb-4">
            The Escrow Network.
          </h1>
          <p className="text-slate-500 max-w-xl text-sm leading-relaxed">
            Exclusive assets and high-ticket services. All transactions are secured by the JCLs flat-fee escrow protocol, ensuring absolute trust between vendor and buyer.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[#E2725B] bg-[#E2725B]/10 px-4 py-2 rounded-md">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest">JCLs Vault Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {assets.map((asset) => (
          <Link href={`/deals/${asset.id}`} key={asset.id} className="group flex flex-col">
            <div className="w-full aspect-[4/3] bg-slate-200 dark:bg-[#1C1C1E] rounded-xl overflow-hidden relative mb-4">
              <img 
                src={asset.imageUrl} 
                alt={asset.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
              />
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight size={18} />
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-[#E2725B] uppercase tracking-wider">{asset.category}</span>
              <span className="text-lg font-black text-black dark:text-white font-playfair">₦{asset.price.toLocaleString()}</span>
            </div>
            
            <h3 className="text-lg font-bold text-black dark:text-[#F9F6F0] leading-snug mb-1 group-hover:text-[#E2725B] transition-colors">
              {asset.title}
            </h3>
            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">
              Vendor: {asset.vendor}
            </p>
          </Link>
        ))}
      </div>

    </div>
  );
}