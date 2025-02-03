import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Resources = () => {
  const [task, setTask] = useState(null);
  const [completed, setCompleted] = useState(false);

  // Fetch task details from the server
  const fetchTask = () => {
    fetch('http://localhost:5000/recommendations')
      .then((response) => response.json())
      .then((data) => {
        // Assuming task assignment to a specific resource by employee_id is done
        setTask(data[0]); // This should be based on employee_id or another filtering criterion
      })
      .catch((error) => console.error('Error fetching task:', error));
  };

  // Mark task as completed
  const completeTask = () => {
    fetch(`http://localhost:5000/products/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        current_status: 'Completed',  // Update the status to 'Completed'
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setCompleted(true); // Show that the task is completed
      })
      .catch((error) => console.error('Error completing task:', error));
  };

  useEffect(() => {
    fetchTask();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Work Allotment</h2>
        {task ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Product ID</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                value={task.id}
                disabled
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Task Description</label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                rows={3}
                value={`Place the package with ID ${task.id} at Rack Bin: ${task.rack_bin}`}
                disabled
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Deadline</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                value={task.expiry_date}
                disabled
              />
            </div>
            <button
              className={`w-full py-2 rounded-lg ${completed ? 'bg-green-500' : 'bg-blue-500'} text-white`}
              onClick={completeTask}
              disabled={completed}
            >
              {completed ? "Task Completed" : "Allot Task"}
            </button>
          </>
        ) : (
          <p>Loading task...</p>
        )}
      </div>
    </div>
  );
};

export default Resources;
