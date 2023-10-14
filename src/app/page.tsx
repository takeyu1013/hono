import dynamic from "next/dynamic";

const HelloExperimental = dynamic(
  () => import("./_components/hello-experimental"),
  { ssr: false, loading: () => <p>Loading...</p> }
);

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <HelloExperimental />
    </main>
  );
}
