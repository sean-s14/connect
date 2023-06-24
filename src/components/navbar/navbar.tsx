import { capitaliseAll } from "@sean14/utils";
import { UserPlusIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  return (
    <nav className="min-h-screen w-40 bg-slate-200 dark:bg-slate-800 fixed backdrop-blur-sm flex flex-col items-center justify-between py-6">
      <div className="text-2xl font-bold">
        {capitaliseAll(process.env.WEBSITE_NAME || "???")}
      </div>
      <div className="flex flex-col gap-2">
        <button className="btn-secondary w-28">Login</button>
        <button className="btn-primary flex gap-2 items-center">
          <UserPlusIcon className="h-5 w-5" /> Signup
        </button>
      </div>
    </nav>
  );
}
