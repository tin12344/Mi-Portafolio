import React from 'react';
import { useState } from 'react';

const dropdown = ({selectedDay, setSelectedDay}) => {
    const [isOpen, setIsOpen] = useState(false);

    const openDropdown = () => {
        setIsOpen(!isOpen);
    }

    const changeDays = (day) => {
        setSelectedDay(day);
        setIsOpen(false);
    }
    return (
        <div>
            <button onClick={openDropdown} id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-28 justify-center" type="button">
                {selectedDay}
            </button>
            {
                isOpen &&
                <div id="dropdown" className={"z-10 absolute mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"}>
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                        <li>
                            <a onClick={() => changeDays("Monday")} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                Monday
                            </a>
                        </li>
                        <li>
                            <a onClick={() => changeDays("Tuesday")} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                Tuesday
                            </a>
                        </li>
                        <li>
                            <a onClick={() => changeDays("Wednesday")}  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                Wednesday
                            </a>
                        </li>
                        <li>
                            <a onClick={() => changeDays("Thursday")}  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                Thursday
                            </a>
                        </li>
                        <li>
                            <a onClick={() => changeDays("Friday")}  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                Friday
                            </a>
                        </li>
                        <li>
                            <a onClick={() => changeDays("Saturday")}  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                Saturday
                            </a>
                        </li>
                        <li>
                            <a onClick={() => changeDays("Sunday")}  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                Sunday
                            </a>
                        </li>
                    </ul>
                </div>
            }
        </div>
    );
};

export default dropdown;