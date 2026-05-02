import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDeadline } from "../../store/slices/deadlineSlice";
import { X } from "lucide-react";
import { getAllProjects } from "../../store/slices/adminSlice";
const DeadlinesPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    projectTitle: "",
    studentName: "",
    supervisor: "",
    deadlineDate: "",
    description: "",
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [query, setQuery] = useState("");

  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.admin);

  const [viewProjects, setViewProjects] = useState(projects || []);
  useEffect(() => {
    setViewProjects(projects || []);
  }, [projects]);

  const projectRows = useMemo(() => {
    return (viewProjects || []).map((p) => ({
      _id: p._id,
      title: p.title,
      studentName: p.student?.name || "-",
      studentEmail: p.student?.email || "-",
      studentDept: p.student?.department || "-",
      supervisor: p.supervisor?.name || "-",
      deadline: p.deadline
        ? new Date(p.deadline).toISOString().slice(0, 10)
        : "-",
      updatedAt: p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "-",
      raw: p,
    }));
  }, [viewProjects]);

  const filteredProjects = projectRows.filter((row) => {
    const matchesSearch =
      (row.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (row.studentName || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject || !formData.deadlineDate) return;

    let deadlineData = {
      name: selectedProject?.student?.name,
      dueDate: formData.deadlineDate,
      project: selectedProject?._id,
    };

    try {
      const updated = await dispatch(
        createDeadline({ id: selectedProject._id, data: deadlineData }),
      ).unwrap();

      const updatedProject = updated;

      if (updatedProject?._id) {
        setViewProjects((prev) =>
          prev.map((p) =>
            p._id === updatedProject._id ? { ...p, ...updatedProject } : p,
          ),
        );
      }
    } finally {
      setShowModal(false);
      setFormData({
        projectTitle: "",
        studentName: "",
        supervisor: "",
        deadlineDate: "",
        description: "",
      });
      setSelectedProject(null);
      setQuery("");
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="card">
          <div className="card-header flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="card-title">Manage Deadlines</h1>
              <p className="card-subtitle">
                Create and monitor project deadlines
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary mt-4 md:mt-0"
            >
              Create/Update Deadline
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="label">Search Deadlines</label>
              <input
                type="text"
                placeholder="Search by project or student..."
                className="input w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Project Deadlines</h2>
          </div>
          <div className="overflow-y-auto">
            <table className="w-full">
              <thead className="bg-[#0c1210]">
                <tr>
                  <th className="table-header-cell">Student</th>
                  <th className="table-header-cell">Project Title</th>
                  <th className="table-header-cell">Supervisor</th>
                  <th className="table-header-cell">Deadline</th>
                  <th className="table-header-cell">Updated</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[rgba(0,229,96,0.08)]">
                {filteredProjects.map((row) => {
                  return (
                    <tr
                      key={row._id}
                      className="hover:bg-[rgba(0,229,96,0.04)]"
                    >
                      <td className="table-cell whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-[#c8f5e0]">
                            {row.studentName}
                          </div>
                          <div className="text-xs text-[#5a8a72] mt-0.5">
                            {row.studentEmail}
                          </div>
                        </div>
                      </td>
                      <td className="table-cell text-[#c8f5e0]">{row.title}</td>
                      <td className="table-cell whitespace-nowrap">
                        {row.supervisor !== "-" ? (
                          <span className="badge badge-approved">
                            {row.supervisor}
                          </span>
                        ) : (
                          <span className="badge badge-rejected">
                            Not Assigned
                          </span>
                        )}
                      </td>
                      <td className="table-cell text-[#7ab898]">
                        {row.deadline}
                      </td>
                      <td className="table-cell text-[#7ab898]">
                        {row.updatedAt}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-8 text-[#5a8a72] text-sm">
              No projects found matching your criteria.
            </div>
          )}
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content p-6 w-full max-w-3xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="card-title">Create or Update Deadline</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[#5a8a72] hover:text-[#c8f5e0]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Project Title</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Start typing to search projects..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSelectedProject(null);
                      setFormData({
                        ...formData,
                        projectTitle: e.target.value,
                      });
                    }}
                  />
                  {query && !selectedProject && (
                    <div className="mt-2 border border-[rgba(0,229,96,0.15)] rounded-xl max-h-56 overflow-y-auto bg-[#0c1210]">
                      {(projects || [])
                        .filter((p) =>
                          (p.title || "")
                            .toLowerCase()
                            .includes(query.toLowerCase()),
                        )
                        .slice(0, 8)
                        .map((p) => (
                          <button
                            type="button"
                            key={p._id}
                            className="w-full text-left px-4 py-3 hover:bg-[rgba(0,229,96,0.08)] border-b border-[rgba(0,229,96,0.08)] last:border-b-0"
                            onClick={() => {
                              setSelectedProject(p);
                              setQuery(p.title);
                              setFormData({
                                ...formData,
                                projectTitle: p.title,
                                deadlineDate: p.deadline
                                  ? new Date(p.deadline)
                                      .toISOString()
                                      .slice(0, 10)
                                  : "",
                              });
                            }}
                            title={p.title}
                          >
                            <div className="text-sm font-medium text-[#c8f5e0] truncate">
                              {p.title}
                            </div>
                            <div className="text-xs text-[#5a8a72] truncate mt-0.5">
                              {p.student?.name || "-"}{" "}
                              {p.supervisor?.name || "-"}
                            </div>
                          </button>
                        ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="label">Deadline</label>
                  <input
                    type="date"
                    className="input w-full"
                    disabled={!selectedProject}
                    value={formData.deadlineDate}
                    onChange={(e) =>
                      setFormData({ ...formData, deadlineDate: e.target.value })
                    }
                  />
                </div>

                {selectedProject && (
                  <div className="mt-4 border border-[rgba(0,229,96,0.15)] rounded-xl p-4 bg-[#0c1210]">
                    <div className="mb-3">
                      <div className="text-sm font-semibold text-[#c8f5e0] mb-1">
                        Project Details
                      </div>
                      <div
                        className="text-sm text-[#7ab898]"
                        title={selectedProject.description || ""}
                      >
                        {(selectedProject.description || "").length > 160
                          ? `${selectedProject.description.slice(0, 160)}...`
                          : selectedProject.description || "No description"}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-[#5a8a72]">Status</div>
                        <div className="text-sm font-medium text-[#c8f5e0] mt-0.5">
                          {selectedProject.status || "Unknown"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[#5a8a72]">Supervisor</div>
                        <div className="text-sm font-medium text-[#c8f5e0] mt-0.5">
                          {selectedProject.supervisor?.name || "Unknown"}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-xs text-[#5a8a72]">Student</div>
                        <div className="text-sm font-medium text-[#c8f5e0] mt-0.5">
                          {selectedProject.student?.name || "-"} -{" "}
                          {selectedProject.student?.email || "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Save Deadline
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DeadlinesPage;
