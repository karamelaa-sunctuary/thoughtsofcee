import { redirect } from "next/navigation";
import { writings } from "../data/writings";

export default function RandomThought() {
  const random =
    writings[Math.floor(Math.random() * writings.length)];

  redirect(`/writings/${random.slug}`);
}