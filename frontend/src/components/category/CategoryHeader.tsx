interface CategoryHeaderProps {
  title: string;
  description: string;
}

export function CategoryHeader({ title, description }: CategoryHeaderProps) {
  return (
    <div className="bg-muted/30 py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 
          className="font-serif text-4xl md:text-5xl font-bold mb-4"
          data-testid="text-category-title"
        >
          {title}
        </h1>
        <p 
          className="text-muted-foreground max-w-2xl mx-auto"
          data-testid="text-category-description"
        >
          {description}
        </p>
      </div>
    </div>
  );
}
