"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/button";
import { addReview } from "@/app/actions/review";
import { useRouter } from "next/navigation";

export function ReviewForm({ productId }: { productId: number }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    try {
      await addReview(productId, rating, reviewText);
      setRating(0);
      setReviewText("");
      router.refresh();
    } catch (err) {
      setError("Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 p-6 bg-card border border-border/50 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm transition-transform hover:scale-110"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  star <= (hoverRating || rating)
                    ? "fill-orange-400 text-orange-400"
                    : "fill-muted text-muted"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="reviewText" className="block text-sm font-medium mb-2">
          Review
        </label>
        <textarea
          id="reviewText"
          rows={4}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="What did you like or dislike?"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          required
        ></textarea>
      </div>

      <Button type="submit" disabled={isSubmitting || rating === 0}>
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
