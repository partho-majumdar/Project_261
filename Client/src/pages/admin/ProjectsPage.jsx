import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  approveProject,
  getAllProjects,
  getProject,
  rejectProject,
} from "../../store/slices/adminSlice";
import { AlertTriangle, CheckCircle2, FileDown, Folder, X } from "lucide-react";
import { downloadProjectFile } from "../../store/slices/projectSlice";
const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSupervisor, setFilterSupervisor] = useState("all");
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [reportSearch, setReportSearch] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.admin);

  const supervisors = useMemo(() => {
    const set = new Set(
      projects?.map((p) => p?.supervisor?.name).filter(Boolean),
    );
    return Array.from(set);
  }, [projects]);

  const filteredProjects = projects?.filter((project) => {
    const matchesSearch =
      (project.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.student?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || project.status === filterStatus;
    const matchesSupervisor =
      filterSupervisor === "all" ||
      project.supervisor?.name === filterSupervisor;
    return matchesSearch && matchesStatus && matchesSupervisor;
  });

  const files = useMemo(() => {
    return (projects || []).flatMap((p) =>
      (p.files || []).map((f) => ({
        projectId: p._id,
        fileId: f._id,
        originalName: f.originalName,
        uploadedAt: f.uploadedAt,
        projectTitle: p.title,
        studentName: p.student?.name,
      })),
    );
  }, [projects]);

  const filteredFiles = files?.filter(
    (file) =>
      (file.originalName || "")
        .toLowerCase()
        .includes(reportSearch.toLowerCase()) ||
      (file.projectTitle || "")
        .toLowerCase()
        .includes(reportSearch.toLowerCase()) ||
      (file.studentName || "")
        .toLowerCase()
        .includes(reportSearch.toLowerCase()),
  );

  const handleDownloadFile = async (file) => {
    const res = await dispatch(
      downloadProjectFile({ projectId: file.projectId, fileId: file.fileId }),
    ).then((res) => {
      const { blob } = res.payload;
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.originalName || "download");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "badge badge-completed";
      case "approved":
        return "badge badge-approved";
      case "pending":
        return "badge badge-pending";
      case "rejected":
        return "badge badge-rejected";
      default:
        return "badge";
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    if (newStatus === "approved") {
      dispatch(approveProject(projectId));
    } else if (newStatus === "rejected") {
      dispatch(rejectProject(projectId));
    }
  };

  const projectStats = [
    {
      title: "Total Projects",
      value: projects.length,
      iconBg: "bg-[rgba(0,229,96,0.12)]",
      iconColor: "text-[#00e560]",
      border: "border-[rgba(0,229,96,0.25)]",
      Icon: Folder,
    },
    {
      title: "Pending Review",
      value: projects.filter((p) => p.status === "pending").length,
      iconBg: "bg-[rgba(234,179,8,0.12)]",
      iconColor: "text-yellow-400",
      border: "border-[rgba(234,179,8,0.25)]",
      Icon: AlertTriangle,
    },
    {
      title: "Completed",
      value: projects.filter((p) => p.status === "completed").length,
      iconBg: "bg-[rgba(0,229,96,0.12)]",
      iconColor: "text-[#00e560]",
      border: "border-[rgba(0,229,96,0.25)]",
      Icon: CheckCircle2,
    },
    {
      title: "Rejected",
      value: projects.filter((p) => p.status === "rejected").length,
      iconBg: "bg-[rgba(244,115,115,0.12)]",
      iconColor: "text-[#f47373]",
      border: "border-[rgba(244,115,115,0.2)]",
      Icon: X,
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="card">
          <div className="card-header flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="card-title">All Projects</h1>
              <p className="card-subtitle">
                View and manage all student projects across the platform.
              </p>
            </div>

            <button
              onClick={() => setIsReportsOpen(true)}
              className="btn-primary flex items-center space-x-2 mt-4 md:mt-0"
            >
              <FileDown className="w-5 h-5" />
              <span>Download Reports</span>
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {projectStats.map((item, index) => {
            return (
              <div key={index} className={`card ${item.border}`}>
                <div className="flex items-center">
                  <div className={`p-3 ${item.iconBg} rounded-xl`}>
                    <item.Icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-xs font-medium text-[#5a8a72]">
                      {item.title}
                    </p>
                    <p className="text-xl font-bold text-[#c8f5e0] mt-0.5">
                      {item.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FILTERS */}
        <div className="card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="label">Search Projects</label>
              <input
                type="text"
                className="input w-full"
                placeholder="Search by project title or student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Filter by Status</label>
              <select
                className="input w-full"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Projects</option>
                <option value="pending">Pending Projects</option>
                <option value="approved">Approved Projects</option>
                <option value="completed">Completed Projects</option>
                <option value="rejected">Rejected Projects</option>
              </select>
            </div>

            <div>
              <label className="label">Filter Supervisor</label>
              <select
                className="input w-full"
                value={filterSupervisor}
                onChange={(e) => setFilterSupervisor(e.target.value)}
              >
                <option value="all">All Supervisors</option>
                {supervisors.map((supervisor) => {
                  return (
                    <option key={supervisor} value={supervisor}>
                      {supervisor}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        {/* PROJECTS TABLE */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Projects Overview</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0c1210]">
                <tr>
                  <th className="table-header-cell">Project Details</th>
                  <th className="table-header-cell">Student</th>
                  <th className="table-header-cell">Supervisor</th>
                  <th className="table-header-cell">Deadline</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(0,229,96,0.08)]">
                {filteredProjects.map((project) => (
                  <tr
                    key={project._id}
                    className="hover:bg-[rgba(0,229,96,0.04)]"
                  >
                    <td className="table-cell">
                      <div>
                        <div className="text-sm font-medium text-[#c8f5e0]">
                          {project.title}
                        </div>
                        <div className="text-sm text-[#5a8a72] max-w-xs truncate mt-0.5">
                          {project.description}
                        </div>
                        <div className="text-xs text-[#7ab898] mt-0.5">
                          Due:{" "}
                          {project.deadline && project.deadline.split("T")[0]}
                        </div>
                      </div>
                    </td>

                    <td className="table-cell whitespace-nowrap">
                      <div className="text-sm font-medium text-[#c8f5e0]">
                        {project?.student?.name}
                      </div>
                      <div className="text-xs text-[#5a8a72] mt-0.5">
                        Last Update:{" "}
                        {project?.updatedAt
                          ? new Date(project?.updatedAt).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </td>

                    <td className="table-cell whitespace-nowrap">
                      {project.supervisor?.name ? (
                        <span className="badge badge-approved">
                          {project.supervisor?.name}
                        </span>
                      ) : (
                        <span className="badge badge-rejected">Unassigned</span>
                      )}
                    </td>

                    <td className="table-cell whitespace-nowrap text-[#7ab898]">
                      {project.deadline
                        ? new Date(project.deadline).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="table-cell whitespace-nowrap">
                      <span className={getStatusColor(project.status)}>
                        {project.status}
                      </span>
                    </td>

                    <td className="table-cell whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={async () => {
                            const res = await dispatch(getProject(project._id));
                            if (!getProject.fulfilled.match(res)) return;
                            const detail = res.payload?.project || res.payload;
                            setCurrentProject(detail);
                            setShowViewModal(true);
                          }}
                          className="btn-primary btn-small"
                        >
                          View
                        </button>
                        {project.status === "pending" && (
                          <>
                            <button
                              className="btn-secondary btn-small"
                              onClick={() =>
                                handleStatusChange(project._id, "approved")
                              }
                            >
                              Approve
                            </button>
                            <button
                              className="btn-danger btn-small"
                              onClick={() =>
                                handleStatusChange(project._id, "rejected")
                              }
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-8 text-[#5a8a72] text-sm">
              No projects found matching your criteria.
            </div>
          )}
        </div>

        {/* VIEW MODAL */}
        {showViewModal && currentProject && (
          <div className="modal-overlay">
            <div className="modal-content p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="card-title">Project Details</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-[#5a8a72] hover:text-[#c8f5e0]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label">Title</label>
                  <div className="input bg-[#0c1210]">
                    {currentProject?.title || "-"}
                  </div>
                </div>
                <div>
                  <label className="label">Description</label>
                  <div className="input bg-[#0c1210] min-h-[80px]">
                    {currentProject?.description || "-"}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Student</label>
                    <div className="input bg-[#0c1210]">
                      {currentProject?.student?.name || "-"}
                    </div>
                  </div>
                  <div>
                    <label className="label">Supervisor</label>
                    <div className="input bg-[#0c1210]">
                      {currentProject?.supervisor?.name || "-"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Status</label>
                    <div className="input bg-[#0c1210] capitalize">
                      {currentProject?.status}
                    </div>
                  </div>
                  <div>
                    <label className="label">Deadline</label>
                    <div className="input bg-[#0c1210]">
                      {currentProject?.deadline
                        ? new Date(currentProject.deadline).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="label">Files</label>
                  {(currentProject.files || []).length === 0 ? (
                    <div className="text-[#5a8a72] text-sm">
                      No files uploaded
                    </div>
                  ) : (
                    <ul className="list-disc list-inside text-sm text-[#c8f5e0] space-y-1">
                      {currentProject.files.map((file) => (
                        <li key={file._id || file.fileUrl}>
                          {file.originalName}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REPORTS MODAL */}
        {isReportsOpen && (
          <div className="modal-overlay">
            <div className="modal-content p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="card-title">All Files</h3>
                <button
                  onClick={() => setIsReportsOpen(false)}
                  className="text-[#5a8a72] hover:text-[#c8f5e0]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Search by file name, project title or student name"
                  value={reportSearch}
                  onChange={(e) => setReportSearch(e.target.value)}
                />
              </div>

              {filteredFiles.length === 0 ? (
                <div className="text-[#5a8a72] text-sm">No files found.</div>
              ) : (
                <div className="space-y-2">
                  {filteredFiles.map((f) => {
                    return (
                      <div
                        key={`${f.projectId}-${f.fileId}`}
                        className="flex items-center justify-between p-3 bg-[#0c1210] rounded-xl border border-[rgba(0,229,96,0.15)]"
                      >
                        <div>
                          <div className="font-medium text-[#c8f5e0] text-sm">
                            {f.originalName}
                          </div>
                          <div className="text-xs text-[#5a8a72] mt-0.5">
                            {f.projectTitle} - {f.studentName}
                          </div>
                        </div>
                        <button
                          className="btn-outline btn-small"
                          onClick={() => handleDownloadFile(f)}
                        >
                          Download
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectsPage;
