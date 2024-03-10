import React from 'react';
import { useState, useEffect } from 'react';
import tokenRequestComponent from './tokenRequestComponent';
import Dropdown from './dropdown';

const editSchedule = ({ day, hour, id, onClose, setSchedules }) => {
  const [scheduleId, setScheduleId] = useState(id);
  const [selectedDay, setSelectedDay] = useState(day);
  const [editedHour, setEditedHour] = useState(hour);
  const userDate = sessionStorage.getItem('user');
  const user = JSON.parse(userDate);
  const email = user.email;

  const handleHourChange = (event) => {
    setEditedHour(event.target.value);
  };

  useEffect(() => {
    setScheduleId(id);
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedSchedule = {
      email: email,
      day: selectedDay,
      hour: editedHour,
    };

    await tokenRequestComponent.put(`/schedule_posts/${scheduleId}`, updatedSchedule)
      .then(() => {
        updateCalendar();
        onClose();
      })
      .catch((error) => {
        console.error('Error updating schedule:', error);
      });
  };

  const updateCalendar = async () => {
    const response = await tokenRequestComponent.get(`/schedule_posts/${email}`);
    const schedules = response.data;
    setSchedules(schedules);
  };

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div className="p-8 bg-white rounded-md">
        <form onSubmit={handleSubmit} className="w-full max-w-lg">
          <h1 className="block mb-3 text-lg font-bold tracking-wide text-gray-700 uppercase">Edit</h1>
          <div className="flex flex-wrap mb-6 -mx-3">
            <div className="w-full px-3 mb-6 md:w-1/2 md:mb-0">
              <label className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase">
                Day
              </label>
                <Dropdown selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
            </div>
            <div className="w-full px-3 md:w-1/2">
              <label className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase">
                Hour
              </label>
              <input
                value={editedHour}
                onChange={handleHourChange}
                className="block px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none w-36 focus:outline-none focus:bg-white focus:border-gray-500"
                type="time"
              />
            </div>
          </div>
          <button type="submit" className="px-4 py-2 mr-3 text-white bg-blue-500 rounded-md hover:bg-blue-600">
            Save
          </button>
          <button onClick={onClose} className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default editSchedule;
