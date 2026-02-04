// import axios from "axios";
// import { PostResponse } from "../types/posts";
// import { ProductRequest } from "../types/product";

// const BASE_API = process.env.NEXT_PUBLIC_API_URL;
// const baseAPI = process.env.NEXT_PUBLIC_API;

// export async function fetchPosts(){
//   const data = await fetch(`${BASE_API}posts`);
//   const posts:PostResponse[] = await data.json();
//   return posts;
// }
// // get category
// export async function fetchCategory(){
//   const categories = await axios(`${baseAPI}/api/v1/categories/`);
//   return categories;
// }

// // insert product
// export async function insertProduct(product:ProductRequest){
//   const prod = await axios(`${baseAPI}/api/v1/products/`,{
//     method:"POST",
//     headers:{
//       "Accept":"*/*",
//       "Content-Type" : "application/json"
//     },
//     data: JSON.stringify(product)
//   });
//   return prod;
// }

import axios from "axios";
import { ProductRequest } from "../types/product";

const BASE_API = process.env.NEXT_PUBLIC_API;

export async function fetchPosts() {
  const res = await fetch(`${BASE_API}/posts`);
  const posts = await res.json();
  return posts;
}

// ✅ GET CATEGORIES (FIXED)
export async function fetchCategory() {
  const res = await axios.get(`${BASE_API}/api/v1/categories/`);
  return res.data; // <-- IMPORTANT
}

// ✅ INSERT PRODUCT (CLEAN VERSION)
export async function insertProduct(product: ProductRequest) {
  const res = await axios.post(
    `${BASE_API}/api/v1/products/`,
    product,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
}
