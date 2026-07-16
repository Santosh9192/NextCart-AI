import api from "@/api/axios";

export const getCart = async () => {

    const response = await api.get("/cart/");

    return response.data;

};

export const addToCart = async (

    productId:number,

    quantity:number

)=>{

    const response=await api.post(

        "/cart/add",

        {

            product_id:productId,

            quantity

        }

    );

    return response.data;

};

export const updateCart = async(

productId:number,

quantity:number

)=>{

const response=await api.put(

`/cart/${productId}`,

{

quantity

}

);

return response.data;

};

export const removeCartItem=async(

productId:number

)=>{

const response=await api.delete(

`/cart/${productId}`

);

return response.data;

};

export const clearCart=async()=>{

const response=await api.delete(

"/cart/"

);

return response.data;

};