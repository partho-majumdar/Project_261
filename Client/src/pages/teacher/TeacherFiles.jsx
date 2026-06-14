import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowDownToLine,
  File,
  FileArchive,
  FileSpreadsheet,
  FileText,
  LayoutGrid,
  List,
} from "lucide-react";
import { downloadTeacherFile, getFiles } from "../../store/slices/teacherSlice";

const TeacherFiles = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const filesFromStore = useSelector((state) => state.teacher.files) || [];

  useEffect(() => {
    dispatch(getFiles());
  }, [dispatch]);

  const deriveTypeFormatName = (name) => {
    if (!name) return "other";
    const parts = name.split(".");
    return (parts[parts.length - 1] || "").toLowerCase();
  };

  const normalizeFile = (f) => {
    const type = deriveTypeFormatName(f.originalName) || f.fileType || "other";

    let category = "other";

    if (["pdf", "doc", "docx", "txt"].includes(type)) {
      category = "report";
    } else if (["ppt", "pptx"].includes(type)) {
      category = "presentation";
    } else if (
      ["zip", "rar", "7z", "js", "ts", "html", "css", "json"].includes(type)
    ) {
      category = "code";
    } else if (["jpeg", "jpg", "png", "avif", "gif"].includes(type)) {
      category = "image";
    }

    return {
      id: f._id,
      name: f.originalName,
      type: type.toUpperCase(),
      size: f.size || "-",
      student: f.studentName || "-",
      uploadDate: f.uploadedAt || f.createdAt || new Date().toISOString(),
      category,
      projectId: f.projectId || f.project?._id,
      fileId: f._id,
    };
  };

  const files = useMemo(
    () => (filesFromStore || []).map(normalizeFile),
    [filesFromStore],
  );

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="w-8 h-8 text-[#f47373]" />;
      case "doc":
      case "docx":
        return <FileText className="w-8 h-8 text-[#00e560]" />;
      case "ppt":
      case "pptx":
        return <FileSpreadsheet className="w-8 h-8 text-yellow-400" />;
      case "zip":
      case "rar":
        return <FileArchive className="w-8 h-8 text-yellow-400" />;
      default:
        return <File className="w-8 h-8 text-[#5a8a72]" />;
    }
  };

  const filteredFiles = files.filter((file) => {
    const matchesType =
      filterType === "all" ? true : file.category === filterType;
    const matchesSearch = file.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch && matchesType;
  });

  const handleDownloadFile = async (file) => {
    const res = await dispatch(
      downloadTeacherFile({ projectId: file.projectId, fileId: file.id }),
    ).then((res) => {
      const { blob } = res.payload;
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.name || "download");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  };

  const fileStats = [
    {
      label: "Total Files",
      count: files.length,
      border: "border-[rgba(0,229,96,0.25)]",
    },
    {
      label: "Reports",
      count: files.filter((f) => f.category === "report").length,
      border: "border-[rgba(0,229,96,0.25)]",
    },
    {
      label: "Presentations",
      count: files.filter((f) => f.category === "presentation").length,
      border: "border-[rgba(234,179,8,0.25)]",
    },
    {
      label: "Code Files",
      count: files.filter((f) => f.category === "code").length,
      border: "border-[rgba(0,229,96,0.25)]",
    },
    {
      label: "Images",
      count: files.filter((f) => f.category === "image").length,
      border: "border-[rgba(244,115,115,0.2)]",
    },
  ];

  const tableHeadData = [
    "File Name",
    "Student",
    "Type",
    "Upload Date",
    "Actions",
  ];

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h1 className="card-title">Student Files</h1>
            <p className="card-subtitle">
              Manage files shared with and received from students
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <select
              className="input w-56"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Files</option>
              <option value="report">Reports</option>
              <option value="presentation">Presentation</option>
              <option value="code">Code</option>
              <option value="image">Images</option>
            </select>

            <input
              type="text"
              className="input w-96"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${
                viewMode === "grid"
                  ? "bg-[rgba(0,229,96,0.12)] text-[#00e560]"
                  : "text-[#5a8a72] hover:bg-[rgba(0,229,96,0.08)]"
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${
                viewMode === "list"
                  ? "bg-[rgba(0,229,96,0.12)] text-[#00e560]"
                  : "text-[#5a8a72] hover:bg-[rgba(0,229,96,0.08)]"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
          {fileStats.map((item, i) => (
            <div key={i} className={`card ${item.border}`}>
              <p className="text-xs font-medium text-[#5a8a72]">{item.label}</p>
              <p className="text-2xl font-bold text-[#c8f5e0] mt-1">
                {item.count}
              </p>
            </div>
          ))}
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFiles.map((file) => (
            <div key={file.id} className="card">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3">{getFileIcon(file.type)}</div>
                <h3
                  className="font-medium text-[#c8f5e0] text-sm mb-1 truncate w-full"
                  title={file.name}
                >
                  {file.name}
                </h3>
                <p className="text-xs text-[#5a8a72] mb-1">{file.student}</p>
                <p className="text-xs text-[#5a8a72] mb-1">{file.size}</p>
                <p className="text-xs text-[#5a8a72] mb-4">
                  {new Date(file.uploadDate).toLocaleDateString()}
                </p>

                <button
                  onClick={() => handleDownloadFile(file)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <ArrowDownToLine size={18} /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0c1210]">
              <tr>
                {tableHeadData.map((t) => (
                  <th key={t} className="table-header-cell">
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,229,96,0.08)]">
              {filteredFiles.map((file) => (
                <tr key={file.id} className="hover:bg-[rgba(0,229,96,0.04)]">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <span className="font-medium text-[#c8f5e0]">
                        {file.name}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell text-[#c8f5e0]">{file.student}</td>
                  <td className="table-cell text-[#7ab898]">{file.type}</td>
                  <td className="table-cell text-[#7ab898]">
                    {new Date(file.uploadDate).toLocaleDateString()}
                  </td>
                  <td className="table-cell">
                    <button
                      className="btn-primary btn-small"
                      onClick={() => handleDownloadFile(file)}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeacherFiles;
