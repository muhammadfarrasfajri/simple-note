import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router";
import api from "../lib/axios";
import { ArrowLeftIcon } from "lucide-react";
import RateLimitUi from "../Component/RateLimitUi";

const EditPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [isRateLimited, setIsRateLimited] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
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
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load note");
        }
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
      await api.put(`/notes/${id}`, {
        title,
        content,
      });
      toast.success("Note Updated Successfully!");
      navigate("/");
    } catch (error) {
      console.log("Error updating note", error);
      if (error.response.status === 429) {
        toast.error("Slow down! You're updating note too fast", {
          duration: 4000,
          icon: "💀",
        });
      } else {
        toast.error("Failed to update note");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-base-200">
      {isRateLimited && <RateLimitUi />}
      {!isRateLimited && (
        <div className="container mx-auto px-4 py-8 ">
          <div className="max-w-2xl mx-auto">
            <Link to={"/"} className="btn btn-ghost mb-6">
              <ArrowLeftIcon className="size-5" />
              Back to Notes
            </Link>
            <div className="card bg-base-100">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Edit Note</h2>
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
                      placeholder="Write your note here......"
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
                      {loading ? "Updating..." : "Update Note"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPage;
