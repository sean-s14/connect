import Link from "next/link";

const policies = [
  {
    title: "Terms Of Service",
    href: "tos",
  },
  {
    title: "Privacy Policy",
    href: "privacy",
  },
];

export default function Policies() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Policies</h1>
      <ul className="list-disc list-inside">
        {policies.map((policy, index) => (
          <li
            key={index}
            className="mt-1 text-slate-100 hover:text-emerald-500"
          >
            <Link href={`/policy/${policy.href}`}>{policy.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
