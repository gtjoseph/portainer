import { addPlural } from '@/portainer/helpers/strings';
import { DockerSnapshot } from '@/react/docker/snapshots/types';

import { StatsItem } from '@@/StatsItem';

interface Props {
  snapshot?: DockerSnapshot;
}

export function EnvironmentStatsDocker({ snapshot }: Props) {
  if (!snapshot) {
    return <>No snapshot available</>;
  }

  return (
    <>
      <StatsItem
        value={addPlural(snapshot.StackCount, 'stack')}
        icon="layers"
        featherIcon
      />

      {!!snapshot.Swarm && (
        <StatsItem
          value={addPlural(snapshot.ServiceCount, 'service')}
          icon="shuffle"
          featherIcon
        />
      )}

      <ContainerStats
        running={snapshot.RunningContainerCount}
        stopped={snapshot.StoppedContainerCount}
        healthy={snapshot.HealthyContainerCount}
        unhealthy={snapshot.UnhealthyContainerCount}
      />
      <StatsItem
        value={addPlural(snapshot.VolumeCount, 'volume')}
        icon="database"
        featherIcon
      />
      <StatsItem
        value={addPlural(snapshot.ImageCount, 'image')}
        icon="list"
        featherIcon
      />

      {snapshot.Swarm && (
        <StatsItem
          value={addPlural(snapshot.NodeCount, 'node')}
          icon="hard-drive"
          featherIcon
        />
      )}
    </>
  );
}

interface ContainerStatsProps {
  running: number;
  stopped: number;
  healthy: number;
  unhealthy: number;
}

function ContainerStats({
  running,
  stopped,
  healthy,
  unhealthy,
}: ContainerStatsProps) {
  const containersCount = running + stopped;

  return (
    <StatsItem
      value={addPlural(containersCount, 'container')}
      icon="box"
      featherIcon
    >
      {containersCount > 0 && (
        <>
          <StatsItem
            value={running}
            icon="power"
            featherIcon
            iconClass="icon-success"
          />
          <StatsItem
            value={stopped}
            icon="power"
            featherIcon
            iconClass="icon-danger"
          />
          <StatsItem
            value={healthy}
            icon="heart"
            featherIcon
            iconClass="icon-success"
          />
          <StatsItem
            value={unhealthy}
            icon="heart"
            featherIcon
            iconClass="icon-warning"
          />
        </>
      )}
    </StatsItem>
  );
}
