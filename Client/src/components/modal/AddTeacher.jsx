import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createStudent, createTeacher } from "../../store/slices/adminSlice";
import {
  toggleStudentModal,
  toggleTeacherModal,
} from "../../store/slices/popupSlice";
import { X } from "lucide-react";

const AddTeacher = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "Computer Science",
    password: "",
    experties: "Artificial Intelligence",
    maxStudents: 1,
  });

  // Expertise options based on department
  const expertiseByDepartment = {
    "Computer Science": [
      "Artificial Intelligence",
      "Machine Learning",
      "Data Science",
      "Cybersecurity",
      "Cloud Computing",
      "Software Development",
      "Web Development",
      "Mobile App Development",
      "Database Systems",
      "Computer Networks",
      "Operating Systems",
      "Human-Computer Interaction",
      "Big Data Analytics",
      "Blockchain Technology",
      "Internet of Things (IoT)",
    ],
    "Software Engineering": [
      "Software Architecture",
      "Agile Methodologies",
      "DevOps",
      "Software Testing",
      "Requirements Engineering",
      "Software Design Patterns",
      "Version Control Systems",
      "Continuous Integration/Deployment",
    ],
    "Information Technology": [
      "Network Administration",
      "System Administration",
      "IT Infrastructure",
      "Cloud Services",
      "Virtualization",
      "IT Security",
      "Database Management",
      "Enterprise Systems",
    ],
    "Data Science": [
      "Statistical Analysis",
      "Machine Learning",
      "Deep Learning",
      "Data Visualization",
      "Natural Language Processing",
      "Predictive Modeling",
      "Big Data Technologies",
      "Data Mining",
    ],
    "Electrical Engineering": [
      "Power Systems",
      "Control Systems",
      "Signal Processing",
      "Electronics",
      "Circuit Design",
      "Renewable Energy",
      "Electric Machines",
      "Power Electronics",
      "Embedded Systems",
      "Telecommunications",
    ],
    "Mechanical Engineering": [
      "Thermodynamics",
      "Fluid Mechanics",
      "Heat Transfer",
      "Manufacturing Processes",
      "CAD/CAM",
      "Robotics",
      "Mechatronics",
      "Material Science",
      "Automotive Engineering",
      "HVAC Systems",
    ],
    "Civil Engineering": [
      "Structural Engineering",
      "Geotechnical Engineering",
      "Transportation Engineering",
      "Environmental Engineering",
      "Water Resources",
      "Construction Management",
      "Surveying",
      "Urban Planning",
      "Earthquake Engineering",
    ],
    "Business Administration": [
      "Strategic Management",
      "Marketing",
      "Finance",
      "Human Resources",
      "Operations Management",
      "Entrepreneurship",
      "International Business",
      "Supply Chain Management",
      "Organizational Behavior",
    ],
    Economics: [
      "Microeconomics",
      "Macroeconomics",
      "Econometrics",
      "International Economics",
      "Development Economics",
      "Financial Economics",
      "Labor Economics",
      "Public Economics",
    ],
    Psychology: [
      "Clinical Psychology",
      "Cognitive Psychology",
      "Developmental Psychology",
      "Social Psychology",
      "Educational Psychology",
      "Organizational Psychology",
      "Neuropsychology",
      "Research Methods",
      "Counseling Psychology",
    ],
  };

  const handleCreateTeacher = (e) => {
    e.preventDefault();
    dispatch(createTeacher(formData));
    setFormData({
      name: "",
      email: "",
      department: "Computer Science",
      password: "",
      experties: "Artificial Intelligence",
      maxStudents: 1,
    });
    dispatch(toggleTeacherModal());
  };

  // Handle department change and reset expertise
  const handleDepartmentChange = (e) => {
    const newDepartment = e.target.value;
    const newExpertiseOptions = expertiseByDepartment[newDepartment];
    setFormData({
      ...formData,
      department: newDepartment,
      experties: newExpertiseOptions[0], // Set to first expertise option
    });
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="card-title">Add Teacher</h3>
            <button
              onClick={() => dispatch(toggleTeacherModal())}
              className="text-[#5a8a72] hover:text-[#c8f5e0]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreateTeacher} className="space-y-4">
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
              <label className="label">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
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
                onChange={handleDepartmentChange}
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
                <option value="Civil Engineering">Civil Engineering</option>
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
                {expertiseByDepartment[formData.department]?.map(
                  (expertise, index) => (
                    <option key={index} value={expertise}>
                      {expertise}
                    </option>
                  ),
                )}
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
                onClick={() => dispatch(toggleTeacherModal())}
                className="btn-outline"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Add Teacher
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddTeacher;
