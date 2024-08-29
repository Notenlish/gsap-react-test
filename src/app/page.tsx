import Image from "next/image";
import GSAPComponent from "./gsapComp";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <GSAPComponent />
    </main>
  );
}
