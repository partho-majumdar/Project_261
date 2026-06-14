import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessageSquare, CheckCircle, X, Loader } from "lucide-react";
import {
  addFeedback,
  getAssignedStudents,
  markComplete,
} from "../../store/slices/teacherSlice";

const AssignedStudents = () => {
  const [sortBy, setSortBy] = useState("name");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feedbackData, setFeedbackData] = useState({
    title: "",
    message: "",
    type: "general",
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAssignedStudents());
  }, [dispatch]);
  const { assignedStudents, loading, error } = useSelector(
    (state) => state.teacher,
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "badge badge-completed";
      case "approved":
        return "badge badge-approved";
      default:
        return "badge badge-pending";
    }
  };

  const getStatusText = (status) => {
    if (status === "completed") return "Completed";
    if (status === "approved") return "Approved";
    return "Pending";
  };

  const handleFeedback = (student) => {
    setSelectedStudent(student);
    setFeedbackData({ title: "", message: "", type: "general" });
    setShowFeedbackModal(true);
  };

  const handleMarkComplete = (student) => {
    setSelectedStudent(student);
    setShowCompleteModal(true);
  };

  const closeModal = () => {
    setShowFeedbackModal(false);
    setShowCompleteModal(false);
    setSelectedStudent(null);
    setFeedbackData({ title: "", message: "", type: "general" });
  };

  const submitFeedback = () => {
    if (
      selectedStudent?.project?._id &&
      feedbackData.title &&
      feedbackData.message
    ) {
      dispatch(
        addFeedback({
          projectId: selectedStudent.project._id,
          payload: feedbackData,
        }),
      );
      closeModal();
    }
  };

  const confirmMarkComplete = () => {
    if (selectedStudent?.project?._id) {
      dispatch(markComplete(selectedStudent?.project?._id));
      closeModal();
    }
  };

  const sortedStudents = [...(assignedStudents || [])].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "lastActivity":
        return new Date(b.project?.updatedAt) - new Date(a.project.updatedAt);
      default:
        return 0;
    }
  });

  const stats = [
    {
      label: "Total Students",
      value: sortedStudents.length,
      border: "border-[rgba(0,229,96,0.25)]",
    },
    {
      label: "Projects Completed",
      value: sortedStudents.filter((s) => s.project?.status === "completed")
        .length,
      border: "border-[rgba(0,229,96,0.25)]",
    },
    {
      label: "In Progress",
      value: sortedStudents.filter((s) => s.project?.status === "approved")
        .length,
      border: "border-[rgba(234,179,8,0.25)]",
    },
    {
      label: "Total Projects",
      value: sortedStudents.length,
      border: "border-[rgba(0,229,96,0.25)]",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="animate-spin w-16 h-16 text-[#00e560]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-[#f47373] font-medium">
        Error loading students
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Assigned Students</h1>
          <p className="card-subtitle">
            Manage your assigned students and their projects
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((item) => (
            <div key={item.label} className={`card ${item.border}`}>
              <p className="text-xs font-medium text-[#5a8a72]">{item.label}</p>
              <p className="text-2xl font-bold text-[#c8f5e0] mt-1">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedStudents.map((student) => (
          <div key={student._id} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[rgba(0,229,96,0.12)] rounded-full flex items-center justify-center">
                  <span className="text-[#00e560] font-semibold text-sm">
                    {student.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "S"}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-[#c8f5e0] text-sm">
                    {student.name}
                  </h3>
                  <p className="text-xs text-[#5a8a72]">{student.email}</p>
                </div>
              </div>

              <span className={getStatusBadge(student.project?.status)}>
                {getStatusText(student.project?.status)}
              </span>
            </div>

            <div className="mb-5">
              <h4 className="font-medium text-[#c8f5e0] text-sm mb-1">
                {student.project?.title || "No project title"}
              </h4>
              <p className="text-xs text-[#5a8a72]">
                Last Update:{" "}
                {new Date(
                  student.project?.updatedAt || new Date(),
                ).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleFeedback(student)}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <MessageSquare className="w-4 h-4" /> Feedback
              </button>
              <button
                onClick={() => handleMarkComplete(student)}
                disabled={student.project?.status === "completed"}
                className={`btn-secondary flex items-center gap-2 text-sm ${
                  student?.project?.status === "completed"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <CheckCircle className="w-4 h-4" /> Mark Complete
              </button>
            </div>
          </div>
        ))}

        {sortedStudents.length === 0 && (
          <div className="card text-center py-10 text-[#5a8a72] col-span-2">
            No assigned students found
          </div>
        )}
      </div>

      {showFeedbackModal && selectedStudent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="card-title">Provide Feedback</h2>
                <button
                  onClick={closeModal}
                  className="text-[#5a8a72] hover:text-[#c8f5e0]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-[#0c1210] rounded-xl p-4 mb-6 border border-[rgba(0,229,96,0.15)]">
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-[#5a8a72]">Project:</span>
                    <span className="ml-2 text-[#c8f5e0]">
                      {selectedStudent.project?.title || "No title"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-[#5a8a72]">Student:</span>
                    <span className="ml-2 text-[#c8f5e0]">
                      {selectedStudent.name}
                    </span>
                  </div>
                  {selectedStudent.project?.deadline && (
                    <div>
                      <span className="font-medium text-[#5a8a72]">
                        Deadline:
                      </span>
                      <span className="ml-2 text-[#c8f5e0]">
                        {new Date(
                          selectedStudent.project?.deadline,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-[#5a8a72]">
                      Last Updated:
                    </span>
                    <span className="ml-2 text-[#c8f5e0]">
                      {new Date(
                        selectedStudent.project?.updatedAt || new Date(),
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label">Feedback Title</label>
                  <input
                    type="text"
                    value={feedbackData.title}
                    onChange={(e) =>
                      setFeedbackData({
                        ...feedbackData,
                        title: e.target.value,
                      })
                    }
                    className="input w-full"
                    placeholder="Enter feedback title"
                  />
                </div>

                <div>
                  <label className="label">Feedback Type</label>
                  <select
                    value={feedbackData.type}
                    onChange={(e) =>
                      setFeedbackData({ ...feedbackData, type: e.target.value })
                    }
                    className="input w-full"
                  >
                    <option value="general">General</option>
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                  </select>
                </div>

                <div>
                  <label className="label">Feedback Message</label>
                  <textarea
                    value={feedbackData.message}
                    onChange={(e) =>
                      setFeedbackData({
                        ...feedbackData,
                        message: e.target.value,
                      })
                    }
                    rows={4}
                    className="input w-full resize-none min-h-[100px]"
                    placeholder="Enter your feedback message..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={closeModal} className="btn-outline flex-1">
                  Cancel
                </button>
                <button
                  className="btn-primary flex-1"
                  onClick={submitFeedback}
                  disabled={!feedbackData.title || !feedbackData.message}
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCompleteModal && selectedStudent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="card-title">Mark Project as Completed?</h2>
                <button
                  onClick={closeModal}
                  className="text-[#5a8a72] hover:text-[#c8f5e0]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-[#0c1210] rounded-xl p-4 mb-6 border border-[rgba(0,229,96,0.15)]">
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-[#5a8a72]">Student</span>
                    <span className="ml-2 text-[#c8f5e0]">
                      {selectedStudent.name}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-[#5a8a72]">Project</span>
                    <span className="ml-2 text-[#c8f5e0]">
                      {selectedStudent.project?.title || "No title"}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[#7ab898] text-sm mb-6">
                Are you sure to mark this project as completed? This action
                cannot be undone.
              </p>

              <div className="flex gap-3">
                <button onClick={closeModal} className="btn-outline flex-1">
                  Cancel
                </button>
                <button
                  onClick={confirmMarkComplete}
                  className="btn-primary flex-1"
                >
                  Mark as Completed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedStudents;
