import { Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import EditorPage from "./pages/Editor.tsx";
import Playground from "./pages/Playground.tsx";

export function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/editor" element={<EditorPage />} />
			<Route path="/pg" element={<Playground />} />
			<Route path="*" element={<h1>404 Not Found</h1>} />
		</Routes>
	);
}

export default App;
