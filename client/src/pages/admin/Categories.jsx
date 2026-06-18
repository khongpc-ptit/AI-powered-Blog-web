import React, { useEffect, useState, useMemo } from "react";
import DataTable from "../../components/DataTable";
import { assets } from "../../assets/assets";
import { categoryService } from "../../services/category.service";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getAll();
      if (response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const countBlogsByCategory = (categoryName) => {
    return 0;
  };

  const handleAdd = () => {
    setModalMode("add");
    setEditingCategory(null);
    setFormData({ name: "", description: "", status: "active" });
    setError("");
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setModalMode("edit");
    setEditingCategory(category);
    setFormData({
      name: category.name || "",
      description: category.description || "",
      status: category.status || "active",
    });
    setError("");
    setShowModal(true);
  };

  const handleDeleteClick = (category) => {
    setDeleteConfirm(category);
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      try {
        await categoryService.delete(deleteConfirm._id);
        setCategories((prev) => prev.filter((c) => c._id !== deleteConfirm._id));
      } catch (error) {
        console.error("Failed to delete category:", error);
        alert("Failed to delete category");
      }
      setDeleteConfirm(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (modalMode === "add") {
        const response = await categoryService.create(formData);
        if (response.data) {
          setCategories((prev) => [...prev, response.data]);
        }
      } else if (modalMode === "edit" && editingCategory) {
        const response = await categoryService.update(editingCategory._id, formData);
        if (response.data) {
          setCategories((prev) =>
            prev.map((c) =>
              c._id === editingCategory._id ? { ...c, ...formData } : c
            )
          );
        }
      }
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save category");
    }
  };

  const columns = [
    {
      field: "index",
      header: "#",
      sortable: false,
      headerClassName: "w-12",
      render: (item) => item.index,
    },
    {
      field: "name",
      header: "Category Name",
      sortable: true,
      render: (item) => (
        <div className="font-medium text-gray-800">{item.name}</div>
      ),
    },
    {
      field: "description",
      header: "Description",
      sortable: false,
      render: (item) => (
        <div className="max-w-xs truncate text-gray-600" title={item.description}>
          {item.description || "-"}
        </div>
      ),
    },
    {
      field: "blogCount",
      header: "Blogs",
      sortable: true,
      render: (item) => (
        <span className="font-semibold text-primary">{item.blogCount || 0}</span>
      ),
    },
    {
      field: "createdAt",
      header: "Created At",
      sortable: true,
      render: (item) => {
        const date = new Date(item.createdAt);
        return <span className="text-gray-600">{date.toLocaleDateString()}</span>;
      },
    },
    {
      field: "status",
      header: "Status",
      sortable: true,
      render: (item) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            item.status === "active"
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {item.status === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      field: "actions",
      header: "Actions",
      sortable: false,
      render: (item) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleEdit(item)}
            className="border px-2 py-0.5 text-xs rounded cursor-pointer hover:bg-gray-100 transition-colors"
          >
            Edit
          </button>
          <img
            src={assets.cross_icon}
            onClick={() => handleDeleteClick(item)}
            className="w-5 hover:scale-110 transition-all cursor-pointer"
            alt="Delete"
          />
        </div>
      ),
    },
  ];

  const tableData = useMemo(() => {
    return categories.map((cat, index) => ({
      ...cat,
      index: index + 1,
      blogCount: cat.blogCount || countBlogsByCategory(cat.name),
    }));
  }, [categories]);

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-1 bg-blue-50/50">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Categories</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage blog categories with add, edit, and delete options.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer text-sm"
        >
          <img src={assets.add_icon} alt="" className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <DataTable
        data={tableData}
        columns={columns}
        searchPlaceholder="Search categories..."
        searchableFields={["name", "description"]}
        defaultSortField="createdAt"
        defaultSortOrder="desc"
        loading={loading}
        emptyMessage="No categories found."
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                {modalMode === "add" ? "Add New Category" : "Edit Category"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5">
              {error && (
                <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="Enter description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  {modalMode === "add" ? "Add Category" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Category</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
