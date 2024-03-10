import React from 'react';
import { useState } from 'react';

const ViewSchedule = ({ day, hour, onClose }) => {
  const [isHour] = useState(hour);
  const [isDays] = useState(day);

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
        <div className="p-8 bg-white rounded-md">
          <form className="w-full max-w-lg">
            <h1 className="block mb-3 text-lg font-bold tracking-wide text-gray-700 uppercase">View</h1>
              <div className="flex flex-wrap mb-6 -mx-3">
                <div className="w-full px-3 mb-6 md:w-1/2 md:mb-0">
                  <label className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase" htmlFor="grid-first-name">
                    Day
                  </label>
                  <input value={isDays} className="block px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none w-36 focus:outline-none focus:bg-white focus:border-gray-500" type="text" disabled />
                </div>
                <div className="w-full px-3 md:w-1/2">
                  <label className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase" htmlFor="grid-last-name">
                    Hour
                  </label>
                  <input value={isHour} className="block px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none w-36 focus:outline-none focus:bg-white focus:border-gray-500" type="time" disabled />
                </div>
              </div>
            <button onClick={onClose} type="submit" className="px-4 py-2 mr-3 text-white bg-blue-500 rounded-md hover:bg-blue-600">
              Close
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewSchedule;
