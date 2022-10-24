import { r2a } from '@/react-tools/react2angular';
import { withCurrentUser } from '@/react-tools/withCurrentUser';
import { withUIRouter } from '@/react-tools/withUIRouter';
import { ApplicationsStacksDatatable } from './ApplicationsStacksDatatable';

angular
  .module('portainer.kubernetes')
  .component('kubernetesApplicationsStacksDatatableOld', {
    templateUrl: './applicationsStacksDatatable.html',
    controller: 'KubernetesApplicationsStacksDatatableController',
    bindings: {
      titleText: '@',
      titleIcon: '@',
      dataset: '<',
      tableKey: '@',
      orderBy: '@',
      reverseOrder: '<',
      refreshCallback: '<',
      removeAction: '<',
    },
  })
  .component('kubernetesApplicationsStacksDatatable', r2a(withUIRouter(withCurrentUser(ApplicationsStacksDatatable)), ['dataset', 'onRefresh', 'onRemove']));
