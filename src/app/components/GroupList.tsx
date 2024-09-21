"use client";

import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";

export default function GroupList() {
    const [groups, setGroups] = useState<any[]>([]);
    const [groupIDs, setGroupIDs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const id = WebApp.initDataUnsafe.user?.id || "Unknown ID";

    const getGroupUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/groupmember?userID=${id}`);
            const data = await res.json();
            const gs = [];
            const gids = [];
            for (const group of data) {
                gs.push(group.groupname);
                gids.push(group.groupID);
            }
            setGroups(gs);
            setGroupIDs(gids);
        } catch (error) {
            console.error("Error fetching groups:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClick = (index: number) => {
        if (index >= 0 && groupIDs.length >= 0) {
            window.location.href = "/arrange/" + groupIDs[index];
        }
    };

    useEffect(() => {
        getGroupUsers();
    }, []);

    return (
        <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Groups</h2>
                <button
                    onClick={getGroupUsers}
                    className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out dark:bg-blue-600 dark:hover:bg-blue-700"
                    disabled={isLoading}
                >
                    {isLoading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 transition-all duration-300">
                {groups.length > 0 ? (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {groups.map((group, index) => (
                            <li key={group} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-150 ease-in-out">
                                <button
                                    onClick={() => handleClick(index)}
                                    className="w-full px-4 py-4 sm:px-6 text-left focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-700 transition duration-150 ease-in-out"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate">{group}</p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">
                            {isLoading ? 'Loading groups...' : 'No groups found.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
