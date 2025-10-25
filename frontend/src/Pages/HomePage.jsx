import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Navbar from "../Component/Navbar";
import RateLimitUi from "../Component/RateLimitUi";
import CardNote from "../Component/CardNote";
import api from "../lib/axios";
import NotFound from "../Component/NotFound";
import Loading from "../Component/Loading";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get("/notes");
        setNotes(res.data);
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
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {isRateLimited && <RateLimitUi />}
      {loading && <Loading />}
      {notes.length === 0 && !isRateLimited && !loading && <NotFound />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <CardNote key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
