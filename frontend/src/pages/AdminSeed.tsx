import { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { seedProducts, getProductsWithImages, clearProducts } from '@/lib/seedDatabase';

export default function AdminSeed() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [products, setProducts] = useState<any[]>([]);

  const handleClearAndReseed = async () => {
    if (!window.confirm('⚠️ This will delete all existing products and images. Are you sure?')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('Clearing database...');

      // Clear existing data
      await clearProducts();
      setMessage('Cleared database. Seeding products...');

      // Seed products
      const seededProducts = await seedProducts();
      
      setMessage(
        `✅ Successfully seeded ${seededProducts.length} products with images to database!`
      );

      // Fetch and display products
      const allProducts = await getProductsWithImages();
      setProducts(allProducts);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('Seeding products...');

      // Seed products (includes images)
      const seededProducts = await seedProducts();
      
      if (seededProducts.length === 0) {
        setMessage('ℹ️ Products already exist in database. Use "Clear & Reseed" to replace them.');
      } else {
        setMessage(
          `✅ Successfully seeded ${seededProducts.length} products with images to database!`
        );
      }

      // Fetch and display products
      const allProducts = await getProductsWithImages();
      setProducts(allProducts);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('⏳ Fetching products...');
      
      console.log('Starting to fetch products...');
      const allProducts = await getProductsWithImages();
      console.log('Products fetched:', allProducts);
      
      setProducts(allProducts);
      setMessage(`✅ Fetched ${allProducts.length} products from database`);
    } catch (err) {
      console.error('Error fetching products:', err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error fetching products: ${errorMsg}`);
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header cartItemCount={0} />

      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">🌱 Database Seeding</h1>

        <div className="space-y-6">
          {/* Seed Button */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-xl font-semibold mb-4">Initialize Products</h2>
            <p className="text-gray-600 mb-4">
              This will create 15 handcrafted jewelry products in your database with images from Supabase Storage.
            </p>
            <Button
              onClick={handleSeed}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? '⏳ Seeding...' : '🌱 Seed Database'}
            </Button>
          </div>

          {/* Clear & Reseed Button */}
          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
            <h2 className="text-xl font-semibold mb-4">Clear & Reseed</h2>
            <p className="text-gray-600 mb-4">
              Delete all existing products and reseed the database with fresh data. Use this if you want to start over.
            </p>
            <Button
              onClick={handleClearAndReseed}
              disabled={loading}
              variant="destructive"
            >
              {loading ? '⏳ Processing...' : '🔄 Clear & Reseed'}
            </Button>
          </div>

          {/* Fetch Button */}
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h2 className="text-xl font-semibold mb-4">View Products</h2>
            <p className="text-gray-600 mb-4">
              Fetch all products from the database to see what's been created.
            </p>
            <Button
              onClick={handleFetchProducts}
              disabled={loading}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              {loading ? '⏳ Fetching...' : '📦 View Products'}
            </Button>
          </div>

          {/* Messages */}
          {message && (
            <Alert className="border-blue-300 bg-blue-50">
              <AlertDescription className="text-blue-800">{message}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="border-red-300 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {/* Products Display */}
          {products.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Products in Database ({products.length})</h2>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="bg-white p-4 rounded border border-gray-200">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-gray-600 text-sm">{product.sku}</p>
                    <p className="text-lg font-bold text-blue-600 mt-2">
                      ${product.base_price.toFixed(2)}
                    </p>
                    {product.material && (
                      <p className="text-sm text-gray-500">Material: {product.material}</p>
                    )}
                    {product.product_images && product.product_images.length > 0 && (
                      <div className="mt-3 flex gap-2">
                        {product.product_images.map((img: any) => (
                          <img
                            key={img.id}
                            src={img.image_url}
                            alt={img.alt_text}
                            className="w-16 h-16 rounded object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
