import { CellProps, Column, HeaderProps } from 'react-table';
import { useStore } from 'zustand';
import { Check, ChevronDown, ChevronUp, X, Minimize2 } from 'lucide-react';
import { Fragment } from 'react';
import clsx from 'clsx';

import { useUser } from '@/react/hooks/useUser';
import { nodeAffinityValues } from '@/kubernetes/filters/application';
import { KubernetesPodNodeAffinityNodeSelectorRequirementOperators } from '@/kubernetes/pod/models';

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
import { TableSettingsMenu } from '@@/datatables';
import { TableSettingsMenuAutoRefresh } from '@@/datatables/TableSettingsMenuAutoRefresh';
import { useRepeater } from '@@/datatables/useRepeater';

type Node = {
  Name: string;
  AcceptsApplication: boolean;
  UnmetTaints?: Array<{
    Key: string;
    Value?: string;
    Effect: string;
  }>;
  UnmatchedNodeSelectorLabels?: Array<{ key: string; value: string }>;
  Highlighted: boolean;
  UnmatchedNodeAffinities?: Array<
    Array<{
      key: string;
      operator: KubernetesPodNodeAffinityNodeSelectorRequirementOperators;
      values: string;
    }>
  >;
};

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
      renderSubRow={(row) =>
        isAdmin ? (
          <>
            {row.original.UnmetTaints &&
              row.original.UnmetTaints.length > 0 &&
              row.original.UnmetTaints.map((taint) => (
                <tr
                  className={clsx({
                    'datatable-highlighted': row.original.Highlighted,
                    'datatable-unhighlighted': !row.original.Highlighted,
                  })}
                  key={taint.Key}
                >
                  <td colSpan={row.cells.length}>
                    This application is missing a toleration for the taint
                    <code className="space-left">
                      {taint.Key}
                      {taint.Value ? `=${taint.Value}` : ''}:{taint.Effect}
                    </code>
                  </td>
                </tr>
              ))}
            {row.original.UnmatchedNodeSelectorLabels &&
              row.original.UnmatchedNodeSelectorLabels.length > 0 &&
              row.original.UnmatchedNodeSelectorLabels.map((label) => (
                <tr
                  className={clsx({
                    'datatable-highlighted': row.original.Highlighted,
                    'datatable-unhighlighted': !row.original.Highlighted,
                  })}
                  key={label.key}
                >
                  <td colSpan={row.cells.length}>
                    This application can only be scheduled on a node where the
                    label <code>{label.key}</code> is set to{' '}
                    <code>{label.value}</code>
                  </td>
                </tr>
              ))}
            {row.original.UnmatchedNodeAffinities &&
              row.original.UnmatchedNodeAffinities.length && (
                <>
                  <tr
                    className={clsx({
                      'datatable-highlighted': row.original.Highlighted,
                      'datatable-unhighlighted': !row.original.Highlighted,
                    })}
                  >
                    <td colSpan={row.cells.length}>
                      This application can only be scheduled on nodes respecting
                      one of the following labels combination:{' '}
                    </td>
                  </tr>
                  {row.original.UnmatchedNodeAffinities.map((aff) => (
                    <tr
                      className={clsx({
                        'datatable-highlighted': row.original.Highlighted,
                        'datatable-unhighlighted': !row.original.Highlighted,
                      })}
                    >
                      <td />
                      <td colSpan={row.cells.length - 1}>
                        {aff.map((term, index) => (
                          <Fragment key={index}>
                            <code>
                              {term.key} {term.operator}{' '}
                              {nodeAffinityValues(term.values, term.operator)}
                            </code>
                            <span>{index === aff.length - 1 ? '' : ' + '}</span>
                          </Fragment>
                        ))}
                      </td>
                    </tr>
                  ))}
                </>
              )}
          </>
        ) : (
          <>
            {row.original.UnmetTaints && row.original.UnmetTaints.length > 0 && (
              <tr
                className={clsx({
                  'datatable-highlighted': row.original.Highlighted,
                  'datatable-unhighlighted': !row.original.Highlighted,
                })}
              >
                <td colSpan={row.cells.length}>
                  Placement constraint not respected for that node.
                </td>
              </tr>
            )}

            {(row.original.UnmatchedNodeSelectorLabels &&
              row.original.UnmatchedNodeSelectorLabels.length > 0 &&
              row.original.UnmatchedNodeSelectorLabels.length > 0) ||
              (row.original.UnmatchedNodeAffinities &&
                row.original.UnmatchedNodeAffinities.length > 0 &&
                row.original.UnmatchedNodeAffinities.length > 0 && (
                  <tr
                    className={clsx({
                      'datatable-highlighted': row.original.Highlighted,
                      'datatable-unhighlighted': !row.original.Highlighted,
                    })}
                  >
                    <td colSpan={row.cells.length}>
                      Placement label not respected for that node.
                    </td>
                  </tr>
                ))}
          </>
        )
      }
    />
  );
}
