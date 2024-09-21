"use client";

import { useEffect, useState } from "react";

export default function GroupUsers({ params }: { params: { slug: string } }) {
    const [groupUsers, setGroupUsers] = useState<any[]>([]);
    const getGroupUsers = async () => {
        const res = await fetch(`/api/groupmember?groupID=${params.slug}`);
        const data = await res.json();
        const users = [];
        for (const user of data) {
            users.push(user.firstName + " " + user.lastName);
        }
        setGroupUsers(users);
    };
    useEffect(() => {
        getGroupUsers();
    }, []);
    return (
        <>
            <h2>Group Users</h2>
            <div>
                {groupUsers.map((user) => (
                    <div key={user}>{user}</div>
                ))}
            </div>
        </>
    );
}
