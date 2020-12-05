import React, { useEffect, useState } from 'react';
import { DamageCalcPreset } from '../../hooks/useDamageCalcPresets';
import { css } from '@emotion/core';
import { TextInput } from '../../../../components/TextInput';
import { usePreviousWithoutInitial } from '../../../../hooks/usePrevious';

type Props = {
  readonly isEdited: boolean;
  readonly isSelected: boolean;
  readonly onCopy: (() => void) | null;
  readonly onDelete: (() => void) | null;
  readonly onSelect: (() => void) | null;
  readonly preset: DamageCalcPreset;
  readonly onInitEdit: (() => void) | null;
  readonly onNameChange: (name: string) => void;
  readonly onCancelEdit: () => void;
};

export const PresetTab: React.FC<Props> = (props) => {
  const { onCopy, isSelected, onCancelEdit, onInitEdit, onNameChange, isEdited, onDelete, onSelect, preset } = props;
  const [editedName, setEditedName] = useState('');

  const previousIsEdited = usePreviousWithoutInitial(isEdited);

  useEffect(() => {
    if (previousIsEdited === undefined || !previousIsEdited && isEdited) {
      setEditedName(preset.name);
    }
  }, [previousIsEdited, isEdited, preset.name]);

  return (
    <div
      css={css`
        border: black solid 1px;
        ${isSelected ? css`background-color: mediumspringgreen` : undefined}
      `}
    >
      {isEdited && (
        <div
          onKeyPress={e => {
            if (e.key === 'Enter') {
              onNameChange(editedName);
              onCancelEdit();
            }
          }}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              onCancelEdit();
            }
          }}
        >
          <TextInput
            autoFocus
            onChange={setEditedName}
            value={editedName}
          />
        </div>
      )}
      {!isEdited && (
        <div
          onClick={onInitEdit}
          css={css`display: flex`}
        >
          <div
            onClick={onSelect}
            css={css`
              margin-right: 4px;
            `}
          >
            {preset.name}
          </div>
          {onCopy && (
            <div
              onClick={e => {
                e.stopPropagation();
                onCopy();
              }}
              css={css`
                margin-left: 4px;
                margin-right: 4px;
                border-left: black solid 1px;
                border-right: black solid 1px;
              `}
            >
              C
            </div>
          )}
          {onDelete && (
            <div
              onClick={e => {
                e.stopPropagation();
                onDelete();
              }}
              css={css`color: firebrick`}
            >
              X
            </div>
          )}
        </div>
      )}
    </div>
  );
};

PresetTab.displayName = 'PresetTab';