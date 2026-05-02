import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddTeacher from "../../components/modal/AddTeacher";
import {
  deleteTeacher,
  getAllUsers,
  updateTeacher,
} from "../../store/slices/adminSlice";
import { toggleTeacherModal } from "../../store/slices/popupSlice";
import {
  BadgeCheck,
  Plus,
  Users,
  X,
  TriangleAlert,
  AlertTriangle,
} from "lucide-react";
const ManageTeachers = () => {
  const { users } = useSelector((state) => state.admin);
  const { isCreateTeacherModalOpen } = useSelector((state) => state.popup);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    experties: "",
    maxStudents: 10,
  });

  const dispatch = useDispatch();

  const teachers = useMemo(() => {
    return (users || []).filter((u) => u.role?.toLowerCase() === "teacher");
  }, [users]);

  const departments = useMemo(() => {
    const set = new Set(
      (teachers || []).map((t) => t.department).filter(Boolean),
    );
    return Array.from(set);
  }, [teachers]);

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      (teacher.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (teacher.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterDepartment === "all" || teacher.department === filterDepartment;
    return matchesSearch && matchesFilter;
  });

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTeacher(null);
    setFormData({
      name: "",
      email: "",
      department: "",
      experties: "",
      maxStudents: 10,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingTeacher) {
      dispatch(updateTeacher({ id: editingTeacher._id, data: formData }));
    }
    handleCloseModal();
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      department: teacher.department,
      experties: Array.isArray(teacher.experties)
        ? teacher.experties[0]
        : teacher.experties,
      maxStudents:
        typeof teacher.maxStudents === "number" ? teacher.maxStudents : 10,
    });
    setShowModal(true);
  };

  const handleDelete = (teacher) => {
    setTeacherToDelete(teacher);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (teacherToDelete) {
      dispatch(deleteTeacher(teacherToDelete._id));
      setShowDeleteModal(false);
      setTeacherToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTeacherToDelete(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="card">
          <div className="card-header flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="card-title">Manage Teachers</h1>
              <p className="card-subtitle">
                Add, edit, and manage teacher accounts
              </p>
            </div>

            <button
              onClick={() => dispatch(toggleTeacherModal())}
              className="btn-primary flex items-center space-x-2 mt-4 md:mt-0"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Teacher</span>
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
                  Total Teachers
                </p>
                <p className="text-xl font-bold text-[#c8f5e0] mt-0.5">
                  {teachers.length}
                </p>
              </div>
            </div>
          </div>

          <div className="card border-[rgba(0,229,96,0.25)]">
            <div className="flex items-center">
              <div className="p-3 bg-[rgba(0,229,96,0.12)] rounded-xl">
                <BadgeCheck className="w-6 h-6 text-[#00e560]" />
              </div>
              <div className="ml-4">
                <p className="text-xs font-medium text-[#5a8a72]">
                  Assigned Students
                </p>
                <p className="text-xl font-bold text-[#c8f5e0] mt-0.5">
                  {teachers.reduce(
                    (sum, t) => sum + (t.assignedStudents?.length || 0),
                    0,
                  )}
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
                <p className="text-xs font-medium text-[#5a8a72]">
                  Departments
                </p>
                <p className="text-xl font-bold text-[#c8f5e0] mt-0.5">
                  {departments.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="label">Search Teachers</label>
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

        {/* TEACHERS TABLE */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Teachers List</h2>
          </div>
          <div className="overflow-x-auto">
            {filteredTeachers && filteredTeachers.length > 0 ? (
              <table className="w-full">
                <thead className="bg-[#0c1210]">
                  <tr>
                    <th className="table-header-cell">Teacher Info</th>
                    <th className="table-header-cell">Department</th>
                    <th className="table-header-cell">Expertise</th>
                    <th className="table-header-cell">Join Date</th>
                    <th className="table-header-cell">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[rgba(0,229,96,0.08)]">
                  {filteredTeachers.map((teacher) => {
                    return (
                      <tr
                        key={teacher._id}
                        className="hover:bg-[rgba(0,229,96,0.04)]"
                      >
                        <td className="table-cell">
                          <div>
                            <div className="text-sm font-medium text-[#c8f5e0]">
                              {teacher.name}
                            </div>
                            <div className="text-xs text-[#5a8a72] mt-0.5">
                              {teacher.email}
                            </div>
                          </div>
                        </td>

                        <td className="table-cell whitespace-nowrap">
                          <div className="text-sm text-[#c8f5e0]">
                            {teacher.department || "-"}
                          </div>
                        </td>

                        <td className="table-cell">
                          <div className="text-sm text-[#c8f5e0]">
                            {Array.isArray(teacher.experties)
                              ? teacher.experties.join(", ")
                              : teacher.experties || "-"}
                          </div>
                        </td>

                        <td className="table-cell text-[#7ab898]">
                          {teacher.createdAt
                            ? new Date(teacher.createdAt).toLocaleString()
                            : "-"}
                        </td>

                        <td className="table-cell whitespace-nowrap">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEdit(teacher)}
                              className="text-[#00e560] hover:text-[#00bb4d] text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(teacher)}
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
              filteredTeachers.length === 0 && (
                <div className="text-center py-8 text-[#5a8a72] text-sm">
                  No teachers found matching your criteria.
                </div>
              )
            )}
          </div>

          {/* Edit Teacher Modal */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="card-title">Edit Teacher</h3>
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
                  <div>
                    <label className="label">Expertise</label>
                    <select
                      className="input w-full"
                      required
                      value={formData.experties}
                      onChange={(e) =>
                        setFormData({ ...formData, experties: e.target.value })
                      }
                    >
                      <option value="Artificial Intelligence">
                        Artificial Intelligence
                      </option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Cloud Computing">Cloud Computing</option>
                      <option value="Software Development">
                        Software Development
                      </option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile App Development">
                        Mobile App Development
                      </option>
                      <option value="Database Systems">Database Systems</option>
                      <option value="Computer Networks">
                        Computer Networks
                      </option>
                      <option value="Operating Systems">
                        Operating Systems
                      </option>
                      <option value="Human-Computer Interaction">
                        Human-Computer Interaction
                      </option>
                      <option value="Big Data Analytics">
                        Big Data Analytics
                      </option>
                      <option value="Blockchain Technology">
                        Blockchain Technology
                      </option>
                      <option value="Internet of Things (IoT)">
                        Internet of Things (IoT)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Max Students</label>
                    <input
                      type="number"
                      required
                      max={10}
                      min={1}
                      value={formData.maxStudents}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxStudents: e.target.value,
                        })
                      }
                      className="input w-full"
                    />
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
                      Update Teacher
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && teacherToDelete && (
            <div className="modal-overlay">
              <div className="modal-content p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[rgba(244,115,115,0.12)]">
                    <AlertTriangle className="w-6 h-6 text-[#f47373]" />
                  </div>
                </div>

                <h3 className="card-title mb-2">Delete Teacher</h3>
                <p className="text-sm text-[#5a8a72] mb-6">
                  Are you sure you want to delete{" "}
                  <span className="text-[#c8f5e0] font-medium">
                    {teacherToDelete.name}
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

          {isCreateTeacherModalOpen && <AddTeacher />}
        </div>
      </div>
    </>
  );
};

export default ManageTeachers;
