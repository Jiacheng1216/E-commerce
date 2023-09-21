import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./nav";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Nav />
      </div>
    </BrowserRouter>
  );
}

export default App;
