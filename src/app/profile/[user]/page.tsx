"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoCalendar } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import Post from "@/components/post";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import usePagination from "@/hooks/usePagination";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "@/components/loaders/spinner";
import convertDate from "@/utils/convertDate";
import { IPostWithAuthorAndParent } from "@/types/post";
import { IUser } from "@/types/user";
import { IFollowResponse } from "@/types/follow";

const fetchUser = async (url: string) => {
  const res = await fetch(url);
  const { user }: { user: IUser } = await res.json();
  return user;
};

const fetchPosts = async (url: string) => {
  const res = await fetch(url);
  const { posts }: { posts: IPostWithAuthorAndParent[] } = await res.json();
  return posts;
};

const fetchFollowers = async (url: string) => {
  const res = await fetch(url);
  const followers: IFollowResponse = await res.json();
  return followers;
};

// TODO: When displaying /profile/{username} instead use the 'as' prop to /{username}
// TODO: Add links to pages with all the users you follow and all users that follow you
export default function UserPage(props: { params: { user: string } }) {
  const { data: session, status } = useSession();
  const {
    data: user,
    error: userError,
    isLoading: userIsLoading,
  } = useSWR<IUser>(`/api/users/${props.params.user}`, fetchUser);

  const {
    data: followers,
    error: followersError,
    isLoading: followersIsLoading,
    mutate: mutateFollowers,
  } = useSWR<IFollowResponse>(
    () => (user?._id ? `/api/follow?id=${user._id}` : null),
    fetchFollowers
  );

  const {
    flattenedData: posts,
    error: postsError,
    isLoading: postsIsLoading,
    size: postSize,
    setSize: setPostSize,
    hasReachedEnd,
  } = usePagination<IPostWithAuthorAndParent>(
    `/api/posts/list?username=${props.params.user}`,
    10,
    fetchPosts
  );

  const [followingIsLoading, setFollowingIsLoading] = useState(false);

  function handleFollow(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    if (!user) {
      // TODO: Show error message
      return;
    }
    setFollowingIsLoading(true);
    fetch("/api/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user._id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        mutateFollowers(
          {
            followerCount: (followers?.followerCount ?? 0) + 1,
            followingCount: followers?.followingCount ?? 0,
            following: true,
          },
          false
        );
      })
      .catch((err) => console.log(err))
      .finally(() => setFollowingIsLoading(false));
  }

  function handleUnfollow(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    if (session?.user && user?._id && !!followers?.following) {
      setFollowingIsLoading(true);
      fetch(`/api/follow?id=${user._id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          mutateFollowers(
            {
              followerCount: (followers?.followerCount ?? 0) - 1,
              followingCount: followers?.followingCount ?? 0,
              following: false,
            },
            false
          );
        })
        .catch((err) => console.log(err))
        .finally(() => setFollowingIsLoading(false));
    }
  }

  if (userIsLoading || postsIsLoading || followersIsLoading) {
    return (
      <div className="min-w-full min-h-screen flex items-center justify-center">
        <Spinner style={{ width: 80, height: 80, borderWidth: 8 }} />
      </div>
    );
  }

  if (userError || postsError || followersError) {
    return <div>error</div>;
  }

  return (
    <div
      className={`flex flex-col items-start justify-start p-10 min-w-100 min-h-screen transition-opacity duration-500`}
    >
      {/* Profile Image */}
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

      {/* Name, Username, Bio */}
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

        {/* Link to Profile Management page / Follow Button */}
        <div className="absolute right-4">
          {session?.user?.username === props.params.user ? (
            // Link to Profile Management
            <Link
              href="/profile"
              className="flex items-center gap-2 bg-slate-900 rounded-lg border-2 border-slate-950 py-1 px-3 text-slate-50 hover:bg-slate-950 transition-colors duration-500"
            >
              <FiEdit className="h-4 w-4" />
              <span>Edit Profile</span>
            </Link>
          ) : (
            // Follow Button
            <button
              className={`rounded-lg bg-slate-900 border-2 border-slate-600 hover:bg-slate-800 hover:border-slate-600 transition-colors w-24 h-10 flex items-center justify-center ${
                followingIsLoading && "cursor-wait"
              }`}
              onClick={!!followers?.following ? handleUnfollow : handleFollow}
              disabled={followingIsLoading}
              onMouseEnter={() => {
                if (followers?.following) {
                  document.getElementById("following-id")!.innerHTML =
                    "Unfollow";
                }
              }}
              onMouseLeave={() => {
                if (followers?.following) {
                  document.getElementById("following-id")!.innerHTML =
                    "Following";
                }
              }}
            >
              {followingIsLoading ? (
                <Spinner style={{ width: 20, height: 20, borderWidth: 3 }} />
              ) : (
                <span id={"following-id"}>
                  {followers?.following ? "Following" : "Follow"}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Following and Followers */}
        <div className="flex items-center gap-3 mt-4">
          <div className="p-1 px-2 rounded-lg bg-slate-900 border-2 border-slate-700">
            {followers?.followerCount ?? 0} follower
            {followers?.followerCount != 1 && "s"}
          </div>
          <div className="p-1 px-2 rounded-lg bg-slate-900 border-2 border-slate-700">
            following {followers?.followingCount ?? 0}
          </div>
        </div>
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
            posts.map((post, index) => <Post key={index} post={post} />)}
        </InfiniteScroll>
      </div>
    </div>
  );
}
