"use client";

import { useState, useReducer, useEffect } from "react";
import { useSession } from "next-auth/react";
import Input from "@/components/form/input";
import { capitalise } from "@sean14/utils";
import Spinner from "@/components/loaders/spinner";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useRouter } from "next/navigation";

const USER_FIELDS = [
  { field: "name" },
  { field: "username" },
  { field: "email" },
  { field: "bio", multiline: true },
];

export default function UserEditPage() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession({
    required: true,
  });
  const [loading, setLoading] = useState(true); // loading state for fetching user data
  const [submitLoading, setSubmitLoading] = useState(false); // loading state for submitting form

  // create a useReducer hook to handle form state
  const [formState, dispatch] = useReducer(formReducer, {
    name: "",
    username: "",
    email: "",
    bio: "",
    // image: "", TODO: add image upload
  });

  // fetch user data by username
  useEffect(() => {
    setLoading(true);
    const username = session?.user?.username;
    if (username) {
      fetch(`/api/users/${username}/private`)
        .then((res) => res.json())
        .then((data) => {
          const { user } = data;
          dispatch({ type: "name", payload: user.name });
          dispatch({ type: "username", payload: user.username });
          dispatch({ type: "email", payload: user.email });
          dispatch({ type: "bio", payload: user.bio });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [session?.user?.username]);

  // handle form state
  function formReducer(state: any, action: any) {
    switch (action.type) {
      case "name":
        return { ...state, name: action.payload };
      case "username":
        return { ...state, username: action.payload };
      case "email":
        return { ...state, email: action.payload };
      case "bio":
        return { ...state, bio: action.payload };
      default:
        return state;
    }
  }

  // handle form input changes
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    dispatch({ type: e.target.name, payload: e.target.value });
  }

  // handle form submission
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // make patch request to update user
    setSubmitLoading(true);
    fetch(`/api/users/${session?.user?.username}/private`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formState),
    })
      .then((res) => res.json())
      .then((data) => {
        updateSession();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  }

  return (
    <div className="min-h-screen min-w-full p-5 relative flex flex-col items-center justify-center">
      {/* Go back button */}
      <button
        className="absolute top-10 left-10 rounded flex items-center gap-2 bg-slate-800 hover:bg-slate-950 py-2 px-3"
        onClick={() =>
          router.push(
            `/profile/${
              formState.username !== ""
                ? formState.username
                : session?.user?.username
            }`
          )
        }
      >
        <AiOutlineArrowLeft width={5} height={5} />
        <span>Go back</span>
      </button>

      {/* Form */}
      <form
        onSubmit={(e) => handleSubmit(e)}
        className={`${
          loading ? "opacity-0 pointer-events-none" : "opacity-1"
        } transition-opacity duration-500 flex flex-col gap-5 bg-slate-800 p-8 rounded-xl`}
      >
        {USER_FIELDS.map(({ field, multiline }, index) => (
          <Input
            key={index}
            label={capitalise(field)}
            type="text"
            name={field}
            id={field}
            value={formState[field]}
            onChange={handleChange}
            multiline={multiline}
          />
        ))}
        <button className="btn btn-solid p-1 h-10 flex items-center justify-center">
          {submitLoading ? (
            <Spinner style={{ width: 24, height: 24, borderWidth: 3 }} />
          ) : (
            <span>Save Changes</span>
          )}
        </button>
      </form>
    </div>
  );
}
