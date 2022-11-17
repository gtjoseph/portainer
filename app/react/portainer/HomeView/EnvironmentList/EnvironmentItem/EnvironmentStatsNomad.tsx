import { NomadSnapshot } from '@/react/portainer/environments/types';
import { addPlural } from '@/portainer/helpers/strings';

import { StatsItem } from '@@/StatsItem';

interface Props {
  snapshot?: NomadSnapshot;
}

export function EnvironmentStatsNomad({ snapshot }: Props) {
  if (!snapshot) {
    return <>No snapshot available</>;
  }

  return (
    <>
      <StatsItem
        value={addPlural(snapshot.JobCount, 'job')}
        icon="list"
        featherIcon
      />
      <StatsItem
        value={addPlural(snapshot.GroupCount, 'group')}
        icon="svg-objectgroup"
      />
      <StatsItem
        value={addPlural(snapshot.TaskCount, 'task')}
        icon="box"
        featherIcon
      >
        {snapshot.TaskCount > 0 && (
          <>
            <StatsItem
              value={snapshot.RunningTaskCount}
              icon="power"
              featherIcon
              iconClass="icon-success"
            />
            <StatsItem
              value={snapshot.TaskCount - snapshot.RunningTaskCount}
              icon="power"
              featherIcon
              iconClass="icon-danger"
            />
          </>
        )}
      </StatsItem>

      <StatsItem
        value={addPlural(snapshot.NodeCount, 'node')}
        icon="hard-drive"
        featherIcon
      />
    </>
  );
}
