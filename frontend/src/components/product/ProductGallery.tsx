import API_BASE_URL from "@/constants/api";

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
                        ? `${API_BASE_URL}/${image}`
                        : "https://placehold.co/700x700?text=Product"
                }
                alt={name}
                className="w-full aspect-square object-cover"
            />
        </div>
    );
}
