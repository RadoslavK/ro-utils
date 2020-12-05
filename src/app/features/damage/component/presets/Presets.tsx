import React, { useState } from 'react';
import { PresetTab } from './PresetTab';
import { DamageCalcPreset } from '../../hooks/useDamageCalcPresets';
import { css } from '@emotion/core';

type Props = {
  readonly onCopyPreset: (id: string) => string;
  readonly onAddPreset: () => string;
  readonly onDeletePreset: ((id: string) => void) | null;
  readonly onSelectedPresetChange: (preset: DamageCalcPreset) => void;
  readonly presets: ReadonlyMap<string, DamageCalcPreset>;
  readonly changePresetName: (id: string, name: string) => void;
  readonly selectedPresetId: string;
};

export const Presets: React.FC<Props> = (props) => {
  const { onAddPreset, onCopyPreset, changePresetName, onDeletePreset, onSelectedPresetChange, presets, selectedPresetId } = props;
  const [editedPresetId, setEditedPresetId] = useState<string | null>(null);

  const allowActions = editedPresetId === null;

  return (
    <div css={css`display: flex`}>
      <button
        onClick={allowActions
          ? () => {
            const id = onAddPreset();

            setEditedPresetId(id);
          }
          : null
        }
      >
        Add preset
      </button>
      {[...presets.values()].map(preset => {
        const isSelected = selectedPresetId === preset.id;

        return (
          <PresetTab
            isEdited={editedPresetId === preset.id}
            isSelected={isSelected}
            key={preset.id}
            onCancelEdit={() => setEditedPresetId(null)}
            onCopy={allowActions
              ? () => {
                const newId = onCopyPreset(preset.id);

                setEditedPresetId(newId);
              }
              : null}
            onDelete={allowActions && onDeletePreset ? () => onDeletePreset(preset.id) : null}
            onInitEdit={allowActions && isSelected ? () => setEditedPresetId(preset.id) : null}
            onNameChange={(name) => changePresetName(preset.id, name)}
            onSelect={allowActions ? () => onSelectedPresetChange(preset) : null}
            preset={preset}
          />
        );
      })}
    </div>
  );
};

Presets.displayName = 'Presets';