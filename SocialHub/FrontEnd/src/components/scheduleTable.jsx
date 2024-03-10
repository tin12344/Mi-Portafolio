import React, { useState, useEffect } from 'react';
import ViewSchedule from './viewSchedule';
import CreateSchedule from './createSchedule';
import EditSchedule from './EditSchedule';
import DeleteSchedule from './deleteSchedule';
import tokenRequestComponent from './tokenRequestComponent';

const scheduleTable = () => {
  const [showView, setShowView] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState({ day: '', hour: '', id: '' });
  const [showEdit, setShowEdit] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [scheduleToDeleteId, setScheduleToDeleteId] = useState(null);
  const userDate = sessionStorage.getItem('user');
  const user = JSON.parse(userDate);
  const email = user.email;

  useEffect(() => {
    getSchedules();
  }, [showEdit])

  useEffect(() => {
    getSchedules();
  }, [showDelete])

  const handleViewClick = (day, hour, id) => {
    setSelectedDateTime({ day, hour, id });
    setShowView(true);
  };

  const handleCloseView = () => {
    setShowView(false);
  };

  const handleEditClick = (schedule) => {
    setSelectedDateTime({ day: schedule.day, hour: schedule.hour, id: schedule.id });
    setShowEdit(true);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
  };

  const handleCloseDelete = () => {
    setShowDelete(false);
  };

  const handleCreateClick = () => {
    setShowCreate(true);
  };

  const handleCloseCreate = () => {
    setShowCreate(false);
  };

  const handleDeleteClick = (id) => {
    setScheduleToDeleteId(id);
    setShowDelete(true);
  };

  const getSchedules = async () => {
    try {
      const response = await tokenRequestComponent.get(`/schedule_posts`);
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  useEffect(() => {
    getSchedules();
  }, []);

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Days
              </th>
              <th scope="col" className="px-6 py-3">
                Hour
              </th>
              <th scope="col" className="px-6 py-3">
                View
              </th>
              <th scope="col" className="px-6 py-3">
                Edit
              </th>
              <th scope="col" className="px-6 py-3">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                <td className="px-6 py-4">{schedule.day}</td>
                <td className="px-6 py-4">{schedule.hour}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleViewClick(schedule.day, schedule.hour, schedule.id)}><a className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</a></button>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleEditClick(schedule)}><a className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a></button>
                </td>
                <td className="px-6 py-4">
                  <a
                    className="font-medium text-red-600 cursor-pointer dark:text-red-500 hover:underline"
                    onClick={() => handleDeleteClick(schedule.id)}
                  >
                    Delete
                  </a>
                </td>
              </tr>

            ))}
          </tbody>
        </table>
        <button onClick={() => handleCreateClick()} className="w-full py-3 my-1 text-center text-white bg-black rounded hover:bg-green-dark focus:outline-none">
          Create Schedule
        </button>
      </div>

      {showView &&
        <ViewSchedule
          day={selectedDateTime.day}
          hour={selectedDateTime.hour}
          onClose={handleCloseView}
        />
      }
      {showEdit &&
        <EditSchedule
          day={selectedDateTime.day}
          hour={selectedDateTime.hour}
          id={selectedDateTime.id}
          onClose={handleCloseEdit}
          setSchedules={setSchedules}
        />
      }
      {showCreate &&
        <CreateSchedule
          onClose={handleCloseCreate}
          setSchedules={setSchedules}
        />
      }
      {showDelete && (
        <DeleteSchedule
          scheduleId={scheduleToDeleteId}
          onClose={handleCloseDelete}
          setSchedules={setSchedules}
        />
      )}
    </div>
  );
};

export default scheduleTable;
