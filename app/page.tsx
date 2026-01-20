import { redisTest } from "./actions";

export default async function Home() {
  const redisData = await redisTest();
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div>{redisData}</div>
    </main>
  );
}
