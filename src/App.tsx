import { LeadTable } from "./components/LeadTable";

function App() {
  return (
    <div className="flex flex-col gap-8 w-full p-2 max-w-[1440px] mx-auto">
      <div className="flex flex-col items-center gap-4">
        <img
          width={200}
          height={200}
          alt=""
          src="/uitify.png"
          className="w-44 h-44"
        />
        <h1 className="text-4xl font-bold">Mini Seller Console</h1>
      </div>
      <div>
        <h2 className="text-3xl font-bold mb-4 text-left">Leads</h2>
        <LeadTable />
      </div>
    </div>
  );
}

export default App;
