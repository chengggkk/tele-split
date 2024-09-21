"use client";

import dynamic from "next/dynamic";
// import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SplitButton from "./components/splitbutton";
import GroupUsers from "@/app/components/GroupUsers";
import ShowSplit from "./components/showsplit";

const TelegramUser = dynamic(() => import("../../components/TelegramUser"), {
    ssr: false,
});
const ShareButton = dynamic(() => import("../../components/ShareButton"), {
    ssr: false,
});

export default function Home({ params }: { params: { slug: string } }) {
    const [groupname, setGroupname] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    // const router = useRouter();
    // const { slug } = router.query;  // Extract `slug` from router.query (for dynamic routing)
    useEffect(() => {
        const fetchGroupname = async () => {
            try {
                const response = await fetch(`/api/groupname/${params.slug}`); // Call the API with the slug
                if (!response.ok) {
                    throw new Error("Failed to fetch group.");
                }

                const data = await response.json();
                console.log(data);
                setGroupname(data.groupname);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching groupname:", error);
                setLoading(false);
            }
        };
        fetchGroupname();
    }, [params.slug]);

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-50 dark:bg-gray-900 transition-all duration-300">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-3xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300">
                <button
                    onClick={() => (window.location.href = "/")}
                    className="absolute top-4 left-4 flex items-center px-4 py-2 bg-black text-white rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 transition duration-150 ease-in-out"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-5 h-5 mr-2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Go Back
                </button>
                <div className="text-center sm:text-left">
                    <p className="text-gray-700 dark:text-gray-300 text-2xl">
                        <span className="font-bold text-blue-600 dark:text-blue-400 text-2xl">
                            {groupname}
                        </span>
                    </p>
                </div>
                <GroupUsers params={params} />
                <ShareButton params={params} />
                <SplitButton params={params} />
                <ShowSplit params={params} />
            </main>
        </div>
    );
}
