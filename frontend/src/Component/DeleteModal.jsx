import React from "react";

const DeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title || "Delete Note?"}</h3>
        <p className="py-4">
          {message || "Are you sure you want to delete this note?"}
        </p>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={onConfirm}>
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
