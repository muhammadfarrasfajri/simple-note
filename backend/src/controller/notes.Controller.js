import Note from "../model/Note.js";

const getAll = async (req, res) => {
  try {
    const note = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(note);
  } catch (error) {
    console.error("Error in getAllNotes controller", error);
    res.status(500).json({ message: "geting data error" });
  }
};

const getById = async (req, res) => {
  try {
    const byIdNote = await Note.findById(req.params.id);

    if (!byIdNote) return res.status(404).json({ message: "Not FOund" });

    res.status(200).json({ message: "Success Get Data", byIdNote });
  } catch (error) {
    console.error("Error in getByNotes controller", error);
    res.status(500).json({ message: "geting data error" });
  }
};

const uploadNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNote = new Note({ title, content });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error in create controller", error);
    res.status(500).json({ message: "create data error" });
  }
};

const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const updateNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
      },
      { new: true }
    );

    if (!updateNote) return res.status(404).json({ message: "Not Found" });

    res.status(200).json({ message: "Update data succesfuly", updateNote });
  } catch (error) {
    console.error("Error in create controller", error);
    res.status(500).json({ message: "Update data error" });
  }
};

const deleteNote = async (req, res) => {
  try {
    const deleteNote = await Note.findByIdAndDelete(req.params.id);
    if (!deleteNote) return res.status(404).json({ message: "Not Found" });
    res.status(200).json({ message: "Delete data succesfuly" });
  } catch (error) {
    console.error("Error in create controller", error);
    res.status(500).json({ message: "Delete data error" });
  }
};

export { getAll, uploadNote, updateNote, deleteNote, getById };
