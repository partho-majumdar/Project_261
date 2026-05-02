import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import AddStudent from "../../components/modal/AddStudent";
import AddTeacher from "../../components/modal/AddTeacher";
import { toast } from "react-toastify";
import {
  getAllProjects,
  getDashboardStats,
} from "../../store/slices/adminSlice";
import { getNotifications } from "../../store/slices/notificationSlice";
import { downloadProjectFile } from "../../store/slices/projectSlice";
import {
  AlertCircle,
  AlertTriangle,
  Box,
  FileTextIcon,
  Folder,
  PlusIcon,
  User,
  X,
} from "lucide-react";
import {
  toggleStudentModal,
  toggleTeacherModal,
} from "../../store/slices/popupSlice";

const AdminDashboard = () => {
  const { isCreateStudentModalOpen, isCreateTeacherModalOpen } = useSelector(
    (state) => state.popup,
  );

  const { stats, projects } = useSelector((state) => state.admin);
  const notifications = useSelector((state) => state.notification.list);

  const dispatch = useDispatch();

  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [reportSearch, setReportSearch] = useState("");

  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(getNotifications());
    dispatch(getAllProjects());
  }, [dispatch]);

  const nearingDeadlines = useMemo(() => {
    const now = new Date();
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    return (projects || []).filter((p) => {
      if (!p.deadline) return false;
      const d = new Date(p.deadline);
      return d >= now && d.getTime() - now.getTime() <= threeDays;
    }).length;
  }, [projects]);

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

  console.log(projects);
  console.log(files);

  const filteredFiles = files.filter(
    (f) =>
      (f.originalName || "")
        .toLowerCase()
        .includes(reportSearch.toLowerCase()) ||
      (f.projectTitle || "")
        .toLowerCase()
        .includes(reportSearch.toLowerCase()) ||
      (f.studentName || "").toLowerCase().includes(reportSearch.toLowerCase()),
  );

  const handleDownload = async (projectId, fileId, name) => {
    const res = await dispatch(downloadProjectFile({ projectId, fileId })).then(
      (res) => {
        const { blob } = res.payload;
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", name || "download");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
    );
  };

  const supervisorsBucket = useMemo(() => {
    const map = new Map();
    (projects || []).forEach((p) => {
      if (!p?.supervisor?.name) return;
      const name = p.supervisor.name;
      map.set(name, (map.get(name) || 0) + 1);
    });
    const arr = Array.from(map.entries()).map(([name, count]) => ({
      name,
      count,
    }));
    arr.sort((a, b) => b.count - a.count);
    return arr;
  }, [projects]);

  const latestNotifications = useMemo(
    () => (notifications || []).slice(0, 6),
    [notifications],
  );

  const getBulletColor = (type, priority) => {
    const t = (type || "").toLowerCase();
    const p = (priority || "").toLowerCase();
    if (p === "high" && (t === "rejection" || t === "reject"))
      return "bg-red-500";
    if (p === "medium" && (t === "deadline" || t === "due"))
      return "bg-yellow-500";
    if (p === "high") return "bg-red-500";
    if (p === "medium") return "bg-yellow-500";
    if (p === "low") return "bg-[#5a8a72]";
    if (t === "approval" || t === "approved") return "bg-[#00e560]";
    if (t === "request") return "bg-[#00e560]";
    if (t === "feedback") return "bg-[#7ab898]";
    if (t === "meeting") return "bg-[#00e560]";
    if (t === "system") return "bg-[#5a8a72]";
    return "bg-[#5a8a72]";
  };

  const getBadgeClasses = (kind, value) => {
    const v = (value || "").toLowerCase();
    if (kind === "type") {
      if (["rejection", "reject"].includes(v))
        return "bg-[rgba(244,115,115,0.12)] text-[#f47373] border border-[rgba(244,115,115,0.25)]";
      if (["approval", "approved"].includes(v))
        return "bg-[rgba(0,229,96,0.12)] text-[#00e560] border border-[rgba(0,229,96,0.25)]";
      if (["deadline", "due"].includes(v))
        return "bg-[rgba(234,179,8,0.12)] text-yellow-400 border border-[rgba(234,179,8,0.25)]";
      if (v === "request")
        return "bg-[rgba(0,229,96,0.08)] text-[#7ab898] border border-[rgba(0,229,96,0.2)]";
      if (v === "feedback")
        return "bg-[rgba(122,184,152,0.12)] text-[#7ab898] border border-[rgba(122,184,152,0.25)]";
      if (v === "meeting")
        return "bg-[rgba(0,229,96,0.08)] text-[#00e560] border border-[rgba(0,229,96,0.2)]";
      if (v === "system")
        return "bg-[rgba(90,138,114,0.12)] text-[#5a8a72] border border-[rgba(90,138,114,0.25)]";
      return "bg-[rgba(90,138,114,0.1)] text-[#5a8a72] border border-[rgba(90,138,114,0.2)]";
    }
    if (v === "high")
      return "bg-[rgba(244,115,115,0.12)] text-[#f47373] border border-[rgba(244,115,115,0.25)]";
    if (v === "medium")
      return "bg-[rgba(234,179,8,0.12)] text-yellow-400 border border-[rgba(234,179,8,0.25)]";
    if (v === "low")
      return "bg-[rgba(90,138,114,0.12)] text-[#5a8a72] border border-[rgba(90,138,114,0.25)]";
    return "bg-[rgba(90,138,114,0.1)] text-[#5a8a72]";
  };

  const dashboardStats = [
    {
      title: "Total Students",
      value: stats?.totalStudents ?? 0,
      iconBg: "bg-[rgba(0,229,96,0.12)]",
      iconColor: "text-[#00e560]",
      border: "border-[rgba(0,229,96,0.25)]",
      Icon: User,
    },
    {
      title: "Total Teachers",
      value: stats?.totalTeachers ?? 0,
      iconBg: "bg-[rgba(0,229,96,0.12)]",
      iconColor: "text-[#00e560]",
      border: "border-[rgba(0,229,96,0.25)]",
      Icon: Box,
    },
    {
      title: "Pending Requests",
      value: stats?.pendingRequests ?? 0,
      iconBg: "bg-[rgba(234,179,8,0.12)]",
      iconColor: "text-yellow-400",
      border: "border-[rgba(234,179,8,0.2)]",
      Icon: AlertCircle,
    },
    {
      title: "Active Projects",
      value: stats?.totalProjects ?? 0,
      iconBg: "bg-[rgba(0,229,96,0.12)]",
      iconColor: "text-[#00e560]",
      border: "border-[rgba(0,229,96,0.25)]",
      Icon: Folder,
    },
    {
      title: "Nearing Deadlines",
      value: nearingDeadlines,
      iconBg: "bg-[rgba(244,115,115,0.12)]",
      iconColor: "text-[#f47373]",
      border: "border-[rgba(244,115,115,0.2)]",
      Icon: AlertTriangle,
    },
  ];

  const actionButtons = [
    {
      label: "Add Student",
      onClick: () => dispatch(toggleStudentModal()),
      btnClass: "btn-primary",
      Icon: PlusIcon,
    },
    {
      label: "Add Teacher",
      onClick: () => dispatch(toggleTeacherModal()),
      btnClass: "btn-secondary",
      Icon: PlusIcon,
    },
    {
      label: "View Reports",
      onClick: () => setIsReportsModalOpen(true),
      btnClass: "btn-outline",
      Icon: FileTextIcon,
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-2xl border border-[rgba(0,229,96,0.25)] bg-[#111a15] p-6">
          <div className="bg-grid absolute inset-0 opacity-50" />
          <div className="bg-glow absolute inset-0" />
          <div className="relative z-10">
            <h1 className="text-1xl font-bold text-[#c8f5e0] mb-1">Admin Dashboard</h1>
            <p className="text-[#5a8a72]">
              Manage the entire project management system and oversee all
              activities.
            </p>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {dashboardStats.map((item, i) => (
            <div
              key={i}
              className={`bg-[#111a15] rounded-2xl p-4 border ${item.border} flex items-center gap-3`}
            >
              <div className={`p-2 rounded-xl ${item.iconBg} flex-shrink-0`}>
                <item.Icon className={`w-5 h-5 ${item.iconColor}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-[#5a8a72] leading-tight">
                  {item.title}
                </p>
                <p className="text-xl font-bold text-[#c8f5e0] mt-0.5">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CHARTS & ACTIVITY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vertical Bar Chart */}
          <div className="lg:col-span-2 card">
            <div className="card-header">
              <h3 className="card-title">Project Distribution by Supervisor</h3>
            </div>
            <div className="p-4">
              {supervisorsBucket.length === 0 ? (
                <div className="h-64 flex items-center justify-center bg-[#0c1210] rounded-xl text-[#5a8a72] text-sm">
                  No data
                </div>
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width={"100%"} height={"100%"}>
                    <BarChart
                      data={supervisorsBucket}
                      margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                      barCategoryGap={"20%"}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(0,229,96,0.08)"
                      />
                      <XAxis
                        dataKey={"name"}
                        tick={{ fontSize: 12, fill: "#7ab898" }}
                        axisLine={{ stroke: "rgba(0,229,96,0.15)" }}
                        tickLine={{ stroke: "rgba(0,229,96,0.15)" }}
                        interval={0}
                        height={50}
                        dy={10}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 12, fill: "#7ab898" }}
                        axisLine={{ stroke: "rgba(0,229,96,0.15)" }}
                        tickLine={{ stroke: "rgba(0,229,96,0.15)" }}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(0,229,96,0.04)" }}
                        contentStyle={{
                          borderRadius: 12,
                          borderColor: "rgba(0,229,96,0.25)",
                          backgroundColor: "#111a15",
                          color: "#c8f5e0",
                        }}
                        formatter={(value, name) => [
                          value,
                          name === "count" ? "Projects Assigned" : name,
                        ]}
                        labelFormatter={(label) => `Supervisor: ${label}`}
                      />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {supervisorsBucket.map((entry, index) => {
                          const colors = [
                            "#00e560",
                            "#00b84a",
                            "#009940",
                            "#007a32",
                            "#005c26",
                          ];
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={colors[index % colors.length]}
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {latestNotifications.map((n) => (
                <div key={n._id} className="flex items-start text-sm gap-3">
                  <div
                    className={`mt-1.5 w-2 h-2 flex-shrink-0 ${getBulletColor(
                      n.type,
                      n.priority,
                    )} rounded-full`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#c8f5e0] leading-snug">
                      {n.message}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getBadgeClasses(
                          "type",
                          n.type,
                        )} capitalize`}
                      >
                        {n.type}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${getBadgeClasses(
                          "priority",
                          n.priority,
                        )}`}
                      >
                        {n.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {latestNotifications.length === 0 && (
                <div className="text-[#5a8a72] text-sm">
                  No recent notifications
                </div>
              )}
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {actionButtons.map((btn, index) => (
              <button
                key={index}
                className={`${btn.btnClass} flex items-center justify-center space-x-2`}
                onClick={btn.onClick}
              >
                <btn.Icon className="w-5 h-5" />
                <span>{btn.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* REPORTS MODAL */}
        {isReportsModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content max-w-3xl max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-[rgba(0,229,96,0.15)]">
                <h3 className="text-lg font-bold text-[#c8f5e0]">All Files</h3>
                <button
                  onClick={() => setIsReportsModalOpen(false)}
                  className="text-[#5a8a72] hover:text-[#00e560] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 pb-3">
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Search by file name, project title, or student name"
                  value={reportSearch}
                  onChange={(e) => setReportSearch(e.target.value)}
                />
              </div>

              <div className="overflow-y-auto px-6 pb-6 flex-1">
                {filteredFiles.length === 0 ? (
                  <div className="text-[#5a8a72] text-sm">No files found.</div>
                ) : (
                  <div className="space-y-2">
                    {filteredFiles.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-[#0c1210] rounded-xl border border-[rgba(0,229,96,0.1)]"
                      >
                        <div>
                          <div className="font-medium text-[#c8f5e0] text-sm">
                            {f.originalName}
                          </div>
                          <div className="text-xs text-[#5a8a72] mt-0.5">
                            {f.projectTitle} — {f.studentName}
                          </div>
                        </div>
                        <button
                          className="btn-outline btn-small"
                          onClick={() =>
                            handleDownload(
                              f.projectId,
                              f.fileId,
                              f.originalName,
                            )
                          }
                        >
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {isCreateStudentModalOpen && <AddStudent />}
        {isCreateTeacherModalOpen && <AddTeacher />}
      </div>
    </>
  );
};

export default AdminDashboard;
