"use client";

import { useState, useReducer, useEffect } from "react";
import { useSession } from "next-auth/react";
import Input from "@/components/form/input";
import { capitalise } from "@sean14/utils";
import Spinner from "@/components/loaders/spinner";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { uploadImage } from "@/utils/uploadImage";

const USER_FIELDS = [
  { field: "name" },
  { field: "username" },
  { field: "email" },
  { field: "bio", multiline: true },
];

// TODO: Include ability to select a portion of the image to crop
export default function UserEditPage() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession({
    required: true,
  });
  const [loading, setLoading] = useState(true); // loading state for fetching user data
  const [submitLoading, setSubmitLoading] = useState(false); // loading state for submitting form

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // create a useReducer hook to handle form state
  const [formState, dispatch] = useReducer(formReducer, {
    name: "",
    username: "",
    email: "",
    bio: "",
    image: "",
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
          dispatch({ type: "image", payload: user?.image ?? "" });
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
      case "image":
        return { ...state, image: action.payload };
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
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let filepath = "";
    if (image) {
      filepath = await uploadImage(image);
    }

    setSubmitLoading(true);
    fetch(`/api/users/${session?.user?.username}/private`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formState, image: filepath }),
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

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files![0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  return (
    <div className="min-h-screen min-w-full p-5 relative flex flex-col items-center justify-center">
      {/* Go back button */}
      <button
        className="absolute top-5 sm:top-10 left-5 sm:left-10 rounded flex items-center gap-2 bg-slate-800 hover:bg-slate-950 py-2 px-3"
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
        onSubmit={handleSubmit}
        className={`${
          loading ? "opacity-0 pointer-events-none" : "opacity-1"
        } transition-opacity duration-500 flex flex-col gap-5 bg-slate-800 p-4 sm:p-8 rounded-xl max-w-[95%]`}
      >
        <input type="file" name="image" onChange={handleFileSelected} />

        {formState?.image ? (
          <Image
            src={imagePreview || formState.image}
            alt="Upload Preview"
            width={100}
            height={100}
            priority={true}
            style={{ width: 100, height: 100 }}
            className="rounded-full self-center"
          />
        ) : (
          <p>No image uploaded yet</p>
        )}

        {USER_FIELDS.map(({ field, multiline }, index) => (
          <Input
            key={index}
            label={capitalise(field)}
            type="text"
            name={field}
            id={field}
            value={formState[field] ?? ""}
            onChange={handleChange}
            multiline={multiline}
          />
        ))}

        {/* Button to save changes */}
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
