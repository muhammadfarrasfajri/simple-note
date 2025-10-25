import { PenSquareIcon, Trash2Icon } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";
import DeleteModal from "./DeleteModal";

const CardNote = ({ note, setNotes }) => {
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully");
      setNotes((prev) => prev.filter((note) => note._id !== id));
      setShowModal(false);
      navigate("/");
    } catch (error) {
      console.log("Error in handleDelete", error);
      toast.error("Failed to delete note");
    }
  };
  return (
    <>
      <Link
        to={`/note/${note._id}`}
        className="card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#ff8d0a84]"
      >
        <div className="card-body">
          <h3 className="card-title text-base-content">{note.title}</h3>
          <p className="text-base-content/70 line-clamp-3">{note.content}</p>
          <div className="card-actions justify-between items-center mt-4">
            <span className="text-sm text-base-content/60">
              {formatDate(new Date(note.createdAt))}
            </span>
            <div className="flex items-center gap-1">
              <Link to={`/edit/${note._id}`}>
                <PenSquareIcon className="size-4" />
              </Link>
              <button
                className="btn btn-ghost btn-xs text-error"
                onClick={(e) => {
                  e.preventDefault();
                  setShowModal(true);
                }}
              >
                <Trash2Icon className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>
      {showModal && (
        <DeleteModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={() => handleDelete(note._id)}
          title="Delete Note?"
          message={`Are you sure want to delete this note "${note.title}"?`}
        />
      )}
    </>
  );
};

export default CardNote;
