import { useState } from 'react';
import { Download } from 'lucide-react';

import { Environment } from '@/react/portainer/environments/types';
import { isKubernetesEnvironment } from '@/react/portainer/environments/utils';
import { trackEvent } from '@/angulartics.matomo/analytics-services';
import { Query } from '@/react/portainer/environments/queries/useEnvironmentList';

import { Button } from '@@/buttons';

import { KubeconfigPrompt } from './KubeconfigPrompt';

import '@reach/dialog/styles.css';

export interface Props {
  environments: Environment[];
  envQueryParams: Query;
}
export function KubeconfigButton({ environments, envQueryParams }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  if (!environments) {
    return null;
  }

  if (!isKubeconfigButtonVisible(environments)) {
    return null;
  }

  return (
    <>
      <Button onClick={handleClick} size="medium" className="!ml-3">
        <Download className="lucide icon-white" aria-hidden="true" /> Kubeconfig
      </Button>
      {prompt()}
    </>
  );

  function handleClick() {
    if (!environments) {
      return;
    }

    trackEvent('kubernetes-kubectl-kubeconfig-multi', {
      category: 'kubernetes',
    });

    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  function isKubeconfigButtonVisible(environments: Environment[]) {
    return true;
    if (window.location.protocol !== 'https:') {
      return false;
    }
    return environments.some((env) => isKubernetesEnvironment(env.Type));
  }

  function prompt() {
    return (
      isOpen && (
        <KubeconfigPrompt
          envQueryParams={envQueryParams}
          onClose={handleClose}
        />
      )
    );
  }
}
