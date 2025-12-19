import Link from "next/link";
import PostCard from "@/components/PostCard";
import { PostRespon } from "../lib/post";

async function fetchPost() {
//   const BASE_API = process.env.NEXT_PUBLIC_API_URL;
    const BASE_API = process.env.NEXT_PUBLIC_API_URL
  const data = await fetch(`${BASE_API}posts`);
  const posts: PostRespon[] = await data.json();
  return posts;
}

export default async function DashBoardPage() {
  const posts = await fetchPost();

  return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id}>
          <Link href={`/dashboard/blog/${post.id}`}>
            <PostCard
              userId={post.userId}
              title={post.title}
              id={post.id}
            />
          </Link>
          </div>
        ))}
      </div>
  );
}
