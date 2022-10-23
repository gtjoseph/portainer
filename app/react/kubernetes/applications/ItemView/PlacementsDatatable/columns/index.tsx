import { Column } from 'react-table';

import { Node } from '../../types';

import { expand } from './expand';

export const columns: Column<Node>[] = [
  expand,
  {
    Header: 'Node',
    accessor: 'Name',
    id: 'node',
    disableFilters: true,
    Filter: () => null,
    canHide: false,
    sortType: 'string',
  },
];
