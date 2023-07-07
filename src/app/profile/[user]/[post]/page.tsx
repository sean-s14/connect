import { IPost } from "@/constants/schemas/post";
import Post, { ParentPostType, ChildPostType } from "@/components/post";

type Author = {
  _id: string;
  name: string;
  username: string;
};

type OmmittedPostFields =
  | "updatedAt"
  | "__v"
  | "deletedAt"
  | "children"
  | "likes"
  | "author";

type PostType = Omit<IPost, OmmittedPostFields | "parent"> & {
  _id: string;
  likes: number;
  author: Author;
  parent?: ParentPostType;
  children: ChildPostType[];
};

async function fetchPost(_id: string) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/posts?_id=${_id}`);
    const data = await res.json();
    const { post }: { post: PostType } = data;
    return post;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export default async function PostPage({
  params,
}: {
  params: { user: string; post: string };
}) {
  const post = await fetchPost(params.post);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="pt-10 min-w-full flex flex-col items-center">
      <Post
        name={post?.author?.name}
        username={post?.author?.username}
        content={post?.content}
        createdAt={post?.createdAt}
        likes={post?.likes}
        replyCount={post?.children?.length}
        replies={post?.children}
        parent={post?.parent}
        _id={post?._id}
        containerClassName="max-w-[90%]"
      />
    </div>
  );
}
