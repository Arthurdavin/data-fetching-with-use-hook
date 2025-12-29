import Link from "next/link";
import { fetchPost } from "@/lib/data/fetchPost";
import Cards from "@/components/Card";

export default async function DashBoardPage() {
  
  const posts = await fetchPost();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts.map((post)=>(
        <div key={post.id}>
          <Link href={`/dashboard/blog/${post.id}`}>
            <Cards
            key={post.id}
            userId={post.userId}
            title={post.title}
            id={post.id}
            body="defaul title"
            />
          </Link>
        </div>
      ))}
    </div>
  );
}