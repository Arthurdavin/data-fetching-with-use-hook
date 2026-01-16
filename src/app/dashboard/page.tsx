import Link from "next/link";

import { fetchPosts } from "@/lib/data/fetchPost";
import PostCard from "@/components/PostCard";

export default async function DashBoardPage(){
  const posts = await fetchPosts();
  return(
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {posts.map((post)=>(
        <div key={post.id}>
          <Link href={`/dashboard/blog/${post.id}`}>
            <PostCard
            key={post.id}
            userId={post.userId}
            title={post.title}
            id={post.id}
            body={post.body}
            />
          </Link>
        </div>
      ))}
    </div>
  )
}