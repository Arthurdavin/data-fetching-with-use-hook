
import PostCard from "@/components/PostCard";
import { PostResponse } from "@/lib/types/posts";

async function fetchDetailPost(id: string) {
  const BASE_API = process.env.NEXT_PUBLIC_API_URL;
  // if (!BASE_API) throw new Error("NEXT_PUBLIC_API_URL is not defined");
  const res = await fetch(`${BASE_API}posts/${id}`);
  // if (!res.ok) throw new Error("Failed to fetch post detail");
  const post: PostResponse = await res.json();
  return post;
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const post = await fetchDetailPost(slug);
  console.log(post);
  return (
    <div className="p-6">
      <PostCard 
      id={post.id} 
      userId={post.userId} 
      title={post.title} />
    </div>
  );
}
