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
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                Group Users
            </div>
            <details className="bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white">
                <summary className="cursor-pointer py-2 px-4 mb-2">
                    Show Users
                </summary>
                <div className="pl-4">
                    {groupUsers.map((user) => (
                        <div
                            key={user}
                            className="py-2 px-4 mb-2 bg-gray-200 dark:bg-gray-600 rounded-md"
                        >
                            {user}
                        </div>
                    ))}
                </div>
            </details>
        </div>
    );
}
