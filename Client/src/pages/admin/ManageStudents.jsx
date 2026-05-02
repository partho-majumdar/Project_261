import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddStudent from "../../components/modal/AddStudent";
import {
  createStudent,
  deleteStudent,
  getAllUsers,
  updateStudent,
} from "../../store/slices/adminSlice";
import {
  AlertTriangle,
  CheckCircle,
  Plus,
  TriangleAlert,
  Users,
  X,
} from "lucide-react";
import { toggleStudentModal } from "../../store/slices/popupSlice";

const ManageStudents = () => {
  const { users, projects } = useSelector((state) => state.admin);
  const { isCreateStudentModalOpen } = useSelector((state) => state.popup);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
  });

  const dispatch = useDispatch();

  const students = useMemo(() => {
    const studentUsers = (users || []).filter(
      (u) => u.role?.toLowerCase() === "student",
    );

    return studentUsers.map((student) => {
      const studentProject = (projects || []).find(
        (p) => p.student._id === student._id,
      );
      console.log(studentProject);
      return {
        ...student,
        projectTitle: studentProject?.title || null,
        supervisor: studentProject?.supervisor?.name || null,
        projectStatus: studentProject?.status || null,
      };
    });
  }, [users, projects]);

  const departments = useMemo(() => {
    const set = new Set(
      (students || []).map((s) => s.department).filter(Boolean),
    );
    return Array.from(set);
  }, [students]);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      (student.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterDepartment === "all" || student.department === filterDepartment;
    return matchesSearch && matchesFilter;
  });

  console.log(filteredStudents);

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormData({
      name: "",
      email: "",
      department: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingStudent) {
      dispatch(updateStudent({ id: editingStudent._id, data: formData }));
    }
    handleCloseModal();
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      department: student.department,
    });
    setShowModal(true);
  };

  const handleDelete = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      dispatch(deleteStudent(studentToDelete._id));
      setShowDeleteModal(false);
      setStudentToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setStudentToDelete(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="card">
          <div className="card-header flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="card-title">Manage Students</h1>
              <p className="card-subtitle">
                Add, edit, and manage student accounts
              </p>
            </div>

            <button
              onClick={() => dispatch(toggleStudentModal())}
              className="btn-primary flex items-center space-x-2 mt-4 md:mt-0"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Student</span>
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card border-[rgba(0,229,96,0.25)]">
            <div className="flex items-center">
              <div className="p-3 bg-[rgba(0,229,96,0.12)] rounded-xl">
                <Users className="w-6 h-6 text-[#00e560]" />
              </div>
              <div className="ml-4">
                <p className="text-xs font-medium text-[#5a8a72]">
                  Total Students
                </p>
                <p className="text-xl font-bold text-[#c8f5e0] mt-0.5">
                  {students.length}
                </p>
              </div>
            </div>
          </div>

          <div className="card border-[rgba(0,229,96,0.25)]">
            <div className="flex items-center">
              <div className="p-3 bg-[rgba(0,229,96,0.12)] rounded-xl">
                <CheckCircle className="w-6 h-6 text-[#00e560]" />
              </div>
              <div className="ml-4">
                <p className="text-xs font-medium text-[#5a8a72]">
                  Completed Projects
                </p>
                <p className="text-xl font-bold text-[#c8f5e0] mt-0.5">
                  {students.filter((s) => s.status === "completed").length}
                </p>
              </div>
            </div>
          </div>

          <div className="card border-[rgba(244,115,115,0.2)]">
            <div className="flex items-center">
              <div className="p-3 bg-[rgba(244,115,115,0.12)] rounded-xl">
                <TriangleAlert className="w-6 h-6 text-[#f47373]" />
              </div>
              <div className="ml-4">
                <p className="text-xs font-medium text-[#5a8a72]">Unassigned</p>
                <p className="text-xl font-bold text-[#c8f5e0] mt-0.5">
                  {students.filter((s) => !s.supervisor).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="label">Search Students</label>
              <input
                type="text"
                placeholder="Search by name or email..."
                className="input w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <label className="label">Filter Status</label>
              <select
                className="input w-full"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option value={dept} key={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* STUDENTS TABLE */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Students List</h2>
          </div>
          <div className="overflow-x-auto">
            {filteredStudents && filteredStudents.length > 0 ? (
              <table className="w-full">
                <thead className="bg-[#0c1210]">
                  <tr>
                    <th className="table-header-cell">Student Info</th>
                    <th className="table-header-cell">Department & Year</th>
                    <th className="table-header-cell">Supervisor</th>
                    <th className="table-header-cell">Project Title</th>
                    <th className="table-header-cell">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[rgba(0,229,96,0.08)]">
                  {filteredStudents.map((student) => {
                    return (
                      <tr
                        key={student._id}
                        className="hover:bg-[rgba(0,229,96,0.04)]"
                      >
                        <td className="table-cell">
                          <div>
                            <div className="text-sm font-medium text-[#c8f5e0]">
                              {student.name}
                            </div>
                            <div className="text-xs text-[#5a8a72] mt-0.5">
                              {student.email}
                            </div>
                          </div>
                        </td>

                        <td className="table-cell whitespace-nowrap">
                          <div className="text-sm text-[#c8f5e0]">
                            {student.department || "-"}
                          </div>
                          <div className="text-xs text-[#5a8a72] mt-0.5">
                            {student.createdAt
                              ? new Date(student.createdAt).getFullYear()
                              : "-"}
                          </div>
                        </td>

                        <td className="table-cell whitespace-nowrap">
                          {student.supervisor ? (
                            <span className="badge badge-approved">
                              {student?.supervisor}
                            </span>
                          ) : (
                            <span className="badge badge-rejected">
                              {student.projectStatus === "rejected"
                                ? "Rejected"
                                : "Not Assigned"}
                            </span>
                          )}
                        </td>

                        <td className="table-cell">
                          <div className="text-sm text-[#c8f5e0]">
                            {student.projectTitle || "-"}
                          </div>
                        </td>

                        <td className="table-cell whitespace-nowrap">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEdit(student)}
                              className="text-[#00e560] hover:text-[#00bb4d] text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(student)}
                              className="text-[#f47373] hover:text-red-400 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              filteredStudents.length === 0 && (
                <div className="text-center py-8 text-[#5a8a72] text-sm">
                  No students found matching your criteria.
                </div>
              )
            )}
          </div>

          {/* Edit Student Modal */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="card-title">Edit Student</h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-[#5a8a72] hover:text-[#c8f5e0]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="label">Department</label>
                    <select
                      className="input w-full"
                      required
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Software Engineering">
                        Software Engineering
                      </option>
                      <option value="Information Technology">
                        Information Technology
                      </option>
                      <option value="Data Science">Data Science</option>
                      <option value="Electrical Engineering">
                        Electrical Engineering
                      </option>
                      <option value="Mechanical Engineering">
                        Mechanical Engineering
                      </option>
                      <option value="Civil Engineering">
                        Civil Engineering
                      </option>
                      <option value="Business Administration">
                        Business Administration
                      </option>
                      <option value="Economics">Economics</option>
                      <option value="Psychology">Psychology</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Update Student
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && studentToDelete && (
            <div className="modal-overlay">
              <div className="modal-content p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[rgba(244,115,115,0.12)]">
                    <AlertTriangle className="w-6 h-6 text-[#f47373]" />
                  </div>
                </div>

                <h3 className="card-title mb-2">Delete Student</h3>
                <p className="text-sm text-[#5a8a72] mb-6">
                  Are you sure you want to delete{" "}
                  <span className="text-[#c8f5e0] font-medium">
                    {studentToDelete.name}
                  </span>
                  ? This action cannot be undone.
                </p>

                <div className="flex justify-center space-x-3">
                  <button onClick={cancelDelete} className="btn-outline">
                    Cancel
                  </button>
                  <button onClick={confirmDelete} className="btn-danger">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {isCreateStudentModalOpen && <AddStudent />}
        </div>
      </div>
    </>
  );
};

export default ManageStudents;
