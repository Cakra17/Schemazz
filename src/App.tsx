import { Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Editor from "./pages/Editor";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/editor" element={<Editor/>}/>
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}

export default App;
