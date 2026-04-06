interface InstagramFeedProps {
  images: string[];
}

export default function InstagramFeed({ images }: InstagramFeedProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 
            className="font-serif text-3xl md:text-4xl font-bold mb-2"
            data-testid="text-instagram-title"
          >
            Handmade with Love
          </h2>
          <p className="text-muted-foreground">Follow us @meyaarjewellers</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <div
              key={index}
              className="aspect-square overflow-hidden hover-elevate cursor-pointer rounded-md"
              onClick={() => console.log(`Instagram image ${index + 1} clicked`)}
              data-testid={`img-instagram-${index}`}
            >
              <img
                src={image}
                alt={`Instagram post ${index + 1}`}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
