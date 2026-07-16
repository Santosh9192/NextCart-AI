interface Props {
    price: number;
    discount: number;
}

export default function ProductPrice({ price, discount }: Props) {
    const finalPrice = price - (price * discount) / 100;

    return (
        <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
                ₹{finalPrice.toFixed(0)}
            </span>
            {discount > 0 && (
                <>
                    <span className="text-sm text-gray-400 line-through">
                        ₹{price.toFixed(0)}
                    </span>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                        {discount}% off
                    </span>
                </>
            )}
        </div>
    );
}
