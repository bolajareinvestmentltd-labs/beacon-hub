import QuoteCard from "@/components/QuoteCard";

export default function DevLogPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-white mb-4">The Developer's Journal</h1>
      
      <QuoteCard 
        quote="First, solve the problem. Then, write the code." 
        author="John Johnson" 
        role="Software Engineer"
      />
      
      <QuoteCard 
        quote="Consistency is the architecture of success. Small daily commits build massive systems." 
        author="Senior Architect" 
        role="Founder, AySmart Ecosystem"
      />
    </div>
  );
}
