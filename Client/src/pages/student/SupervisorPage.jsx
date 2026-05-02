import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllSupervisors,
  fetchProject,
  getSupervisor,
  requestSupervisor,
} from "../../store/slices/studentSlice";
import { X } from "lucide-react";

const SupervisorPage = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const { project, supervisors, supervisor } = useSelector(
    (state) => state.student,
  );

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);

  useEffect(() => {
    dispatch(fetchProject());
    dispatch(getSupervisor());
    dispatch(fetchAllSupervisors());
  }, [dispatch]);

  const hasSupervisor = useMemo(
    () => !!(supervisor && supervisor._id),
    [supervisor],
  );
  const hasProject = useMemo(() => !!(project && project._id), [project]);

  const formatDeadline = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";
    const day = date.getDate();
    const j = day % 10,
      k = day % 100;
    const suffix =
      j === 1 && k !== 11
        ? "st"
        : j === 2 && k !== 12
          ? "nd"
          : j === 3 && k !== 13
            ? "rd"
            : "th";
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    return `${day}${suffix} ${month} ${year}`;
  };

  const handleOpenRequest = (sup) => {
    setSelectedSupervisor(sup);
    setShowRequestModal(true);
  };

  const submitRequest = () => {
    if (!selectedSupervisor) return;
    const message =
      requestMessage?.trim() ||
      `${authUser.name || "Student"} has requested ${
        selectedSupervisor.name
      } to be their supervisor.`;
    dispatch(
      requestSupervisor({ teacherId: selectedSupervisor._id, message }),
    ).then((res) => {
      if (res.type === "student/requestSupervisor/fulfilled") {
        setShowRequestModal(false);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h1 className="card-title">Current Supervisor</h1>
          {hasSupervisor && (
            <span className="badge badge-approved">Assigned</span>
          )}
        </div>

        {hasSupervisor ? (
          <div className="space-y-6">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 rounded-full bg-[rgba(0,229,96,0.12)] flex items-center justify-center">
                <span className="text-2xl font-bold text-[#00e560]">
                  {supervisor?.name?.charAt(0) || "S"}
                </span>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-[#c8f5e0]">
                    {supervisor?.name || "-"}
                  </h3>
                  <p className="text-lg text-[#5a8a72]">
                    {supervisor?.department || "-"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Email</label>
                    <p className="text-[#c8f5e0] font-medium">
                      {supervisor?.email || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="label">Expertise</label>
                    <p className="text-[#c8f5e0] font-medium">
                      {Array.isArray(supervisor?.experties)
                        ? supervisor.experties.join(", ")
                        : supervisor?.experties || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-[#5a8a72] text-lg">
              Supervisor not assigned yet.
            </p>
          </div>
        )}
      </div>

      {hasProject && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Project Details</h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="label">Project Title</label>
                  <p className="text-lg font-semibold text-[#c8f5e0] mt-1">
                    {project?.title || "-"}
                  </p>
                </div>
                <div>
                  <label className="label">Status</label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full font-medium capitalize text-sm ${
                        project.status === "approved"
                          ? "bg-[rgba(0,229,96,0.12)] text-[#00e560]"
                          : project.status === "pending"
                            ? "bg-[rgba(234,179,8,0.12)] text-yellow-400"
                            : project.status === "rejected"
                              ? "bg-[rgba(244,115,115,0.12)] text-[#f47373]"
                              : project.status === "completed"
                                ? "bg-[rgba(0,229,96,0.12)] text-[#00e560]"
                                : "bg-[rgba(0,229,96,0.08)] text-[#7ab898]"
                      }`}
                    >
                      {project?.status || "Invalid"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label">Deadline</label>
                  <p className="text-lg font-semibold text-[#c8f5e0] mt-1">
                    {project?.deadline
                      ? formatDeadline(project.deadline)
                      : "No deadline set"}
                  </p>
                </div>
                <div>
                  <label className="label">Created</label>
                  <p className="text-lg font-semibold text-[#c8f5e0] mt-1">
                    {project.createdAt
                      ? formatDeadline(project.createdAt)
                      : "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            {project?.description && (
              <div>
                <label className="label">Description</label>
                <p className="text-[#7ab898] mt-2 leading-relaxed">
                  {project?.description || "-"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {!hasProject && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Project Required</h2>
          </div>
          <div className="p-6 text-center">
            <p className="text-[#5a8a72] text-lg">
              You haven't submitted any project proposal yet, so you cannot
              request a supervisor.
            </p>
          </div>
        </div>
      )}

      {hasProject && !hasSupervisor && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Available Supervisors</h2>
            <p className="card-subtitle">
              Browse and request supervision from available faculty members
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {supervisors &&
              supervisors.map((sup) => (
                <div
                  key={sup._id}
                  className="border border-[rgba(0,229,96,0.15)] rounded-xl p-4 bg-[#0c1210]"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-[rgba(0,229,96,0.12)] rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-[#00e560]">
                        {sup.name?.split(" ")[1]?.[0] ||
                          sup.name?.charAt(0) ||
                          "S"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-[#c8f5e0] text-sm">
                        {sup.name}
                      </h4>
                      <p className="text-xs text-[#5a8a72]">{sup.department}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div>
                      <label className="text-xs font-medium text-[#5a8a72]">
                        Email
                      </label>
                      <p className="text-sm text-[#7ab898]">
                        {sup.email || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#5a8a72]">
                        Expertise
                      </label>
                      <p className="text-sm text-[#7ab898]">
                        {Array.isArray(sup?.experties)
                          ? sup.experties.join(", ")
                          : sup?.experties || "-"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenRequest(sup)}
                    className="btn-primary w-full"
                  >
                    Request Supervisor
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {showRequestModal && selectedSupervisor && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="card-title">Request Supervision</h3>
                <button
                  className="text-[#5a8a72] hover:text-[#c8f5e0]"
                  onClick={() => {
                    setShowRequestModal(false);
                    setSelectedSupervisor(null);
                    setRequestMessage("");
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#0c1210] rounded-xl border border-[rgba(0,229,96,0.15)]">
                  <p className="text-sm text-[#c8f5e0]">
                    {selectedSupervisor?.name}
                  </p>
                </div>
                <div>
                  <label className="label">Message to Supervisor</label>
                  <textarea
                    className="input min-h-[120px]"
                    required
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder="Introduce yourself and explain why you'd like this professor to supervise your project..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-[rgba(0,229,96,0.15)]">
                  <button
                    onClick={() => {
                      setShowRequestModal(false);
                      setSelectedSupervisor(null);
                      setRequestMessage("");
                    }}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitRequest}
                    className="btn-primary"
                    disabled={!requestMessage.trim()}
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorPage;
