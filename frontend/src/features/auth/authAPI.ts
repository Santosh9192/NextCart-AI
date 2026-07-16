import api from "@/api/axios";

export const loginUser = async (

    email: string,

    password: string

) => {

    const response = await api.post(

        "/auth/login",

        {

            email,

            password

        }

    );

    return response.data;

};


export const registerUser = async (

    data: any

) => {

    const response = await api.post(

        "/auth/register",

        data

    );

    return response.data;

};