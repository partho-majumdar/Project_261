import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../../store/slices/studentSlice";
import { Link } from "react-router-dom";
import { Bell, MessageCircle, MessageCircleWarning } from "lucide-react";


const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const { dashboardStats } = useSelector((state) => state.student);


  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);


  const project = dashboardStats?.project || {};
  const supervisorName = dashboardStats?.supervisorName || "N/A";
  const upcomingDeadlines = dashboardStats?.upcomingDeadlines || [];
  const topNotifications = dashboardStats?.topNotifications || [];
  const feedbackList =
    dashboardStats?.feedbackNotifications?.slice(-2).reverse() || [];


  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };


  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#00e560] to-[#009940] rounded-2xl p-6 text-[#0a0f0d]">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {authUser?.name || "Student"}
        </h1>
        <p className="text-[#0a0f0d]/70">
          Here's your project overview and recent updates.
        </p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-[rgba(0,229,96,0.12)] rounded-xl text-xl">
              📘
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-[#5a8a72]">
                Project Title
              </p>
              <p className="text-lg font-bold text-[#c8f5e0] mt-0.5">
                {project?.title || "No Project"}
              </p>
            </div>
          </div>
        </div>


        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-[rgba(0,229,96,0.12)] rounded-xl text-xl">
              👨‍🏫
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-[#5a8a72]">Supervisor</p>
              <p className="text-lg font-bold text-[#c8f5e0] mt-0.5">
                {supervisorName || "N/A"}
              </p>
            </div>
          </div>
        </div>


        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-[rgba(0,229,96,0.12)] rounded-xl text-xl">
              ⏰
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-[#5a8a72]">
                Next Deadline
              </p>
              <p className="text-lg font-bold text-[#c8f5e0] mt-0.5">
                {formatDate(project?.deadline)}
              </p>
            </div>
          </div>
        </div>


        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-[rgba(0,229,96,0.12)] rounded-xl text-xl">
              💬
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-[#5a8a72]">
                Recent Feedback
              </p>
              <p className="text-lg font-bold text-[#c8f5e0] mt-0.5">
                {feedbackList?.length
                  ? formatDate(feedbackList[0]?.createdAt)
                  : "No feedback yet"}
              </p>
            </div>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Project Overview</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#5a8a72]">
                Title
              </label>
              <p className="text-[#c8f5e0] font-medium mt-1">
                {project?.title || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-[#5a8a72]">
                Description
              </label>
              <p className="text-[#c8f5e0] font-medium mt-1">
                {project?.description || "No description provided"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-[#5a8a72]">
                Status
              </label>
              <span
                className={`inline-flex items-center px-2 py-[2px] rounded-full text-xs font-medium capitalize ${
                  project?.status === "approved"
                    ? "bg-[rgba(0,229,96,0.12)] text-[#00e560]"
                    : project?.status === "pending"
                      ? "bg-[rgba(234,179,8,0.12)] text-yellow-400"
                      : project?.status === "rejected"
                        ? "bg-[rgba(244,115,115,0.12)] text-[#f47373]"
                        : project?.status === "completed"
                          ? "bg-[rgba(0,229,96,0.12)] text-[#00e560]"
                          : "bg-[rgba(0,229,96,0.08)] text-[#7ab898]"
                }`}
              >
                {project?.status || "Unknown"}
              </span>
            </div>
            <div>
              <label className="text-xs font-medium text-[#5a8a72]">
                Submission Deadline
              </label>
              <p className="text-[#c8f5e0] font-medium mt-1">
                {formatDate(project?.deadline)}
              </p>
            </div>
          </div>
        </div>


        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h2 className="card-title">Latest Feedback</h2>
            <Link
              to={"/student/feedback"}
              className="btn-primary btn-small text-xs"
            >
              View All
            </Link>
          </div>


          {feedbackList && feedbackList.length > 0 ? (
            <div className="space-y-4">
              {feedbackList.map((feedback, index) => (
                <div
                  key={index}
                  className="border border-[rgba(0,229,96,0.15)] rounded-xl p-4 bg-[#0c1210]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-5 h-5 text-[#00e560]" />
                      <h3 className="font-medium text-[#c8f5e0] text-sm">
                        {feedback.title || "Supervisor Feedback"}
                      </h3>
                    </div>
                    <p className="text-xs text-[#5a8a72]">
                      {formatDate(feedback.createdAt)}
                    </p>
                  </div>
                  <div className="rounded-lg p-3">
                    <p className="text-[#7ab898] text-sm leading-relaxed">
                      {feedback.message}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-[#5a8a72]">
                      - {supervisorName || "Supervisor"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="w-10 h-10 text-[#2a5a42] mx-auto mb-3" />
              <p className="text-[#5a8a72] text-sm">
                No feedback available yet.
              </p>
            </div>
          )}
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Upcoming Deadlines</h2>
          </div>
          {upcomingDeadlines && upcomingDeadlines.length > 0 ? (
            <div className="space-y-3">
              {upcomingDeadlines.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-[#0c1210] rounded-xl border border-[rgba(0,229,96,0.1)]"
                >
                  <div>
                    <p className="font-medium text-[#c8f5e0] text-sm">
                      {d.title}
                    </p>
                    <p className="text-xs text-[#5a8a72] mt-0.5">
                      {formatDate(d.deadline)}
                    </p>
                  </div>
                  <span className="badge badge-pending capitalize">
                    upcoming
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageCircleWarning className="w-10 h-10 text-[#2a5a42] mx-auto mb-3" />
              <p className="text-[#5a8a72] text-sm">
                No upcoming deadlines yet.
              </p>
            </div>
          )}
        </div>


        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Notifications</h2>
          </div>
          {topNotifications && topNotifications.length > 0 ? (
            <div className="space-y-3">
              {topNotifications.map((n, i) => (
                <div
                  key={i}
                  className="p-3 bg-[#0c1210] rounded-xl border border-[rgba(0,229,96,0.1)]"
                >
                  <p className="font-medium text-[#c8f5e0] text-sm">
                    {n.message}
                  </p>
                  <p className="text-xs text-[#5a8a72] mt-1">
                    {formatDate(n.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="w-10 h-10 text-[#2a5a42] mx-auto mb-3" />
              <p className="text-[#5a8a72] text-sm">No notifications yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default StudentDashboard;
