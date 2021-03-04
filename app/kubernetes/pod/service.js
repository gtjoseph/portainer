import _ from 'lodash-es';
import angular from 'angular';
import PortainerError from 'Portainer/error';

import { KubernetesCommonParams } from 'Kubernetes/models/common/params';
import KubernetesPodConverter from 'Kubernetes/pod/converter';

class KubernetesPodService {
  /* @ngInject */
  constructor($async, KubernetesPods) {
    this.$async = $async;
    this.KubernetesPods = KubernetesPods;

    this.getAllAsync = this.getAllAsync.bind(this);
    this.logsAsync = this.logsAsync.bind(this);
    this.deleteAsync = this.deleteAsync.bind(this);
    this.patchAsync = this.patchAsync.bind(this);
  }
  /**
   * GET ALL
   */
  async getAllAsync(namespace) {
    try {
      const data = await this.KubernetesPods(namespace).get().$promise;
      return _.map(data.items, (item) => KubernetesPodConverter.apiToModel(item));
    } catch (err) {
      throw new PortainerError('Unable to retrieve pods', err);
    }
  }

  get(namespace) {
    return this.$async(this.getAllAsync, namespace);
  }

  /**
   * Logs
   *
   * @param {string} namespace
   * @param {string} podName
   * @param {string} containerName
   */
  async logsAsync(namespace, podName, containerName) {
    try {
      const params = new KubernetesCommonParams();
      params.id = podName;
      if (containerName) {
        params.container = containerName;
      }
      const data = await this.KubernetesPods(namespace).logs(params).$promise;
      return data.logs.length === 0 ? [] : data.logs.split('\n');
    } catch (err) {
      throw new PortainerError('Unable to retrieve pod logs', err);
    }
  }

  logs(namespace, podName, containerName) {
    return this.$async(this.logsAsync, namespace, podName, containerName);
  }

  /**
   * PATCH
   */
  async patchAsync(oldPod, newPod) {
    try {
      const params = new KubernetesCommonParams();
      params.id = newPod.Name;
      const namespace = newPod.Namespace;
      const payload = KubernetesPodConverter.patchPayload(oldPod, newPod);
      if (!payload.length) {
        return;
      }
      const data = await this.KubernetesPods(namespace).patch(params, payload).$promise;
      return data;
    } catch (err) {
      throw new PortainerError('Unable to patch pod', err);
    }
  }

  patch(oldPod, newPod) {
    return this.$async(this.patchAsync, oldPod, newPod);
  }

  /**
   * DELETE
   */
  async deleteAsync(pod) {
    try {
      const params = new KubernetesCommonParams();
      params.id = pod.Name;
      const namespace = pod.Namespace;
      await this.KubernetesPods(namespace).delete(params).$promise;
    } catch (err) {
      throw new PortainerError('Unable to remove pod', err);
    }
  }

  delete(pod) {
    return this.$async(this.deleteAsync, pod);
  }
}

export default KubernetesPodService;
angular.module('portainer.kubernetes').service('KubernetesPodService', KubernetesPodService);