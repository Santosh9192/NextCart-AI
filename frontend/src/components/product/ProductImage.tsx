import { getImageUrl } from "@/constants/api";

interface Props {
    image?: string;
    name: string;
}

export default function ProductImage({ image, name }: Props) {
    return (
        <img
            src={
                getImageUrl(image) || "https://placehold.co/600x600?text=No+Image"
            }
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
    );
}
