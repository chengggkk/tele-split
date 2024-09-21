"use client";

import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";
// import { useRouter } from "next/router";

export default function ShareButton({ params }: { params: { slug: string } }) {

    const { slug } = params;
    // const router = useRouter();
    // const [slug, setSlug] = useState<string | null>(null);
    const [groupname, setGroupname] = useState<string>('Unknown Group');
    const [startParams, setStartParams] = useState<string>("undefined");

    // Fetch group name once slug is available
    useEffect(() => {
        // if (router.isReady) {
            // const { slug: routeSlug } = router.query;
            // if (routeSlug) {
                // setSlug(routeSlug as string); // Convert routeSlug to string
                const fetchGroupname = async (slug: string) => {
                    try {
                        const response = await fetch(`/api/groupname/${slug}`);
                        if (response.ok) {
                            const data = await response.json();
                            setGroupname(data.groupname);
                        }
                    } catch (error) {
                        console.error('Error fetching group name:', error);
                    }
                };
                fetchGroupname(slug as string);
            // }
        // }
    }, []);

    useEffect(() => {
        setStartParams(WebApp.initDataUnsafe?.start_param || "undefined");
    }, []);

    const generateShareUrl = () => {
        const userParams = "123"; // Replace with actual user params
        const url = `https://t.me/ETHGlobal_singapore_bot/TestWebApp?startapp%3D${userParams}`;
        const text = `Join tele-split with ${WebApp.initDataUnsafe.user?.first_name} ${WebApp.initDataUnsafe.user?.last_name}`;
        return `https://t.me/share/url?url=${url}&text=${text}`;
    };

    const handleShare = async () => {
        const sharelink = generateShareUrl();
        const sender = WebApp.initDataUnsafe.user?.id || 'Unknown ID';
    
        console.log('Share link:', sharelink);
        console.log('Sender:', sender);
        console.log('Group ID:', slug);
        console.log('Group name:', groupname);
    
        try {
          const response = await fetch('/api/share', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sender: sender,
              sharelink: sharelink,
              groupID: slug, // Use slug as groupID
              generateTIME: new Date().toISOString(),
              groupname: groupname,
              receiver: ""
            }),
          });
    
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to share. Status: ${response.status}, Response: ${errorText}`);
          }
    
          console.log("Share data successfully logged");
        } catch (error) {
          console.error('Error sharing:', error);
        }
      };
    

    return (
        <>
            <h1>Start Param: {startParams}</h1>
            <a
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                href={generateShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleShare}
            >
                Share with Friends
            </a>
        </>
    );
}