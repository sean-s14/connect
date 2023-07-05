export default function convertDate(date: Date): string {
  return new Date(date).toLocaleString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
