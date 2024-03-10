import React, { useState } from 'react';
import tokenRequestComponent from './tokenRequestComponent';

const DeleteSchedule = ({ scheduleId, onClose, setSchedules }) => {
  const [isLoading, setIsLoading] = useState(false);
  const api_url = import.meta.env.VITE_API_URL;
  const email = sessionStorage.getItem('email');

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await tokenRequestComponent.delete(`/schedule_posts/${scheduleId}`);
      setIsLoading(false);
      updateCalendar();
      onClose();
    } catch (error) {
      console.error('Error deleting schedule:', error);
      setIsLoading(false);
    }
  };

  const updateCalendar = async () => {
    const response = await tokenRequestComponent.get(`/schedule_posts/${email}`);
    const schedules = response.data;
    setSchedules(schedules);
  };

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div className="p-8 bg-white rounded-md">
        <form className="w-full max-w-lg text-center">
          <h1 className="block mb-3 text-lg font-bold tracking-wide text-gray-700 uppercase">Delete</h1>
          <div className="mb-6">
            <label className="text-lg font-medium text-red-500" htmlFor="grid-first-name">
              Are you sure you want to delete this schedule?
            </label>
          </div>
          <div className="flex justify-center">
            <button onClick={() => handleDelete()} disabled={isLoading} className="px-4 py-2 mr-3 text-white bg-blue-500 rounded-md hover:bg-blue-600" >
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
            <button onClick={onClose} className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600" >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

  );
};

export default DeleteSchedule;
