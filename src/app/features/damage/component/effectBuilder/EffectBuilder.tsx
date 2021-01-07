import React, { useState } from 'react';
import { EffectBuilderModal } from './EffectBuilderModal';

export const EffectBuilder: React.FC = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const openEditor = () => setIsEditorOpen(true);
  const closeEditor = () => setIsEditorOpen(false);

  return (
    <div>
      <button onClick={openEditor}>
        Open effect builder
      </button>
      {isEditorOpen && <EffectBuilderModal onClose={closeEditor} />}
    </div>
  );
};

EffectBuilder.displayName = 'EffectBuilder';