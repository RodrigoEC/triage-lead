import { useEffect, useState } from "react";
import { getLeads, type Lead } from "./api";
import { Candidate } from "./components/Candidate";

function App() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    setLeads(getLeads({ filters: { company: "nterprises"}}));
  }, []);

  return (
    <>
      <div className="w-full mt-8 overflow-x-auto">
        <h2 className="text-3xl font-bold mb-4 text-left">Leads</h2>
        <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs text-gray-400 uppercase"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs text-gray-400 uppercase"
                >
                  Company
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs text-gray-400 uppercase"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs text-gray-400 uppercase"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs text-gray-400 uppercase"
                >
                  Score
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs text-gray-400 uppercase"
                >
                  Action
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs text-gray-400 uppercase"
                >
                  Convert Lead
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {leads.map((lead) => (
                <Candidate
                  key={lead.id}
                  lead={lead}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
