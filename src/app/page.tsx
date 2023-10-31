import dynamic from "next/dynamic";
import Link from "next/link";

const HelloExperimental = dynamic(
  () => import("./_components/hello-experimental"),
  { ssr: false, loading: () => <p>Loading...</p> },
);

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <HelloExperimental />
      <Link href="/login">Sign in</Link>
    </main>
  );
}
