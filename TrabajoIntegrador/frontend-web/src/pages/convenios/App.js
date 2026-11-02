import logo from "./logo.png";
import "./App.css";

function App() {
  return (
    <BrowseRouter>
      <Routes>

             <Route path="/" element={<Navigate to="/login" replace />} />

             <Route path="/login" element={<Login />} />

                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/convenios" element={<Convenios />} />

      </Routes>
    </BrowseRouter>
  );
}

export default App;
