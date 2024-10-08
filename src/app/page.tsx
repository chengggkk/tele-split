import Image from "next/image";
import Wallet from "./components/Wallet";

// const ShareButton = dynamic(() => import('./arrange/[slug]/components/ShareButton'), { ssr: false })
import dynamic from "next/dynamic";
import { QueryClient } from "@tanstack/react-query";

const TelegramWallet = dynamic(() => import("./components/TelegramWallet"), {
    ssr: false,
});
const TelegramUser = dynamic(() => import("./components/TelegramUser"), {
    ssr: false,
});
const JoinGroup = dynamic(() => import("./components/JoinGroup"), {
    ssr: false,
});
const GroupList = dynamic(() => import("./components/GroupList"), {
    ssr: false,
});
const TourComponent = dynamic(() => import("./components/creategroup"), {
    ssr: false,
});
export default function Home() {
    return (
        <div className="grid grid-rows-[10px_1fr_20px] items-center justify-items-center min-h-screen p-4 pb-20 gap-8 sm:p-10 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-6 row-start-2 items-center sm:items-start w-full max-w-3xl">
                <Image
                    src="/header.png"
                    alt="Cover Image"
                    width={250}
                    height={150}
                    priority
                />
                <Wallet />
                <TelegramWallet />
                <JoinGroup />
                <TourComponent />
                <GroupList />
                {/* <TelegramUser /> */}
                {/* <ShareButton /> */}

                {/* <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="https://nextjs.org/icons/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div> */}
            </main>
        </div>
    );
}
