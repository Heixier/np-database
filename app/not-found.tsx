import Image from "next/image";

export default async function NotFound() {
  return (
    <div className="relative flex flex-col gap-8 w-screen h-screen justify-center items-center bg-background p-4 overflow-hidden">
      <Image
        src="/404_error.png"
        width={500}
        height={500}
        alt="404 error"
        className="w-full max-w-md drop-shadow-2xl"
      />
    </div>
  );
}
