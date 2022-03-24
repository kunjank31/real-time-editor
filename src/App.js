import { Routes, Route } from "react-router-dom";
import EditorPage from "./Components/EditorPage";
import Home from "./Components/Home";

const App = () => {
  return (
    <Routes>
      <Route path="/" exact element={<Home />} />
      <Route path="/editor/:roomId" exact element={<EditorPage />} />
    </Routes>
  );
};

export default App;
