"use client";

import dynamic from 'next/dynamic';
// import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SplitButton from './components/splitbutton';

const TelegramUser = dynamic(() => import('../../components/TelegramUser'), { ssr: false });
const ShareButton = dynamic(() => import('./components/ShareButton'), { ssr: false });

export default function Home({ params }: { params: { slug: string } }) {
  const [groupname, setGroupname] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // const router = useRouter();
  // const { slug } = router.query;  // Extract `slug` from router.query (for dynamic routing)
  useEffect(() => {
    const fetchGroupname = async () => {
      try {
        const response = await fetch(`/api/groupname/${params.slug}`);  // Call the API with the slug
        if (!response.ok) {
          throw new Error('Failed to fetch group.');
        }

        const data = await response.json();
        console.log(data)
        setGroupname(data.groupname);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching groupname:', error);
        setLoading(false);
      }
    };
    fetchGroupname();
  }, [params.slug]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
          <h1>Arrange Page</h1>
          <p>Group Name: {groupname}</p>
        </div>
        <TelegramUser />
        <ShareButton params={params}/>
        <SplitButton />
      </main>
    </div>
  );
}