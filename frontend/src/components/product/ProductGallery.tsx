interface Props {
    image: string;
    name: string;
}

export default function ProductGallery({ image, name }: Props) {
    return (
        <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
            <img
                src={
                    image
                        ? `http://127.0.0.1:8000/${image}`
                        : "https://placehold.co/700x700?text=Product"
                }
                alt={name}
                className="w-full aspect-square object-cover"
            />
        </div>
    );
}
