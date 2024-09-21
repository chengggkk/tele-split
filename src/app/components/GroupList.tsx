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
        window.location.href = "/arrange/" + groupIDs[index];
    };
    useEffect(() => {
        getGroupUsers();
    }, []);
    return (
        <>
            <h2>Groups</h2>
            {groups.map((group, index) => (
                // <a href={`arrange/${groupIDs[index]}`}>

                <div key={group}>
                    <button onClick={() => handleClick(index)}>
                        {/* <a href={`arrange/${groupIDs[index]}`}> */}
                        {group} {index} {groupIDs[index]}
                        {/* </a> */}
                    </button>
                </div>

                // </a>
            ))}
        </>
    );
}
