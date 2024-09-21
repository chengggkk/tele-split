import { useState } from 'react';
import styles from '../styles/splitbutton.module.css';
import { text } from 'stream/consumers';

const SplitButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tourName, setTourName] = useState('');  // State for "average" form
    const [splitName, setSplitName] = useState(''); // State for "customize" form
    const [amount, setAmount] = useState('');      // State for "customize" form
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [activeForm, setActiveForm] = useState<'average' | 'customize'>('average');

    const openModal = () => {
        setSuccessMessage(null);  // Clear any previous messages when opening the modal
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    // Handlers for input changes
    const handleTourNameChange = (e: { target: { value: string } }) => {
        setTourName(e.target.value);
        setSuccessMessage(null);  // Clear any messages when input changes
    };

    const handleSplitNameChange = (e: { target: { value: string } }) => {
        setSplitName(e.target.value);
        setSuccessMessage(null);  // Clear any messages when input changes
    };

    const handleAmountChange = (e: { target: { value: string } }) => {
        setAmount(e.target.value);
        setSuccessMessage(null);  // Clear any messages when input changes
    };

    const handleSubmit = () => {
        // Handle form submission logic based on active form
        if (activeForm === 'average') {
            console.log(`Tour Name: ${tourName}`);
        } else if (activeForm === 'customize') {
            console.log(`Split Name: ${splitName}, Amount: ${amount}`);
        }
        setSuccessMessage('Form submitted successfully!');
    };
    const [selected, setSelected] = useState<string[]>([]);
    const allOptions = ["Option 1", "Option 2", "Option 3", "Option 4"];

    const handleCheckboxChange = (option: string) => {
        setSelected((prevSelected) =>
            prevSelected.includes(option)
                ? prevSelected.filter((item) => item !== option)
                : [...prevSelected, option]
        );
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
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
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

                        {/* Form for "average" */}
                        {activeForm === 'average' && (
                            <div>
                                <input
                                    type="text"
                                    value={splitName}
                                    onChange={handleSplitNameChange}
                                    placeholder="Enter split name"
                                    className="border p-2 rounded w-full mb-4"
                                />
                                <input
                                    type="text"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    placeholder="Enter amount"
                                    className="border p-2 rounded w-full mb-4"
                                />

                                <div className={styles.container}>
                                    <div className={styles.checkboxContainer}>
                                        <div className={styles.left}>
                                            <h3>All Options</h3>
                                            {allOptions.map((option) => (
                                                <div key={option}>
                                                    <input
                                                        type="checkbox"
                                                        id={option}
                                                        value={option}
                                                        checked={selected.includes(option)}
                                                        onChange={() => handleCheckboxChange(option)}
                                                    />
                                                    <label htmlFor={option}>{option}</label>
                                                </div>
                                            ))}
                                        </div>
                                        <div className={styles.right}>
                                            <h3>Selected Options</h3>
                                            <ul>
                                                {selected.map((option) => (
                                                    <li key={option}>{option}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

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
                        )}

                        {/* Form for "customize" */}
                        {activeForm === 'customize' && (
                            <div>
                                <input
                                    type="text"
                                    value={splitName}
                                    onChange={handleSplitNameChange}
                                    placeholder="Enter split name"
                                    className="border p-2 rounded w-full mb-4"
                                />
                                <div>


                                    <div className={styles.container}>
                                        <div className={styles.checkboxContainer}>
                                            <div className={styles.left}>
                                                <h3>All Options</h3>
                                                {allOptions.map((option) => (
                                                    <div key={option}>
                                                        <input
                                                            type="checkbox"
                                                            id={option}
                                                            value={option}
                                                            checked={selected.includes(option)}
                                                            onChange={() => handleCheckboxChange(option)}
                                                        />
                                                        <label htmlFor={option}>{option}</label>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className={styles.right}>
                                                <h3>Selected Options</h3>
                                                <ul>
                                                    {selected.map((option) => (
                                                        <li key={option}>{option} <input 
                                                        type="text"
                                                        value={amount}
                                                        onChange={handleAmountChange}
                                                        placeholder="Enter amount"
                                                        className="border p-2 rounded w-full mb-4"
                                                        />
                                                        </li>

                                                    ))}
                                                </ul>
                                            </div>
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
};

export default SplitButton;