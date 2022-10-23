import { ChevronDown, ChevronUp, Check, X } from 'react-feather';
import { CellProps, Column, HeaderProps } from 'react-table';

import { Button } from '@@/buttons';
import { Icon } from '@@/Icon';

import { Node } from '../../types';

export const expand: Column<Node> = {
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
};
