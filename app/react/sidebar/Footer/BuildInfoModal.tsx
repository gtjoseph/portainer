import { useState } from 'react';
import { Database, Hash, Server, Tag, Wrench } from 'lucide-react';

import {
  useStatus,
  useVersionStatus,
} from '@/portainer/services/api/status.service';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalTitle,
} from '@/portainer/services/modal.service/Modal';

import { Button } from '@@/buttons';

import styles from './Footer.module.css';

export function BuildInfoModalButton() {
  const [isBuildInfoVisible, setIsBuildInfoVisible] = useState(false);
  const statusQuery = useStatus();

  if (!statusQuery.data) {
    return null;
  }

  const { Version } = statusQuery.data;

  return (
    <>
      <button
        type="button"
        data-cy="portainerSidebar-versionNumber"
        className="btn-none"
        onClick={() => setIsBuildInfoVisible(true)}
      >
        {Version}
      </button>
      {isBuildInfoVisible && (
        <BuildInfoModal closeModal={() => setIsBuildInfoVisible(false)} />
      )}
    </>
  );
}

function BuildInfoModal({ closeModal }: { closeModal: () => void }) {
  const versionQuery = useVersionStatus();
  const statusQuery = useStatus();

  if (!statusQuery.data || !versionQuery.data) {
    return null;
  }

  const { Edition } = statusQuery.data;
  const { ServerVersion, DatabaseVersion, Build } = versionQuery.data;

  return (
    <Modal onSubmit={closeModal}>
      <ModalTitle onSubmit={closeModal} title={`Portainer ${Edition}`} />
      <ModalBody>
        <div className={styles.versionInfo}>
          <table>
            <tbody>
              <tr>
                <td>
                  <span className="inline-flex items-center">
                    <Server size="13" className="space-right" />
                    Server Version: {ServerVersion}
                  </span>
                </td>
                <td>
                  <span className="inline-flex items-center">
                    <Database size="13" className="space-right" />
                    Database Version: {DatabaseVersion}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="inline-flex items-center">
                    <Hash size="13" className="space-right" />
                    CI Build Number: {Build.BuildNumber}
                  </span>
                </td>
                <td>
                  <span>
                    <Tag size="13" className="space-right" />
                    Image Tag: {Build.ImageTag}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.toolsList}>
          <span className="inline-flex items-center">
            <Wrench size="13" className="space-right" />
            Compilation tools:
          </span>

          <div className={styles.tools}>
            <span className="text-muted small">
              Nodejs v{Build.NodejsVersion}
            </span>
            <span className="text-muted small">Yarn v{Build.YarnVersion}</span>
            <span className="text-muted small">
              Webpack v{Build.WebpackVersion}
            </span>
            <span className="text-muted small">Go v{Build.GoVersion}</span>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button className="w-full" onClick={closeModal}>
          Ok
        </Button>
      </ModalFooter>
    </Modal>
  );
}
