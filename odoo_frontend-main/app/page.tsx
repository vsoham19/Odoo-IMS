import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/dashboard");
}

/* cache buster */