import { Star } from "lucide-react";

interface Props {
    rating: number;
}

export default function ProductRating({ rating }: Props) {
    return (
        <div className="flex items-center gap-1.5">
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={14}
                        className={
                            star <= Math.round(rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                        }
                    />
                ))}
            </div>
            <span className="text-sm text-gray-500">
                {rating.toFixed(1)}
            </span>
        </div>
    );
}
