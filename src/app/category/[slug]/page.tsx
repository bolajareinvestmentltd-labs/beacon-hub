import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  // Validate slug against allowed categories
  const validCategories = ['real-estate', 'entertainment', 'sports'];
  if (!validCategories.includes(slug)) {
    notFound();
  }

  // Format slug to display name
  const categoryName = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{categoryName}</h1>

      {/* Placeholder: Wire up GNews API later */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <p className="text-gray-500">Content coming soon...</p>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categoryName = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${categoryName} | Beacon Hub`,
    description: `Explore ${categoryName} content on Beacon Hub`,
  };
}
