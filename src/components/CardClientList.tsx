"use client";

import Link from "next/link";
import { use } from "react";
import { PostResponse } from "@/lib/types/posts";
import PostCard from "./PostCard";

export function CardClientList(
  {fetchPosts}: {fetchPosts: Promise<PostResponse[]>}
){
  // use hook
  const posts = use(fetchPosts);
  console.log(posts);
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {posts.map((post, index) => (
          <Link key={post.id} href={`/dashboard/blog/${post.id}`}>
            <PostCard
              key={index}
              userId={post.userId}
              title={post.title}
              id={post.id}
              body={post.body}
            />
          </Link>
      ))}
    </div>
  );
}
