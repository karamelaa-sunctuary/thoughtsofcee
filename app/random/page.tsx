import { redirect } from "next/navigation";
import { writings } from "../data/writings";

export default function RandomPage() {

  const random =
    writings[Math.floor(Math.random() * writings.length)];


  if (random.type === "letter") {
    redirect(`/letters/${random.slug}`);
  }


  redirect(`/fragments/${random.slug}`);
}