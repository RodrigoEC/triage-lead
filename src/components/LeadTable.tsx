import { getLeads } from "../api/leads";
import type { GetLeadsOptions, ILead } from "../util/interfaces";
import { LeadTableHead } from "./LeadTableHead";
import { LEADS_PER_PAGE } from "../util/constants";
import { Lead } from "./Lead";
import { Table } from "./Table";
import { LeadDetailPanel } from "./LeadDetailPanel";

export const LeadTable = ({
  rootFilter,
  onLeadConverted,
}: {
  rootFilter?: GetLeadsOptions;
  onLeadConverted: () => void,
}) => {
  return (
    <Table<ILead, GetLeadsOptions>
      fetchData={getLeads}
      dataKey="leads"
      renderRow={(lead, onUpdate, onRowClick) => (
        <Lead key={lead.id} lead={lead} onLeadConverted={onLeadConverted} onRowClick={onRowClick} onUpdate={onUpdate} />
      )}
      renderSlideOverContent={(lead, onUpdate, onClose) => (
        <LeadDetailPanel lead={lead} onUpdate={onUpdate} onClose={onClose} />
      )}
      TableHeadComponent={LeadTableHead}
      itemsPerPage={LEADS_PER_PAGE}
      noDataMessage="No Leads Found"
      sortKey="score"
      slideOverTitle="Lead Details"
      rootFilter={rootFilter}
    />
  );
};
