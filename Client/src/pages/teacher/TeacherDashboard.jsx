import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTeacherDashboardStats } from "../../store/slices/teacherSlice";
import { CheckCircle, Clock, Loader, MoveDiagonal, Users } from "lucide-react";

const TeacherDashboard = () => {
  const dispatch = useDispatch();

  const { dashboardStats, loading } = useSelector((state) => state.teacher);
  const { authUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getTeacherDashboardStats());
  }, [dispatch]);

  const statsCards = [
    {
      title: "Assigned Students",
      value: authUser?.assignedStudents?.length || 0,
      loading,
      Icon: Users,
      iconBg: "bg-[rgba(0,229,96,0.12)]",
      color: "text-[#00e560]",
    },
    {
      title: "Pending Requests",
      value: dashboardStats?.totalPendingRequests || 0,
      loading,
      Icon: Clock,
      iconBg: "bg-[rgba(234,179,8,0.12)]",
      color: "text-yellow-400",
    },
    {
      title: "Completed Projects",
      value: dashboardStats?.completedProjects || 0,
      loading,
      Icon: CheckCircle,
      iconBg: "bg-[rgba(0,229,96,0.12)]",
      color: "text-[#00e560]",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#00e560] to-[#009940] rounded-2xl p-6 text-[#0a0f0d]">
        <h1 className="text-2xl font-bold mb-2">Teacher Dashboard</h1>
        <p className="text-[#0a0f0d]/70">
          Manage your students and provide guidance on their projects.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map(
          ({ title, value, loading, Icon, iconBg, color }, index) => (
            <div key={index} className="card">
              <div className="flex items-center">
                <div className={`p-3 ${iconBg} rounded-xl`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-xs font-medium text-[#5a8a72]">{title}</p>
                  <p className="text-xl font-bold text-[#c8f5e0] mt-0.5">
                    {loading ? "..." : value}
                  </p>
                </div>
              </div>
            </div>
          ),
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Activity</h2>
          <p className="card-subtitle">Latest notifications and updates</p>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader size={32} className="animate-spin text-[#00e560]" />
            </div>
          ) : dashboardStats?.recentNotifications?.length > 0 ? (
            dashboardStats.recentNotifications.map((notification) => (
              <div
                key={notification._id}
                className="flex items-center p-3 bg-[#0c1210] rounded-xl border border-[rgba(0,229,96,0.1)]"
              >
                <div className="p-2 bg-[rgba(0,229,96,0.08)] rounded-lg">
                  <MoveDiagonal className="w-5 h-5 text-[#00e560]" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-[#c8f5e0]">
                    {notification.message}
                  </p>
                  <p className="text-xs text-[#5a8a72] mt-0.5">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-[#5a8a72] text-sm">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
