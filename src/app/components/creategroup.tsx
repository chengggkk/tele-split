"use client";

import { SetStateAction, useState } from "react";
import WebApp from "@twa-dev/sdk";
import { english, generateMnemonic, mnemonicToAccount } from "viem/accounts";

const TourComponent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tourName, setTourName] = useState("");
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // State to show success/failure message
    const id = WebApp.initDataUnsafe.user?.id || "Unknown ID";
    const userName = WebApp.initDataUnsafe.user?.username || "Unknown Username";
    const firstName = WebApp.initDataUnsafe.user?.first_name || "Unknown First Name";
    const lastName = WebApp.initDataUnsafe.user?.last_name || "Unknown Last Name";
    const photoUrl = WebApp.initDataUnsafe.user?.photo_url || "Unknown Photo URL";
    const [address, setAddress] = useState<string | null>(null);

    const openModal = () => {
        setSuccessMessage(null); // Clear any previous messages when opening the modal
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);

    const handleTourNameChange = (e: {
        target: { value: SetStateAction<string> };
    }) => {
        setTourName(e.target.value);
        setSuccessMessage(null); // Clear any messages when input changes
    };

    const createGroup = async (groupID: string, address: string) => {
        const member_res = await fetch("/api/groupmember", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                groupname: tourName,
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
                groupname: tourName,
                groupID: groupID,
                userID: id,
            });
        }
    };

    // Function to handle form submission and send the tour data to the backend
    const handleSubmit = async () => {
        try {
            const response = await fetch("/api/group", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    groupname: tourName,
                }),
            });

            if (!response.ok) {
                console.log(response);
                throw new Error("Failed to save the tour.");
            }

            const resultJson = await response.json();
            console.log("Tour saved successfully: ", resultJson);

            // Show success message
            setSuccessMessage("Tour created successfully!");
            setTourName(""); // Clear input field

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
                await createGroup(resultJson._id, address);
                // Direct to arrange page
                window.location.href = "/arrange/" + resultJson._id; // Use the _id from the response
                closeModal(); // Optionally close the modal on success
            });
        } catch (error) {
            console.error("Error saving tour: ", error);

            // Show failure message
            setSuccessMessage("Failed to create the tour. Please try again.");
        }
    };

    return (
        <div>
            {/* Button to open modal */}
            <button
                className="rounded-full bg-black/[.08] dark:bg-white/[.06] px-2 py-1"
                onClick={openModal}
            >
                Create Tour
            </button>

            {/* Show success or failure message */}
            {successMessage && (
                <div
                    className={`mt-4 text-center ${
                        successMessage.includes("successfully")
                            ? "text-green-500"
                            : "text-red-500"
                    }`}
                >
                    {successMessage}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Create Tour</h2>
                        <input
                            type="text"
                            value={tourName}
                            onChange={handleTourNameChange}
                            placeholder="Enter tour name"
                            className="border p-2 rounded w-full mb-4"
                        />
                        <div className="flex justify-end">
                            <button
                                className="mr-2 bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                                onClick={handleSubmit}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TourComponent;
