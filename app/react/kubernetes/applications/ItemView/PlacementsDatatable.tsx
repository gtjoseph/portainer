import { CellProps, Column, HeaderProps } from 'react-table';
import { useStore } from 'zustand';
import { Check, ChevronDown, ChevronUp, X, Minimize2 } from 'lucide-react';

import { useUser } from '@/react/hooks/useUser';

import {
  BasicTableSettings,
  createPersistedStore,
  refreshableSettings,
  RefreshableTableSettings,
} from '@@/datatables/types';
import { useSearchBarState } from '@@/datatables/SearchBar';
import { Button } from '@@/buttons';
import { Icon } from '@@/Icon';
import { ExpandableDatatable } from '@@/datatables/ExpandableDatatable';
import { useRepeater } from '@@/datatables/useRepeater';
import { TableSettingsMenu } from '@@/datatables';
import { TableSettingsMenuAutoRefresh } from '@@/datatables/TableSettingsMenuAutoRefresh';

import { Node } from './types';
import { SubRow } from './PlacementsDatatableSubRow';

const columns: Column<Node>[] = [
  {
    id: 'expand',
    Header: ({
      filteredFlatRows,
      getToggleAllRowsExpandedProps,
      isAllRowsExpanded,
    }: HeaderProps<Node>) => {
      const hasExpandableItems = filteredFlatRows.some(
        (item) => !item.original.AcceptsApplication
      );

      return (
        hasExpandableItems && (
          <Button
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...getToggleAllRowsExpandedProps()}
            color="none"
            icon={isAllRowsExpanded ? ChevronDown : ChevronUp}
          />
        )
      );
    },
    Cell: ({ row }: CellProps<Node>) => (
      <div className="vertical-center">
        {!row.original.AcceptsApplication && (
          <Button
            /*  eslint-disable-next-line react/jsx-props-no-spreading */
            {...row.getToggleRowExpandedProps()}
            color="none"
            icon={row.isExpanded ? ChevronDown : ChevronUp}
          />
        )}
        <Icon
          icon={row.original.AcceptsApplication ? Check : X}
          mode={row.original.AcceptsApplication ? 'success' : 'danger'}
          size="sm"
        />
      </div>
    ),
    disableFilters: true,
    Filter: () => null,
    canHide: false,
    width: 70,
    disableResizing: true,
  },
  {
    Header: 'Node',
    accessor: (row) => row.Name,
    id: 'node',
    disableFilters: true,
    Filter: () => null,
    canHide: false,
    sortType: 'string',
  },
];

interface TableSettings extends BasicTableSettings, RefreshableTableSettings {}

function createStore(storageKey: string) {
  return createPersistedStore<TableSettings>(storageKey, 'node', (set) => ({
    ...refreshableSettings(set),
  }));
}

const storageKey = 'kubernetes.application.placements';
const settingsStore = createStore(storageKey);

export function PlacementsDatatable({
  dataset,
  onRefresh,
}: {
  dataset: Node[];
  onRefresh: () => Promise<void>;
}) {
  const { isAdmin } = useUser();
  const settings = useStore(settingsStore);
  const [search, setSearch] = useSearchBarState(storageKey);
  useRepeater(settings.autoRefreshRate, onRefresh);

  return (
    <ExpandableDatatable<Node>
      title="Placement constraints/preferences"
      titleIcon={Minimize2}
      dataset={dataset}
      initialPageSize={settings.pageSize}
      onPageSizeChange={settings.setPageSize}
      initialSortBy={settings.sortBy}
      onSortByChange={settings.setSortBy}
      searchValue={search}
      onSearchChange={setSearch}
      columns={columns}
      disableSelect
      noWidget
      renderTableSettings={() => (
        <TableSettingsMenu>
          <TableSettingsMenuAutoRefresh
            value={settings.autoRefreshRate}
            onChange={settings.setAutoRefreshRate}
          />
        </TableSettingsMenu>
      )}
      emptyContentLabel="No node available."
      renderSubRow={(row) => (
        <SubRow
          isAdmin={isAdmin}
          node={row.original}
          cellCount={row.cells.length}
        />
      )}
    />
  );
}
