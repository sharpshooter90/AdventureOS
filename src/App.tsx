import "./App.css";
import { CmdkLauncher } from "@/components/cmdk-launcher";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <h1>AdventureOS</h1>
      <CmdkLauncher />
    </BrowserRouter>
  );
}

export default App;
