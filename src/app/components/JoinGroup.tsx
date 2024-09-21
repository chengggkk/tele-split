"use client";
import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";
import { english, generateMnemonic, mnemonicToAccount } from "viem/accounts";

export default function JoinGroup() {
    const id = WebApp.initDataUnsafe.user?.id || "Unknown ID";
    const userName = WebApp.initDataUnsafe.user?.username || "Unknown Username";
    const firstName =
        WebApp.initDataUnsafe.user?.first_name || "Unknown First Name";
    const lastName =
        WebApp.initDataUnsafe.user?.last_name || "Unknown Last Name";
    const photoUrl =
        WebApp.initDataUnsafe.user?.photo_url || "Unknown Photo URL";
    const [groupID, setGroupID] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const createGroup = async (groupID: string, address: string) => {
        const member_res = await fetch("/api/groupmember", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // groupname: tourName,
                groupID: groupID, // Use the _id from the response
                userID: id, // Ensure this is defined in your scope
                address: address,
                userName: userName,
                firstName: firstName,
                lastName: lastName,
                photoUrl: photoUrl,
            }),
        });

        if (!member_res.ok) {
            const errorData = await member_res.json(); // Get error details
            console.error("Failed to save member:", errorData);
            throw new Error("Failed to save the member.");
        } else {
            const memberData = await member_res.json();
            console.log("Member saved successfully: ", memberData);
            console.log({
                // groupname: tourName,
                groupID: groupID,
                userID: id,
            });
        }
    };

    const join = async () => {
        WebApp.CloudStorage.getItem("mnemonic", async (error, result) => {
            if (error) {
                console.error("Error fetching mnemonic:", error);
                return null;
            }
            let address = null;
            if (result) {
                const account = mnemonicToAccount(result);
                address = account.address;
            } else {
                const mnemonic = generateMnemonic(english);
                const account = mnemonicToAccount(mnemonic);
                WebApp.CloudStorage.setItem("mnemonic", mnemonic);
                address = account.address;
            }
            await createGroup(groupID, address);
            window.location.href = "/arrange/" + groupID;
        });
        closeModal();
    };

    const reject = () => {
        setGroupID("");
        closeModal();
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        const startParam = WebApp.initDataUnsafe?.start_param || "";
        if (startParam) {
            setGroupID(startParam);
            openModal();
        }
    }, []);

    return (
        <>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            Join Group
                        </h2>
                        <p className="mb-6 text-gray-700 dark:text-gray-300">
                            You&apos;ve been invited to join a group. Would you
                            like to join?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={reject}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150 ease-in-out"
                            >
                                Reject
                            </button>
                            <button
                                onClick={join}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out"
                            >
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
