"use client";

import WebApp from "@twa-dev/sdk";

const ShareButton = ({ params }: { params: { slug: string } }) => {
    // const [params, setParams] = useState<string>("undefined");
    // useEffect(() => {
    //     // TODO: get user params from db
    //     setParams(WebApp.initDataUnsafe?.start_param || "undefined");
    // }, []);
    const generateShareUrl = () => {
        const userParams = params.slug;
        const url = `https://t.me/Tele_split_bot/TeleSplit?startapp%3D${userParams}`;
        const text = `Join tele-split with ${WebApp.initDataUnsafe.user?.first_name} ${WebApp.initDataUnsafe.user?.last_name}`;
        const format = `https://t.me/share/url?url=${url}&text=${text}`;
        return format;
    };
    return (
        <>
            <a
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-500 text-white gap-2 hover:bg-blue-600 dark:hover:bg-blue-400 text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-150 ease-in-out"
                href={generateShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 mr-2"
                >
                    <path
                        fill="white"
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.29 7.71l-1.39 6.44c-.1.46-.37.57-.75.35l-2.07-1.53-1 .96c-.11.11-.21.21-.43.21l.16-2.28 4.15-3.75c.18-.16-.04-.25-.28-.09l-5.13 3.23-2.21-.69c-.48-.15-.49-.48.1-.71l8.62-3.32c.39-.15.73.09.61.7z"
                    />
                </svg>
                Invite Friends
            </a>
        </>
    );
};

export default ShareButton;
