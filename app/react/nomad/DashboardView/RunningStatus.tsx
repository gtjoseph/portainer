import { StatsItem } from '@@/StatsItem';

interface Props {
  running: number;
  stopped: number;
}

export function RunningStatus({ running, stopped }: Props) {
  return (
    <div>
      <div>
        <StatsItem
          value={`${running || '-'} running`}
          icon="power"
          featherIcon
          iconClass="icon-success"
        />
        {`${running || '-'} running`}
      </div>
      <div>
        <StatsItem
          value={`${stopped || '-'} stopped`}
          icon="power"
          featherIcon
          iconClass="icon-danger"
        />
        {`${stopped || '-'} stopped`}
      </div>
    </div>
  );
}
