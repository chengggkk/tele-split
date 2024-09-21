import { useState } from 'react';

const SplitButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tourName, setTourName] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeForm, setActiveForm] = useState<'average' | 'customize'>('average');

  const openModal = () => {
    setSuccessMessage(null);  // Clear any previous messages when opening the modal
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleTourNameChange = (e: { target: { value: string } }) => {
    setTourName(e.target.value);
    setSuccessMessage(null);  // Clear any messages when input changes
  };

  const handleSubmit = () => {
    // Handle form submission
    setSuccessMessage('Form submitted successfully!');
  };

  return (
    <>
      <a
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        onClick={openModal}
      >
        create a split
      </a>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Create Split</h2>
            <div className="flex justify-between mb-4">
              <button
                className={`px-3 py-1 rounded ${activeForm === 'average' ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
                onClick={() => setActiveForm('average')}
              >
                average
              </button>
              <button
                className={`px-3 py-1 rounded ${activeForm === 'customize' ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
                onClick={() => setActiveForm('customize')}
              >
                customize
              </button>
            </div>
            {activeForm === 'average' && (
              <div>
                <input
                  type="text"
                  value={tourName}
                  onChange={handleTourNameChange}
                  placeholder="Enter split name"
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
            )}
            {activeForm === 'customize' && (
              <div>
                <input
                  type="text"
                  value={tourName}
                  onChange={handleTourNameChange}
                  placeholder="Enter another split name"
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
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SplitButton;