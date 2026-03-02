import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { cmsApi } from "@/lib/cms";

const renderBlock = (block: Record<string, unknown>, index: number) => {
  const type = String(block.type || "");
  if (type === "heading") {
    return (
      <h2 key={index} className="font-display text-3xl mt-8 mb-3">
        {String(block.text || "")}
      </h2>
    );
  }
  if (type === "quote") {
    return (
      <blockquote key={index} className="border-l-2 border-primary pl-4 italic text-lg my-6">
        {String(block.text || "")}
      </blockquote>
    );
  }
  if (type === "image") {
    return (
      <img
        key={index}
        src={String(block.url || "")}
        alt={String(block.alt || "")}
        className="w-full h-auto my-6"
      />
    );
  }
  return (
    <p key={index} className="text-muted-foreground leading-8 my-4">
      {String(block.text || "")}
    </p>
  );
};

const BlogPost = () => {
  const { slug = "" } = useParams();
  const postQuery = useQuery({
    queryKey: ["public", "post", slug],
    queryFn: () => cmsApi.getPostBySlug(slug),
    enabled: Boolean(slug),
  });

  if (postQuery.isLoading) {
    return <div className="min-h-screen bg-background p-8 text-muted-foreground">Loading post...</div>;
  }

  if (!postQuery.data) {
    return (
      <div className="min-h-screen bg-background p-8">
        <p className="text-muted-foreground">Post not found.</p>
        <Link to="/blog" className="text-primary underline">
          Back to blog
        </Link>
      </div>
    );
  }

  const blocks = Array.isArray((postQuery.data.contentJson as { blocks?: unknown[] })?.blocks)
    ? ((postQuery.data.contentJson as { blocks: Record<string, unknown>[] }).blocks ?? [])
    : [];

  return (
    <article className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <Link to="/blog" className="text-primary text-sm underline">
          Back to blog
        </Link>
        <h1 className="font-display text-5xl mt-4 mb-4">{postQuery.data.title}</h1>
        <p className="text-muted-foreground mb-8">{postQuery.data.excerpt}</p>
        {postQuery.data.featuredImageUrl ? (
          <img src={postQuery.data.featuredImageUrl} alt={postQuery.data.title} className="w-full h-auto mb-8" />
        ) : null}
        <div>{blocks.map((block, index) => renderBlock(block, index))}</div>
      </div>
    </article>
  );
};

export default BlogPost;
