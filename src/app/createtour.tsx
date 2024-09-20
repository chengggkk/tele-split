"use client";  // Add this line

import { SetStateAction, useState } from 'react';

const TourComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tourName, setTourName] = useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleTourNameChange = (e: { target: { value: SetStateAction<string>; }; }) => setTourName(e.target.value);
  const handleSubmit = () => {
    console.log("Tour Name: ", tourName);
    closeModal();
  };

  return (
    <div>
      {/* Button to open modal */}
      <button
        className="rounded-full bg-black/[.08] dark:bg-white/[.06] px-2 py-1"
        onClick={openModal}
      >
        create tour
      </button>

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