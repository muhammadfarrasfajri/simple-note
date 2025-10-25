import { ArrowLeftIcon, Trash2Icon } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router";
import api from "../lib/axios";
import RateLimitUi from "../Component/RateLimitUi";
import DeleteModal from "../Component/DeleteModal";

const NoteFormPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    if (!id) return;
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        if (!res.data.byIdNote) {
          toast.error("Note not found");
          navigate("/");
          return;
        }
        setTitle(res.data.byIdNote.title);
        setContent(res.data.byIdNote.content);
      } catch (error) {
        console.log("Error fetching note:", error);
        toast.error("Failed to load note");
      }
    };
    fetchNote();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      if (id) {
        await api.put(`/notes/${id}`, { title, content });
        toast.success("Note Updated Successfully!");
      } else {
        await api.post("/notes", { title, content });
        toast.success("Note Created Successfully!");
      }
      navigate("/");
    } catch (error) {
      console.log("Error saving note", error);
      if (error.response?.status === 429) {
        setIsRateLimited(true);
        toast.error(
          `Slow down! You're ${id ? "updating" : "creating"} note too fast`,
          {
            duration: 4000,
            icon: "💀",
          }
        );
      } else {
        toast.error(`Failed to ${id ? "update" : "create"} note`);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully");
      setShowModal(false);
      navigate("/");
    } catch (error) {
      console.log("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {isRateLimited && <RateLimitUi />}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between">
            <Link to={"/"} className="btn btn-ghost mb-6">
              <ArrowLeftIcon className="size-5" />
              Back to Notes
            </Link>
            {id && (
              <button
                className="btn btn-ghost text-error"
                onClick={(e) => {
                  e.preventDefault();
                  setShowModal(true);
                }}
              >
                Delete
                <Trash2Icon className="size-4" />
              </button>
            )}
          </div>
          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">
                {id ? "Edit Note" : "Create New Note"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Note Title"
                    className="input input-bordered"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Content</span>
                  </label>
                  <textarea
                    type="text"
                    placeholder="Write your note here..."
                    className="textarea textarea-bordered h-32"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading
                      ? id
                        ? "Updating..."
                        : "Creating..."
                      : id
                      ? "Update Note"
                      : "Create Note"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {id && (
        <DeleteModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={() => handleDelete(id)}
          title="Hapus Catatan?"
          message={`Apakah kamu yakin ingin menghapus catatan "${title}"?`}
        />
      )}
    </div>
  );
};

export default NoteFormPage;
