import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import ReactTooltip from 'react-tooltip';
import { Icon } from 'lucide-react';

import styles from './BoxOption.module.css';
import { BoxSelectorOption, Value } from './types';

interface Props<T extends Value> {
  radioName: string;
  option: BoxSelectorOption<T>;
  onSelect?(value: T): void;
  isSelected(value: T): boolean;
  disabled?: boolean;
  tooltip?: string;
  className?: string;
  type?: 'radio' | 'checkbox';
  checkIcon: Icon;
}

export function BoxOption<T extends Value>({
  radioName,
  option,
  onSelect = () => {},
  isSelected,
  disabled,
  tooltip,
  className,
  type = 'radio',
  children,
  checkIcon: Check,
}: PropsWithChildren<Props<T>>) {
  const tooltipId = `box-option-${radioName}-${option.id}`;
  const selected = isSelected(option.value);

  return (
    <div
      className={clsx(styles.root, className)}
      data-tip
      data-for={tooltipId}
      tooltip-append-to-body="true"
      tooltip-placement="bottom"
      tooltip-class="portainer-tooltip"
    >
      <input
        type={type}
        name={radioName}
        id={option.id}
        checked={selected}
        value={option.value.toString()}
        disabled={disabled}
        onChange={() => onSelect(option.value)}
      />

      <label htmlFor={option.id} data-cy={`${radioName}_${option.value}`}>
        {children}

        <div
          className={clsx(
            'absolute top-4 right-4 h-4 w-4 rounded-full border border-solid border-blue-8 text-white font-bold flex items-center justify-center',
            {
              'bg-white': !selected,
              'bg-blue-8': selected,
            }
          )}
        >
          {selected && <Check className="feather" strokeWidth={3} />}
        </div>
      </label>

      {tooltip && (
        <ReactTooltip
          place="bottom"
          className="portainer-tooltip"
          id={tooltipId}
        >
          {tooltip}
        </ReactTooltip>
      )}
    </div>
  );
}
