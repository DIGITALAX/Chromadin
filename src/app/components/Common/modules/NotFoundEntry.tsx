"use client";

import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";
import Head from "next/head";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";

export default function NotFoundEntry({ dict }: { dict: any }) {
  const router = useRouter();
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-x-hidden">
      <Head>
        <title>Page Not Found</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative w-full h-full flex flex-col items-center justify-center gap-4">
        <div className="relative w-full h-fit flex items-center justify-center font-earl text-white text-base sm:text-lg text-center row-start-1">
          {dict?.Common?.fre} <br />
          <br /> {dict?.Common?.ran}
        </div>
        <div
          className="relative flex items-center justify-center w-60 h-60 hover:rotate-3 active:rotate-6 row-start-2"
          onClick={() => {
            router.prefetch("/");
            router.push("/");
          }}
        >
          <Image
            src={`${INFURA_GATEWAY_INTERNAL}QmQZ8UwjeizDQkbCiZED8Ya4LxpFD5JbVbNeAdowurHkiY`}
            className="relative w-fit h-fit relative cursor-pointer"
            width={100}
            height={100}
            alt="dial"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
