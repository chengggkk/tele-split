"use client";

import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";

export default function GroupList() {
    const [groups, setGroups] = useState<any[]>([]);
    const [groupIDs, setGroupIDs] = useState<any[]>([]);
    const id = WebApp.initDataUnsafe.user?.id || "Unknown ID";
    const getGroupUsers = async () => {
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
        <>
            <h2 className="text-xl font-bold mb-3">Groups</h2>
            {groups.map((group, index) => (
                <div key={group} className="mb-1">
                    <button
                        onClick={() => handleClick(index)}
                        className="w-full px-3 py-1.5 text-left bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-sm transition duration-200 ease-in-out transform hover:scale-102 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-opacity-50"
                    >
                        {group}
                    </button>
                </div>
            ))}
        </>
    );
}
