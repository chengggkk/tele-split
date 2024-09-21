import { useEffect, useState } from 'react';
import styles from '../styles/splitbutton.module.css';
import WebApp from "@twa-dev/sdk";

function SplitButton({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const [startParams, setStartParams] = useState<string>("undefined");
    const [selected, setSelected] = useState<string[]>([]);
    const [amounts, setAmounts] = useState<{ [key: string]: string }>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [splitNote, setSplitNote] = useState('');
    const [amount, setAmount] = useState('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [activeForm, setActiveForm] = useState<'average' | 'customize'>('average');
    const ID = WebApp.initDataUnsafe.user?.id || 'Unknown ID';

    const openModal = () => {
        setSuccessMessage(null);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleSplitNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSplitNote(e.target.value);
        setSuccessMessage(null);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
        setSuccessMessage(null);
    };

    const handleSubmit = async () => {
        try {
            const response: Response = await fetch('/api/split', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Payer: ID,
                    Note: splitNote,
                    groupID: slug,
                }),
            });

            if (!response.ok) throw new Error('Failed to save the split.');
            const result = await response.json();

            // Handle both "average" and "customize" split
            selected.forEach(async (member) => {
                let memberAmount = 0;

                if (activeForm === 'average') {
                    // Calculate average amount for each selected member
                    memberAmount = Number(amount) / selected.length;
                } else if (activeForm === 'customize') {
                    // Get custom amount for each member
                    memberAmount = amounts[member] ? Number(amounts[member]) : 0;
                }

                // Post each split member and amount
                await fetch('/api/splitmember', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        split_id: result._id,
                        split_member: member,
                        amount: memberAmount,
                        state: String(member) === String(ID) ? 2 : 0
                    }),
                });
            });


            setSuccessMessage('Form submitted successfully!');
            closeModal();
        } catch (error) {
            console.error(error);
        }
    };

    const [groupName, setGroupName] = useState<string[]>([]);
    const [groupUsers, setGroupUsers] = useState<any[]>([]);
    const getGroupUsers = async () => {
        const res = await fetch(`/api/groupmember?groupID=${params.slug}`);
        const data = await res.json();
        const users = [];
        const names = [];
        for (const user of data) {
            names.push(user.firstName + " " + user.lastName)
            users.push(user.userID);
        }
        setGroupUsers(users);
        setGroupName(names);
    };
    useEffect(() => {
        getGroupUsers();
    }, []);

    const handleCheckboxChange = (option: string) => {
        setSelected((prevSelected) => {
            const newSelected = prevSelected.includes(option)
                ? prevSelected.filter((item) => item !== option)
                : [...prevSelected, option];
            if (!prevSelected.includes(option)) {
                setAmounts((prevAmounts) => ({
                    ...prevAmounts,
                    [option]: '',
                }));
            } else {
                const { [option]: removed, ...rest } = amounts;
                setAmounts(rest);
            }
            return newSelected;
        });
    };

    return (
        <>
            <button
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                onClick={openModal}
            >
                Create a Split
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg" style={{ width: '90%' }}>
                        <h2 className="text-lg font-bold mb-4">Create Split</h2>
                        <div className="flex justify-between mb-4">
                            <button
                                className={`px-3 py-1 rounded ${activeForm === 'average' ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
                                onClick={() => setActiveForm('average')}
                            >
                                Average
                            </button>
                            <button
                                className={`px-3 py-1 rounded ${activeForm === 'customize' ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
                                onClick={() => setActiveForm('customize')}
                            >
                                Customize
                            </button>
                        </div>

                        {activeForm === 'average' && (
                            <div>
                                <input
                                    type="text"
                                    value={splitNote}
                                    onChange={handleSplitNoteChange}
                                    placeholder="Enter split note"
                                    className="border p-2 rounded w-full mb-4 text-black"
                                />
                                <input
                                    type="text"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    placeholder="Enter amount"
                                    className="border p-2 rounded w-full mb-4 text-black"
                                />

                                <div className={styles.container}>
                                    <div className={styles.checkboxContainer}>
                                        <div className={styles.left}>
                                            <h3>All Options</h3>
                                            {groupUsers.map((id, index) => (
                                                <div key={id}>
                                                    <input
                                                        type="checkbox"
                                                        id={id}
                                                        value={groupName[index]}
                                                        checked={selected.includes(id)}
                                                        onChange={() => handleCheckboxChange(id)}
                                                    />
                                                    <label htmlFor={id}>{groupName[index]}</label>
                                                </div>
                                            ))}
                                        </div>
                                        <div className={styles.right}>
                                            <h3>Selected Options</h3>
                                            <ul>
                                                {selected.map((option) => {
                                                    const index = groupUsers.findIndex((name) => name === option);
                                                    return <li key={option}>{groupName[index]}</li>
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-4">
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
                        )}

                        {activeForm === 'customize' && (
                            <div>
                                <input
                                    type="text"
                                    value={splitNote}
                                    onChange={handleSplitNoteChange}
                                    placeholder="Enter split note"
                                    className="border p-2 rounded w-full mb-4 text-black"
                                />
                                <div className={styles.container}>
                                    <div className={styles.checkboxContainer}>
                                        <div className={styles.left}>
                                            <h3>All Options</h3>
                                            {groupUsers.map((id, index) => (
                                                <div key={id}>
                                                    <input
                                                        type="checkbox"
                                                        id={id}
                                                        value={groupName[index]}
                                                        checked={selected.includes(id)}
                                                        onChange={() => handleCheckboxChange(id)}
                                                    />
                                                    <label htmlFor={id}>{groupName[index]}</label>
                                                    </div>
                                            ))}
                                        </div>
                                        <div className={styles.right}>
                                            <h3>Selected Options</h3>
                                            <ul>
                                            {selected.map((option) => {
                                                    const index = groupUsers.findIndex((name) => name === option);
                                                    return <li key={option}>{groupName[index]}
                                                        <input
                                                            type="text"
                                                            value={amounts[option] || ''}
                                                            onChange={(e) => setAmounts({ ...amounts, [option]: e.target.value })}
                                                            placeholder="Enter amount"
                                                            className="border p-2 rounded w-full mb-4"
                                                        />
                                                    </li>
                                                }
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-5">
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
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default SplitButton;