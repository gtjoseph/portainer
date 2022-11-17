import { KubernetesSnapshot } from '@/react/portainer/environments/types';
import { humanize } from '@/portainer/filters/filters';
import { addPlural } from '@/portainer/helpers/strings';

import { StatsItem } from '@@/StatsItem';

interface Props {
  snapshot?: KubernetesSnapshot;
}

export function EnvironmentStatsKubernetes({ snapshot }: Props) {
  if (!snapshot) {
    return <>No snapshot available</>;
  }

  return (
    <>
      <StatsItem icon="cpu" featherIcon value={`${snapshot.TotalCPU} CPU`} />

      <StatsItem
        icon="svg-memory"
        featherIcon
        value={`${humanize(snapshot.TotalMemory)} RAM`}
      />

      <StatsItem
        value={addPlural(snapshot.NodeCount, 'node')}
        icon="hard-drive"
        featherIcon
      />
    </>
  );
}
