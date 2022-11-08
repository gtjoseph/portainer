import {
  BasicTableSettings,
  RefreshableTableSettings,
  SettableColumnsTableSettings,
} from '@@/datatables/types';

export interface TableSettings
  extends BasicTableSettings,
    SettableColumnsTableSettings,
    RefreshableTableSettings {}

export enum DeployType {
  FDO = 'FDO',
  MANUAL = 'MANUAL',
}
