import { Route, Router, Routes } from "react-router";
import HomePage from "./Pages/HomePage";
import NoteDetailPage from "./Pages/NoteDetailPage";
import NotFound from "./Component/NotFound";
import NoteFormPage from "./Pages/NoteFormPage";

const App = () => {
  return (
    <div data-theme="coffee">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<NoteFormPage />} />
        <Route path="/note/:id" element={<NoteDetailPage />} />
        <Route path="/edit/:id" element={<NoteFormPage />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
};

export default App;
