import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { ArrowLeft, PenSquareIcon, Trash2Icon } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import RateLimitUi from "../Component/RateLimitUi";
import DeleteModal from "../Component/DeleteModal";
import Loading from "../Component/Loading";

const NoteDetailPage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [noteById, setNoteById] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNoteById(res.data.byIdNote);
        setIsRateLimited(false);
      } catch (error) {
        console.log("Errror fetching notes");
        console.log(error);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

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
      {loading && <Loading />}
      {noteById && !isRateLimited && (
        <div className="container mx-auto px-4 py-8 ">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between">
              <Link to={"/"} className="btn btn-ghost mb-6">
                <ArrowLeft className="size-5" />
                Back to Notes
              </Link>
              <div className="flex justify-end">
                <Link to={`/edit/${id}`} className="btn btn-ghost mb-6">
                  <PenSquareIcon className="size-4" />
                </Link>
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
              </div>
            </div>
            <div className="card bg-base-100">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4 justify-center">
                  {noteById.title}
                </h2>
                <div className="flex justify-center">{noteById.content}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {noteById && (
        <DeleteModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={() => handleDelete(noteById._id)}
          title="Hapus Catatan?"
          message={`Apakah kamu yakin ingin menghapus catatan "${noteById.title}"?`}
        />
      )}
    </div>
  );
};

export default NoteDetailPage;
