import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { cmsApi } from "@/lib/cms";

const BlogIndex = () => {
  const postsQuery = useQuery({
    queryKey: ["public", "posts"],
    queryFn: cmsApi.getPublicPosts,
  });

  return (
    <div className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Blog</p>
        <h1 className="font-display text-5xl mb-4">Latest Insights</h1>
        <p className="text-muted-foreground mb-10">Published updates and thought leadership posts.</p>

        <div className="grid md:grid-cols-2 gap-5">
          {postsQuery.data?.items.map((post) => (
            <article key={post.id} className="border border-border bg-card/60 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">{post.status}</p>
              <h2 className="font-display text-2xl mb-2">{post.title}</h2>
              <p className="text-muted-foreground text-sm mb-4">{post.excerpt}</p>
              <Link to={`/blog/${post.slug}`} className="text-primary text-sm underline">
                Read post
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogIndex;
