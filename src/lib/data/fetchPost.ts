import { PostResponse } from "../types/posts";

// const BASE_API = process.env.NEXT_PUBLIC_API_URL;
// export async function fetchPosts(){
//   const data = await fetch(`${BASE_API}posts`);
//   const posts:PostResponse[] = await data.json();
//   return posts;
// }

const BASE_API = process.env.NEXT_PUBLIC_API_URL;
export async function fetchPosts(){
  const data = await fetch(`${BASE_API}posts`);
  const posts:PostResponse[] = await data.json();
  return posts;
}