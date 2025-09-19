import { getOpportunities } from '../api/opportunities';
import { Opportunity } from './Opportunity';
import type {
  GetOpportunitiesOptions,
  IOpportunity,
} from '../util/interfaces';
import { OPPORTUNITIES_PER_PAGE } from '../util/constants';
import { Table } from './Table';
import { OpportunityTableHead } from './OpportunityTableHead';

export const OpportunityTable = () => {
  return (
    <Table<IOpportunity, GetOpportunitiesOptions>
      fetchData={getOpportunities}
      dataKey="opportunities"
      renderRow={(opportunity, onUpdate) => (
        <Opportunity
          key={opportunity.id}
          opportunity={opportunity}
          onUpdate={onUpdate}
        />
      )}
      TableHeadComponent={OpportunityTableHead}
      itemsPerPage={OPPORTUNITIES_PER_PAGE}
      noDataMessage="No Opportunities Found"
      sortKey="amount"
    />
  );
};
