import React, { useState } from 'react';
import { useDamageCalcEffects } from '../../hooks/useDamageCalcEffects';
import { EffectBuilderList } from './EffectBuilderList';
import { generateId } from '../../../../utils/generateId';
import { DamageCalcEffect, EquipEffectType } from '../../types/damageCalcEffect';
import { EffectBuilderEditor } from './EffectBuilderEditor';
import { Modal } from '../../../../components/Modal';
import { css } from '@emotion/core';

type Props = {
  readonly onClose: () => void;
};

export const EffectBuilderModal: React.FC<Props> = (props) => {
  const { onClose } = props;
  const { effects, setEffect, removeEffect } = useDamageCalcEffects();
  const [selectedEffectId, setSelectedEffectId] = useState<string | undefined>(() => [...effects.values()][0]?.id);
  const selectedEffect: DamageCalcEffect | undefined = effects.get(selectedEffectId);

  const addEffect = (): void => {
    const id = generateId();
    const newEffect: DamageCalcEffect = {
      id,
      name: 'New effect',
      positions: [],
      values: [{
        type: EquipEffectType.ATK,
        value: 0,
      }],
    };

    setEffect(newEffect);
    setSelectedEffectId(id);
  };

  return (
    <Modal onClose={onClose}>
      <div css={css`display: flex`}>
        <button onClick={addEffect}>
          Add effect
        </button>
        <EffectBuilderList
          effects={effects}
          selectedEffectId={selectedEffectId}
          onSelectedEffectIdChange={setSelectedEffectId}
        />
      </div>
      {selectedEffect && (
        <EffectBuilderEditor
          effect={selectedEffect}
          onChange={setEffect}
          onRemove={() => removeEffect(selectedEffect)}
        />
      )}
    </Modal>
  );
};

EffectBuilderModal.displayName = 'EffectBuilderModal';