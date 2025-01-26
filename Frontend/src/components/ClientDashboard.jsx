import React, { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const ClientDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const {
    employees,
    fetchEmployees,
    assignWork,
    isAssigning,
    assignments,
    fetchEmployeeAssignments,
    updateAssignmentStatus,
  } = useAuthStore();

  const [newAssignment, setNewAssignment] = useState({
    employeeName: "",
    title: "",
    description: "",
    deadline: "",
  });

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const fetchedEmployees = await fetchEmployees();
        if (fetchedEmployees?.length > 0) {
          const defaultEmployeeId = fetchedEmployees[0]._id;
          setSelectedEmployeeId(defaultEmployeeId);
          await fetchEmployeeAssignments(defaultEmployeeId);
        }
      } catch (error) {
        console.error("Error initializing dashboard:", error);
      }
    };

    initializeDashboard();
  }, []);

  const prepareEmployeeCompletionData = () => {
    return employees.map((emp) => {
      const empAssignments = assignments.filter(
        (a) => a.assignedTo === emp._id
      );
      const completedCount = empAssignments.filter(
        (a) => a.status === "completed"
      ).length;
      const totalAssignments = empAssignments.length;

      return {
        name: emp.fullName,
        completed: completedCount,
        total: totalAssignments,
        percentage:
          totalAssignments > 0
            ? Math.round((completedCount / totalAssignments) * 100)
            : 0,
      };
    });
  };

  const handleEmployeeSelect = async (employeeId) => {
    setSelectedEmployeeId(employeeId);
    await fetchEmployeeAssignments(employeeId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await assignWork(newAssignment);
      setShowModal(false);
      setNewAssignment({
        employeeName: "",
        title: "",
        description: "",
        deadline: "",
      });
      // Refetch assignments for the selected employee
      await fetchEmployeeAssignments(selectedEmployeeId);
    } catch (error) {
      console.error("Error assigning work:", error);
    }
  };

  const handleStatusUpdate = async (assignmentId, status) => {
    try {
      await updateAssignmentStatus(assignmentId, status);
      await fetchEmployeeAssignments(selectedEmployeeId);
    } catch (error) {
      console.error("Error updating assignment status:", error);
    }
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-6 bg-base-100 h-full overflow-y-auto ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Client Dashboard</h2>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus /> Create New Assignment
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Employee Status Overview</h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Total Assignments</th>
                <th>Pending</th>
                <th>In Progress</th>
                <th>Completed</th>
                <th>Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {prepareEmployeeCompletionData().map((emp) => (
                <tr key={emp.name}>
                  <td>{emp.name}</td>
                  <td>{emp.total}</td>
                  <td>
                    <span className="badge badge-info">{emp.pending}</span>
                  </td>
                  <td>
                    <span className="badge badge-warning">{emp.inProgress}</span>
                  </td>
                  <td>
                    <span className="badge badge-success">{emp.completed}</span>
                  </td>
                  <td>
                    <span className="badge badge-primary">
                      {emp.total > 0
                        ? `${Math.round((emp.completed / emp.total) * 100)}%`
                        : "0%"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Employee Assignments
            <select
              className="ml-4 select select-bordered select-sm"
              value={selectedEmployeeId}
              onChange={(e) => handleEmployeeSelect(e.target.value)}
            >
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.fullName}
                </option>
              ))}
            </select>
          </h3>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  <tr key={assignment._id}>
                    <td>{assignment.title}</td>
                    <td>{assignment.description}</td>
                    <td>{new Date(assignment.deadline).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`badge ${
                          assignment.status === "completed"
                            ? "badge-success"
                            : assignment.status === "in-progress"
                            ? "badge-warning"
                            : "badge-info"
                        }`}
                      >
                        {assignment.status}
                      </span>
                    </td>
                    <td>
                      {assignment.status !== "completed" && (
                        <div className="dropdown dropdown-left">
                          <div tabIndex={0} className="btn btn-xs btn-ghost">
                            Update Status
                          </div>
                          <ul
                            tabIndex={0}
                            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                          >
                            <li>
                              <a
                                onClick={() => handleStatusUpdate(assignment._id, "pending")}
                              >
                                Pending
                              </a>
                            </li>
                            <li>
                              <a
                                onClick={() => handleStatusUpdate(assignment._id, "in-progress")}
                              >
                                In Progress
                              </a>
                            </li>
                            <li>
                              <a
                                onClick={() => handleStatusUpdate(assignment._id, "completed")}
                              >
                                Completed
                              </a>
                            </li>
                          </ul>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Completion Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={prepareEmployeeCompletionData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="completed"
              >
                {prepareEmployeeCompletionData().map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modal for creating assignments */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Create New Assignment</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-control w-full">
                <label className="label">Employee</label>
                <select
                  className="select select-bordered w-full"
                  value={newAssignment.employeeName}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      employeeName: e.target.value,
                    })
                  }
                  required
                >
                  <option disabled value="">
                    Select Employee
                  </option>
                  {employees?.map((emp) => (
                    <option key={emp._id} value={emp.fullName}>
                      {emp.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control w-full">
                <label className="label">Title</label>
                <input
                  type="text"
                  placeholder="Assignment Title"
                  className="input input-bordered w-full"
                  value={newAssignment.title}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-control w-full">
                <label className="label">Description</label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="Assignment Description"
                  value={newAssignment.description}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      description: e.target.value,
                    })
                  }
                  required
                ></textarea>
              </div>
              <div className="form-control w-full">
                <label className="label">Deadline</label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={newAssignment.deadline}
                  min={getTomorrowDate()}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      deadline: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isAssigning}
                >
                  {isAssigning ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Create Assignment"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
