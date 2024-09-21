"use client";
import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";
import { english, generateMnemonic, mnemonicToAccount } from "viem/accounts";

export default function JoinGroup() {
    const id = WebApp.initDataUnsafe.user?.id || "Unknown ID";
    const userName = WebApp.initDataUnsafe.user?.username || "Unknown Username";
    const firstName = WebApp.initDataUnsafe.user?.first_name || "Unknown First Name";
    const lastName = WebApp.initDataUnsafe.user?.last_name || "Unknown Last Name";
    const photoUrl = WebApp.initDataUnsafe.user?.photo_url || "Unknown Photo URL";
    const [groupID, setGroupID] = useState("");

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
        // TODO: get user params from db
        const id = WebApp.initDataUnsafe?.user?.id || "undefined";
        const param = WebApp.initDataUnsafe?.start_param || "undefined";
        if (id !== "undefined" && param !== "undefined") {
            WebApp.CloudStorage.getItem("mnemonic", async (error, result) => {
                if (error) {
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
                await createGroup(param, address);
                window.location.href = "/arrange/" + param;
            });
        }
    };

    const reject = async () => {
        setGroupID("");
    };

    useEffect(() => {
        const startParam = WebApp.initDataUnsafe?.start_param || "";
        setGroupID(startParam);
    }, []);

    return (
        <>
            {groupID !== "" && (
                <div>
                    <button
                        className="mr-2 bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded"
                        onClick={join}
                    >
                        Join Group
                    </button>
                    <button
                        className="mr-2 bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded"
                        onClick={reject}
                    >
                        Reject
                    </button>
                </div>
            )}
        </>
    );
}
