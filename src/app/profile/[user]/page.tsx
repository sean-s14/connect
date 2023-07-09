"use client";

import { IUser } from "@/constants/schemas/user";
import { IPost } from "@/constants/schemas/post";
import Image from "next/image";
import Link from "next/link";
import { IoCalendar } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import Post, { ParentPostType } from "@/components/post";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import usePagination from "@/hooks/usePagination";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "@/components/loaders/spinner";
import convertDate from "@/utils/convertDate";

type OmmittedPostFields =
  | "updatedAt"
  | "__v"
  | "deletedAt"
  | "children"
  | "likes"
  | "author"
  | "posts";

type Author = {
  _id: string;
  name: string;
  username: string;
};

type PostType = Omit<IPost, OmmittedPostFields> & {
  _id: string;
  author: Author;
  liked: boolean;
  likeCount: number;
  children: number;
  parent?: ParentPostType;
};

const fetchUser = async (url: string) => {
  const res = await fetch(url);
  const { user }: { user: IUser } = await res.json();
  return user;
};

const fetchPosts = async (url: string) => {
  const res = await fetch(url);
  const { posts }: { posts: PostType[] } = await res.json();
  return posts;
};

// TODO: When displaying /profile/{username} instead use the 'as' prop to /{username}
export default function UserPage(props: { params: { user: string } }) {
  const { data: session, status } = useSession();
  const {
    data: user,
    error: userError,
    isLoading: userIsLoading,
  } = useSWR<IUser>(`/api/users/${props.params.user}`, fetchUser);

  const {
    flattenedData: posts,
    error: postsError,
    isLoading: postsIsLoading,
    size: postSize,
    setSize: setPostSize,
    hasReachedEnd,
  } = usePagination<PostType>(
    `/api/posts/list?username=${props.params.user}`,
    10,
    fetchPosts
  );

  if (userIsLoading || postsIsLoading) {
    return (
      <div className="min-w-full min-h-screen flex items-center justify-center">
        <Spinner style={{ width: 80, height: 80, borderWidth: 8 }} />
      </div>
    );
  }

  if (userError || postsError) {
    return <div>error</div>;
  }

  return (
    <div
      className={`flex flex-col items-start justify-start p-10 min-w-100 min-h-screen transition-opacity duration-500`}
    >
      {user?.image ? (
        <Image
          src={user?.image || ""}
          alt="users profile image"
          width={120}
          height={120}
          priority={true}
          className="rounded-full mb-5 self-center outline outline-4 outline-slate-950"
        />
      ) : (
        <div className="w-[120px] h-[120px]"></div>
      )}
      <div className="flex flex-col gap-2 mt-5 w-full max-w-2xl self-center relative">
        <div className="text-xl font-bold">{user?.name}</div>
        {user?.username && (
          <div className="text-md font-medium text-slate-500">
            @{user.username}
          </div>
        )}
        {user?.createdAt && (
          <div className="text-md font-medium text-slate-500 flex items-center gap-1">
            <IoCalendar className="h-4 w-4 inline-flex" />
            <span>Joined</span>
            {convertDate(user.createdAt)}
          </div>
        )}
        {user?.bio && (
          <div className="text-md font-normal text-slate-300">{user?.bio}</div>
        )}

        {/* Link to Profile Management page */}
        {session?.user?.username === props.params.user && (
          <Link
            href="/profile"
            className="flex items-center gap-2 absolute right-4 bg-slate-900 rounded-lg border-2 border-slate-950 py-1 px-3 text-slate-50 hover:bg-slate-950 transition-colors duration-500"
          >
            <FiEdit className="h-4 w-4" />
            <span>Edit Profile</span>
          </Link>
        )}
      </div>

      {/* Post Container */}
      <div className="w-full max-w-2xl mt-10 flex flex-col self-center items-center">
        <InfiniteScroll
          dataLength={posts?.length || 0}
          next={() => setPostSize(postSize + 1)}
          hasMore={!hasReachedEnd}
          loader={<Spinner style={{ width: 30, height: 30, borderWidth: 3 }} />}
          endMessage={
            <div className="text-slate-500 text-center">No more posts</div>
          }
          className="flex flex-col gap-6 w-full min-w-full"
        >
          {posts &&
            posts.length > 0 &&
            posts.map(
              (
                {
                  _id,
                  author,
                  content,
                  createdAt,
                  liked,
                  likeCount,
                  children,
                  parent,
                },
                index
              ) => (
                <Post
                  key={index}
                  name={author.name}
                  username={author.username}
                  content={content}
                  createdAt={createdAt}
                  liked={liked}
                  likeCount={likeCount}
                  parent={parent}
                  replyCount={children}
                  _id={_id}
                />
              )
            )}
        </InfiniteScroll>
      </div>
    </div>
  );
}
