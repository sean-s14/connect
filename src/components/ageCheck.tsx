"use client";

import { useState, useEffect } from "react";
import Spinner from "@/components/loaders/spinner";

export default function AgeCheck(props: { children: React.ReactNode }) {
  const [userIsAdult, setUserIsAdult] = useState<boolean | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [date, setDate] = useState({
    day: "",
    month: "",
    year: "",
  });

  useEffect(() => {
    if (date.day && date.month && date.year) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [date]);

  useEffect(() => {
    if (userIsAdult === undefined) {
      fetch("/api/age-check")
        .then((res) => res.json())
        .then((data) => {
          setUserIsAdult(data?.isAdult);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [userIsAdult]);

  function handleSubmitAge(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const day = formData.get("day");
    const month = formData.get("month");
    const year = formData.get("year");
    if (!day || !month || !year) return;
    let age = new Date().getFullYear() - Number(year);
    if (
      new Date().getMonth() + 1 < Number(month) ||
      (new Date().getMonth() + 1 === Number(month) &&
        new Date().getDate() < Number(day))
    ) {
      age--;
    }

    fetch("/api/age-check", {
      method: "POST",
      body: JSON.stringify({ age: age.toString() }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUserIsAdult(data?.isAdult);
      });
  }

  if (isLoading) {
    return (
      <div className="bg-slate-800 flex flex-col items-center justify-center min-h-screen min-w-full">
        <Spinner style={{ width: 80, height: 80, borderWidth: 4 }} />
      </div>
    );
  }

  function updateDate(e: React.ChangeEvent<HTMLSelectElement>) {
    setDate({ ...date, [e.target.name]: e.target.value });
  }

  if (userIsAdult === undefined) {
    return (
      <div className="bg-slate-800 flex flex-col items-center justify-center min-h-screen min-w-full">
        <form
          action="POST"
          onSubmit={handleSubmitAge}
          className="flex flex-col items-center gap-6 bg-slate-700 border-2 border-slate-600 rounded-lg p-6 pb-4"
        >
          <h3 className="text-xl font-semibold">Enter Your Date of Birth</h3>
          <div className="flex items-center gap-3 text-slate-800">
            <select
              name="day"
              id="day"
              className="w-20 rounded py-1"
              onChange={updateDate}
            >
              <option value="" className="text-center">
                Day
              </option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select
              name="month"
              id="month"
              className="w-20 rounded py-1"
              onChange={updateDate}
            >
              <option value="" className="text-center">
                Month
              </option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select
              name="year"
              id="year"
              className="w-20 rounded py-1"
              onChange={updateDate}
            >
              <option value="" className="text-center">
                Year
              </option>
              {Array.from({ length: 100 }, (_, i) => (
                <option key={i} value={2021 - i}>
                  {2021 - i}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className={`py-2 px-4 rounded bg-slate-800 hover:bg-slate-900 ${
              isDisabled && "opacity-50 cursor-not-allowed"
            }`}
            // disable button if any of the select fields are empty
            disabled={isDisabled}
          >
            Confirm
          </button>
        </form>
      </div>
    );
  }

  if (userIsAdult === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen min-w-full bg-slate-800">
        Sorry, you must be 18 years or older to view this site.
      </div>
    );
  }

  return <div>{props.children}</div>;
}
