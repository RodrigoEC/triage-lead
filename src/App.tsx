import { useState } from "react";
import { LeadTable } from "./components/LeadTable";
import { OpportunityTable } from "./components/OpportunityTable";

type View = "leads" | "opportunities";

function App() {
  const [activeView, setActiveView] = useState<View>("leads");

  return (
    <div className="flex flex-col gap-8 w-full p-2 max-w-[1440px] mx-auto">
      <div className="flex items-center flex-row gap-4">
        <img
          width={200}
          height={200}
          alt=""
          src="/uitify.png"
          className="w-12 h-12"
        />
        <h1 className="w-fit text-3xl font-bold">Mini Seller Console</h1>
      </div>
      <div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-6" aria-label="Tabs">
            <button
              onClick={() => setActiveView("leads")}
              className={`${
                activeView === "leads"
                  ? "border-green-700 text-green-700"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap border-b-2 py-2 px-1 text-md font-medium border-box`}
            >
              Leads
            </button>
            <button
              onClick={() => setActiveView("opportunities")}
              className={`${
                activeView === "opportunities"
                  ? "border-green-700 text-green-700"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap border-b-2 py-2 px-1 text-md font-medium border-box`}
            >
              Opportunities
            </button>
          </nav>
        </div>
        <div className="mt-8">
          {activeView === "leads" ? <LeadTable /> : <OpportunityTable />}
        </div>
      </div>
    </div>
  );
}

export default App;
