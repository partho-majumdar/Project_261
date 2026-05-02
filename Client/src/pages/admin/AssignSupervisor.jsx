import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  assignSupervisor as assignSupervisorThunk,
  getAllProjects,
  getAllUsers,
} from "../../store/slices/adminSlice";
import { AlertTriangle, CheckCircle, Users } from "lucide-react";

const AssignSupervisor = () => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedSupervisor, setSelectedSupervisor] = useState({});

  const { users, projects } = useSelector((state) => state.admin);

  useEffect(() => {
    if (!users || users.length === 0) {
      dispatch(getAllUsers());
    }
  }, [dispatch]);

  const teachers = useMemo(() => {
    const teacherUsers = (users || []).filter(
      (u) => (u.role || "").toLowerCase() === "teacher",
    );
    return teacherUsers.map((t) => ({
      ...t,
      assignedCount: Array.isArray(t.assignedStudents)
        ? t.assignedStudents.length
        : 0,
      capacityLeft:
        (typeof t.maxStudents === "number" ? t.maxStudents : 0) -
        (Array.isArray(t.assignedStudents) ? t.assignedStudents.length : 0),
    }));
  }, [users]);

  const studentProjects = useMemo(() => {
    return (projects || [])
      .filter((p) => !!p.student?._id)
      .map((p) => ({
        projectId: p._id,
        title: p.title,
        status: p.status,
        supervisor: p.supervisor?.name || null,
        supervisorId: p.supervisor?._id || null,
        studentId: p.student?._id || "Unknown",
        studentName: p.student?.name || "-",
        studentEmail: p.student?.email || "-",
        deadline: p.deadline
          ? new Date(p.deadline).toISOString().slice(0, 10)
          : "-",
        updatedAt: p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "-",
        isApproved: p.status === "approved",
      }));
  }, [projects]);

  console.log(studentProjects);

  const filtered = studentProjects.filter((row) => {
    const matchesSearch =
      (row.studentName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (row.title || "").toLowerCase().includes(searchTerm.toLowerCase());

    const status = row.supervisor ? "assigned" : "unassigned";
    const matchesFilter = filterStatus === "all" || status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const [pendingFor, setPendingFor] = useState(null);

  const handleSupervisorSelect = (projectId, supervisorId) => {
    setSelectedSupervisor((prev) => ({
      ...prev,
      [projectId]: supervisorId,
    }));
  };

  const handleAssign = async (studentId, projectStatus, projectId) => {
    const supervisorId = selectedSupervisor[projectId];
    if (!studentId || !supervisorId) {
      toast.error("Please select a supervisor first");
      return;
    }
    if (projectStatus === "rejected") {
      toast.error("Cannot assign supervisor to a rejected project");
      return;
    }
    setPendingFor(projectId);
    const res = await dispatch(
      assignSupervisorThunk({ studentId, supervisorId }),
    );
    setPendingFor(null);

    if (assignSupervisorThunk.fulfilled.match(res)) {
      setSelectedSupervisor((prev) => {
        const newState = { ...prev };
        delete newState[projectId];
        return newState;
      });
      dispatch(getAllUsers());
    } else {
      toast.error("Failed to assign supervisor");
    }
  };

  const dashboardCards = [
    {
      title: "Assigned Students",
      value: studentProjects.filter((r) => !!r.supervisor).length,
      icon: CheckCircle,
      iconBg: "bg-[rgba(0,229,96,0.12)]",
      color: "text-[#00e560]",
      border: "border-[rgba(0,229,96,0.25)]",
    },
    {
      title: "Unassigned Students",
      value: studentProjects.filter((r) => !r.supervisor).length,
      icon: AlertTriangle,
      iconBg: "bg-[rgba(244,115,115,0.12)]",
      color: "text-[#f47373]",
      border: "border-[rgba(244,115,115,0.2)]",
    },
    {
      title: "Available Teachers",
      value: teachers.filter(
        (t) => (t.assignedCount ?? 0) < (t.maxStudents ?? 0),
      ).length,
      icon: Users,
      iconBg: "bg-[rgba(0,229,96,0.08)]",
      color: "text-[#7ab898]",
      border: "border-[rgba(0,229,96,0.15)]",
    },
  ];

  const headers = [
    "Student",
    "Project Title",
    "Supervisor",
    "Deadline",
    "Updated",
    "Assign Supervisor",
    "Actions",
  ];

  const Badge = ({ color, children }) => (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${color}`}
    >
      {children}
    </span>
  );

  return (
    <>
      <div className="space-y-6">
        {/* HEADER CARD */}
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">Assign Supervisor</h1>
            <p className="card-subtitle">
              Manage supervisor assignments for students and projects
            </p>
          </div>
        </div>

        {/* FILTER */}
        <div className="card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="label">Search Students</label>
              <input
                type="text"
                placeholder="Search by student name or project title..."
                className="input w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <label className="label">Filter Status</label>
              <select
                className="input w-full"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Students</option>
                <option value="assigned">Assigned</option>
                <option value="unassigned">Unassigned</option>
              </select>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Student Assignments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0c1210]">
                <tr>
                  {headers.map((h) => (
                    <th key={h} className="table-header-cell">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(0,229,96,0.08)]">
                {filtered.map((row) => (
                  <tr
                    key={row.projectId}
                    className="hover:bg-[rgba(0,229,96,0.04)] transition-colors"
                  >
                    <td className="table-cell whitespace-nowrap">
                      <div className="text-sm font-medium text-[#c8f5e0]">
                        {row.studentName}
                      </div>
                      <div className="text-xs text-[#5a8a72] mt-0.5">
                        {row.studentEmail}
                      </div>
                    </td>

                    <td className="table-cell text-[#c8f5e0]">{row.title}</td>

                    <td className="table-cell whitespace-nowrap">
                      {row.supervisor !== null ? (
                        <Badge
                          color="bg-[rgba(0,229,96,0.12)] text-[#00e560] border border-[rgba(0,229,96,0.25)]"
                          children={row.supervisor}
                        />
                      ) : (
                        <Badge
                          color="bg-[rgba(244,115,115,0.12)] text-[#f47373] border border-[rgba(244,115,115,0.25)]"
                          children={
                            row.status === "rejected"
                              ? "Rejected"
                              : "Not Assigned"
                          }
                        />
                      )}
                    </td>

                    <td className="table-cell text-[#7ab898]">
                      {row.deadline}
                    </td>
                    <td className="table-cell text-[#7ab898]">
                      {row.updatedAt}
                    </td>

                    <td className="table-cell whitespace-nowrap">
                      <select
                        className="input w-full"
                        value={selectedSupervisor[row.projectId] || ""}
                        disabled={
                          !!row.supervisor ||
                          row.status === "rejected" ||
                          !row.isApproved
                        }
                        onChange={(e) =>
                          handleSupervisorSelect(row.projectId, e.target.value)
                        }
                      >
                        <option value="" disabled>
                          Select Supervisor
                        </option>
                        {teachers
                          .filter((t) => t.capacityLeft > 0)
                          .map((t) => (
                            <option value={t._id} key={t._id}>
                              {t.name} ({t.capacityLeft} slots left)
                            </option>
                          ))}
                      </select>
                    </td>

                    <td className="table-cell whitespace-nowrap">
                      <button
                        className="btn-primary text-sm w-40"
                        onClick={() =>
                          handleAssign(row.studentId, row.status, row.projectId)
                        }
                        disabled={
                          pendingFor === row.projectId ||
                          !!row.supervisor ||
                          row.status === "rejected" ||
                          !row.isApproved ||
                          !selectedSupervisor[row.projectId]
                        }
                      >
                        {pendingFor === row.projectId
                          ? "Assigning..."
                          : row.supervisor
                            ? "Assigned"
                            : row.status === "rejected"
                              ? "Rejected"
                              : !row.isApproved
                                ? "Not Approved"
                                : "Assign"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-8 text-[#5a8a72] text-sm">
                No students found matching your criteria
              </div>
            )}
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className={`card border ${card.border}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 ${card.iconBg} rounded-xl`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#5a8a72]">
                      {card.title}
                    </p>
                    <p className="text-xl font-bold text-[#c8f5e0] mt-0.5">
                      {card.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AssignSupervisor;
