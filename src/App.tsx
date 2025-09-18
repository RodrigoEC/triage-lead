import { CandidateTable } from "./components/CandidateTable";

function App() {
  return (
    <div className="w-full mt-8 overflow-x-auto">
      <h2 className="text-3xl font-bold mb-4 text-left">Leads</h2>
      <CandidateTable />
    </div>
  );
}

export default App;
