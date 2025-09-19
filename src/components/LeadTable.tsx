import { getLeads } from "../api/leads";
import type { GetLeadsOptions, ILead } from "../util/interfaces";
import { LeadTableHead } from "./LeadTableHead";
import { LEADS_PER_PAGE } from "../util/constants";
import { Lead } from "./Lead";
import { Table } from "./Table";

export const LeadTable = ({
  rootFilter,
}: {
  rootFilter?: GetLeadsOptions;
}) => {
  return (
    <Table<ILead, GetLeadsOptions>
      fetchData={getLeads}
      dataKey="leads"
      renderRow={(lead, onUpdate) => (
        <Lead key={lead.id} lead={lead} onUpdate={onUpdate} />
      )}
      TableHeadComponent={LeadTableHead}
      itemsPerPage={LEADS_PER_PAGE}
      noDataMessage="No Leads Found"
      sortKey="score"
      rootFilter={rootFilter}
    />
  );
};
