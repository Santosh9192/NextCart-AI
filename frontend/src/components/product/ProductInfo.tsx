import ProductPrice from "./ProductPrice";
import ProductRating from "./ProductRating";

export default function ProductInfo({ product }: any) {
    const finalPrice =
        product.price - (product.price * product.discount) / 100;

    return (
        <div>
            <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">
                {product.brand}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1">
                {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-4">
                <ProductRating rating={product.average_rating} />
                <span className="text-sm text-gray-400">
                    ({product.total_reviews} reviews)
                </span>
            </div>

            <div className="mt-6">
                <ProductPrice
                    price={product.price}
                    discount={product.discount}
                />
            </div>

            <p className="mt-6 text-gray-600 leading-relaxed">
                {product.description}
            </p>
        </div>
    );
}
