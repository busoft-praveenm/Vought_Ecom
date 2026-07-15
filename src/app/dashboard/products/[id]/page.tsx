import React from "react";
import { cookies } from "next/headers";
import { Star, ShoppingCart, ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/button";
import { addToCart } from "@/app/actions/cart";

type ProductDetails = {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    status: string;
    imageUrl?: string;
    averageRating?: number;
    currency?: string;
    description?: string;
  };
  reviews: Array<{
    id: number;
    rating: number;
    reviewText: string;
    createdAt: string;
    user: {
      id: number;
      name: string;
      email?: string;
    }
  }>;
};

import { ReviewForm } from "@/components/review-form";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/products/${id}`, {
    headers: {
      ...(token ? { "Cookie": `access_token=${token}` } : {})
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    return (
      <div className="p-8 text-center text-red-400">
        <h2 className="text-2xl font-bold">Failed to load product details</h2>
        <Link href="/dashboard/products" className="text-primary hover:underline mt-4 inline-block">
          Return to Products
        </Link>
      </div>
    );
  }

  const data: ProductDetails = await res.json();
  const { product, reviews } = data;

  const currencySymbol = product.currency === 'INR' ? '₹' : '$';

  let hasReviewed = false;
  if (token) {
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedJson = Buffer.from(payloadBase64, 'base64').toString('utf-8');
      const payload = JSON.parse(decodedJson);
      if (payload.email) {
        hasReviewed = reviews.some(r => r.user?.email === payload.email);
      }
    } catch (e) {
      console.error("Failed to decode token", e);
    }
  }

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
      <Link href="/dashboard/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-card border border-border/50 rounded-xl p-6 mb-10 shadow-sm">
        {/* Product Image */}
        <div className="relative aspect-square w-full bg-muted/30 rounded-lg overflow-hidden flex items-center justify-center">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full" />
          ) : (
            <Package className="w-24 h-24 text-muted-foreground/30" />
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">{product.category}</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(product.averageRating || 0)
                      ? "fill-orange-400 text-orange-400"
                      : "fill-muted text-muted"
                    }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground font-medium ml-2">
              {product.averageRating ? Number(product.averageRating).toFixed(1) : "0.0"} out of 5
            </span>
          </div>

          <div className="mb-8">
            <span className="text-4xl font-extrabold text-foreground">
              {currencySymbol}{Number(product.price).toFixed(2)}
            </span>
            <p className="text-sm text-muted-foreground mt-2">
              Availability: <span className={product.stock > 0 ? "text-green-500 font-medium" : "text-destructive font-medium"}>{product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}</span>
            </p>
          </div>

          <p className="text-muted-foreground mb-10 leading-relaxed">
            {product.description || "No description available for this product."}
          </p>

          <div className="mt-auto pt-4 border-t border-border/50">
            <form action={addToCart.bind(null, Number(product.id), 1)}>
              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto px-8"
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </form>
          </div>
        </div>
      </div>

    {/* Reviews Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        {reviews && reviews.length > 0 ? (
          <div className="space-y-4 mb-8">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 bg-card border border-border/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                      {review.user?.email
                        ? `${review.user.email}`.trim()
                        : "Anonymous"}
                    </span>
                    <span className="text-xs text-muted-foreground">• {new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < review.rating ? "fill-orange-400 text-orange-400" : "fill-muted text-muted"
                          }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.reviewText}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground mb-8">No reviews yet. Be the first to review this product!</p>
        )}

        {token && !hasReviewed ? (
          <ReviewForm productId={Number(product.id)} />
        ) : token && hasReviewed ? (
          <div className="mt-8 p-4 bg-muted/30 border border-border/50 rounded-lg text-center">
            <p className="text-muted-foreground">You have already reviewed this product. Thank you for your feedback!</p>
          </div>
        ) : (
          <div className="mt-8 p-4 bg-muted/30 border border-border/50 rounded-lg text-center">
            <p className="text-muted-foreground">Please log in to leave a review.</p>
          </div>
        )}
      </div>
    </div>
  );
}
