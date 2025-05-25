import axiosClient from "./axiosClient.ts";

export async function getLoggedInUser(){
    const response = await axiosClient.get('/user');
    return response.data;
}

