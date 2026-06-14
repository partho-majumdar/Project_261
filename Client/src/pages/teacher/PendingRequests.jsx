import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptRequest,
  getTeacherRequests,
  rejectRequest,
} from "../../store/slices/teacherSlice";
import { FileText } from "lucide-react";

const PendingRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loadingMap, setLoadingMap] = useState({});
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.teacher);
  const { authUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getTeacherRequests(authUser._id));
  }, [dispatch, authUser._id]);

  const setLoading = (id, key, value) => {
    setLoadingMap((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [key]: value },
    }));
  };

  const handleAccept = async (requset) => {
    const id = requset._id;
    setLoading(id, "accepting", true);
    try {
      await dispatch(acceptRequest(id)).unwrap();
    } finally {
      setLoading(id, "accepting", false);
    }
  };

  const handleReject = async (requset) => {
    const id = requset._id;
    setLoading(id, "rejecting", true);
    try {
      await dispatch(rejectRequest(id)).unwrap();
    } finally {
      setLoading(id, "rejecting", false);
    }
  };

  const filteredRequests =
    list.filter((request) => {
      const matchesSearch =
        (request?.student?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (request?.latestProject?.title || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || request.status === filterStatus;
      return matchesSearch && matchesStatus;
    }) || [];

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Pending Supervision Requests</h1>
          <p className="card-subtitle">
            Review and respond to student supervision requests
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by student name or project title..."
            className="input flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="input sm:w-48"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredRequests.map((req) => {
          const id = req._id;
          const project = req.latestProject;
          const projectStatus = project?.status?.toLowerCase() || "pending";
          const supervisorAssigned = !!project?.supervisor;
          const canAccept = projectStatus === "approved" && !supervisorAssigned;
          const lm = loadingMap[id] || {};

          let borderClass = "border-[rgba(0,229,96,0.25)]";
          let statusMessage = "";

          if (projectStatus === "approved" && supervisorAssigned) {
            borderClass = "border-[rgba(0,229,96,0.4)]";
            statusMessage = "Supervisor already assigned";
          } else if (projectStatus === "rejected") {
            borderClass = "border-[rgba(244,115,115,0.4)]";
            statusMessage = "Project proposal rejected";
          } else if (projectStatus === "pending") {
            borderClass = "border-[rgba(234,179,8,0.4)]";
            statusMessage = "Project proposal pending";
          }

          return (
            <div key={id} className={`card ${borderClass}`}>
              <div className="flex flex-col lg:flex-row justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-[#c8f5e0]">
                      {req?.student?.name || "Unknown Student"}
                    </h3>
                    <span
                      className={`badge ${
                        req.status === "pending"
                          ? "badge-pending"
                          : req.status === "accepted"
                            ? "badge-approved"
                            : "badge-rejected"
                      }`}
                    >
                      {req.status?.charAt(0).toUpperCase() +
                        req.status?.slice(1)}
                    </span>
                  </div>

                  <p className="text-sm text-[#5a8a72] mb-2">
                    {req?.student?.email || "No email"}
                  </p>
                  <h4 className="font-medium text-[#c8f5e0] mb-2">
                    {project?.title || "No project title"}
                  </h4>
                  <p className="text-xs text-[#5a8a72]">
                    Submitted:{" "}
                    {req?.createdAt
                      ? new Date(req.createdAt).toLocaleDateString()
                      : "-"}
                  </p>

                  {statusMessage && (
                    <p className="mt-2 text-sm font-medium text-[#7ab898]">
                      {statusMessage}
                    </p>
                  )}
                </div>

                {req.status === "pending" && (
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      className={`px-4 py-1.5 text-sm rounded-lg font-medium disabled:cursor-not-allowed disabled:opacity-60 ${
                        canAccept
                          ? "btn-secondary"
                          : "bg-[rgba(0,229,96,0.08)] text-[#5a8a72] cursor-not-allowed"
                      }`}
                      disabled={lm.accepting || !canAccept}
                      onClick={() => handleAccept(req)}
                    >
                      {lm.accepting ? "Accepting" : "Accept"}
                    </button>

                    <button
                      className="btn-danger px-4 py-1.5 text-sm rounded-lg disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={lm.rejecting}
                      onClick={() => handleReject(req)}
                    >
                      {lm.rejecting ? "Rejecting" : "Reject"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredRequests.length === 0 && (
          <div className="card text-center py-8">
            <FileText className="w-12 h-12 text-[#2a5a42] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#c8f5e0] mb-2">
              No requests found
            </h3>
            <p className="text-[#5a8a72] text-sm">
              No supervision requests match your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingRequests;
