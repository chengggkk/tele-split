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
            <h1>Start Param: {params.slug}</h1>
            <a
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                href={generateShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
            >
                Share with Friends
            </a>
        </>
    );
};

export default ShareButton;
