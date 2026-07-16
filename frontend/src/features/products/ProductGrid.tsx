import ProductCard from "./ProductCard";

export default function ProductGrid({

products

}:any){

return(

<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

{

products.map((p:any)=>(

<ProductCard

key={p.id}

product={p}

/>

))

}

</div>

);

}