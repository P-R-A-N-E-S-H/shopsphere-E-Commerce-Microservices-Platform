'use client';

import React, { useState } from 'react';
import { X, Star, ThumbsUp, CheckCircle, MessageSquarePlus, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ReviewsModal({ product, isOpen, onClose }) {
  const { user } = useAuth();
  const { showToast } = useCart();

  const [reviews, setReviews] = useState([
    {
      id: 'rev-1',
      author: 'David Chen',
      rating: 5,
      date: '2 days ago',
      verified: true,
      comment: 'Blown away by the build quality and performance. Shipped super fast in 2 days and the packaging was pristine. Highly recommend!',
      likes: 18
    },
    {
      id: 'rev-2',
      author: 'Sophia Martinez',
      rating: 5,
      date: '1 week ago',
      verified: true,
      comment: 'Exceeded all my expectations. The sound signature is rich and the noise cancellation blocks out all office chatter.',
      likes: 12
    },
    {
      id: 'rev-3',
      author: 'Liam Walker',
      rating: 4,
      date: '2 weeks ago',
      verified: true,
      comment: 'Solid purchase. Great battery life and very comfortable to wear during long sessions. Worth every penny.',
      likes: 5
    }
  ]);

  const [newRating, setNewRating] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !product) return null;

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    const newRev = {
      id: 'rev-' + Date.now(),
      author: user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Verified Customer',
      rating: newRating,
      date: 'Just now',
      verified: true,
      comment: commentText.trim(),
      likes: 0
    };

    setReviews([newRev, ...reviews]);
    setCommentText('');
    setIsSubmitting(false);
    showToast('Your verified review was published to Review Microservice!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto backdrop-blur-md bg-slate-950/80 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div>
            <h3 className="font-bold text-slate-100 text-base sm:text-lg">Customer Reviews & Ratings</h3>
            <p className="text-xs text-slate-400 mt-0.5">{product.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Rating Summary Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 items-center">
            <div className="text-center sm:border-r sm:border-slate-800 sm:pr-4">
              <span className="text-4xl font-black text-slate-100">{product.rating}</span>
              <div className="flex justify-center text-amber-400 my-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs text-slate-400">{reviews.length} Verified Reviews</span>
            </div>

            <div className="col-span-2 space-y-1.5 text-xs text-slate-400">
              {[
                { stars: 5, pct: '85%' },
                { stars: 4, pct: '12%' },
                { stars: 3, pct: '3%' },
                { stars: 2, pct: '0%' },
                { stars: 1, pct: '0%' }
              ].map((r) => (
                <div key={r.stars} className="flex items-center gap-2">
                  <span className="w-10 font-medium">{r.stars} star</span>
                  <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: r.pct }} />
                  </div>
                  <span className="w-8 text-right font-mono text-[11px] text-slate-500">{r.pct}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Write a Review Form */}
          <form onSubmit={handleSubmitReview} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <MessageSquarePlus className="w-4 h-4 text-indigo-400" />
              <span>Write a Verified Customer Review</span>
            </h4>

            {/* Interactive Star rating */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Your Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewRating(star)}
                    className={`p-1 transition ${
                      star <= newRating ? 'text-amber-400' : 'text-slate-700 hover:text-amber-400/60'
                    }`}
                  >
                    <Star className={`w-5 h-5 ${star <= newRating ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              required
              placeholder="Share details about the product quality, shipping speed, and real-world performance..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-750 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !commentText.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md disabled:opacity-50 transition"
              >
                Post Review
              </button>
            </div>
          </form>

          {/* Review items list */}
          <div className="space-y-4 divide-y divide-slate-800/60">
            {reviews.map((rev) => (
              <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 text-xs">{rev.author}</span>
                    {rev.verified && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full font-medium">
                        <UserCheck className="w-3 h-3" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500">{rev.date}</span>
                </div>

                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
