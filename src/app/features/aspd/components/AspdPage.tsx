import React, { useMemo } from 'react';
import { AspdInput } from './AspdInput';
import { useAspdInput } from '../hooks/useAspdInput';
import { calculateAspd } from '../utils/calculateAspd';

export const AspdPage: React.FC = () => {
  const { aspdInput, changeAspdInput } = useAspdInput();

  const {
    finalAspd,
    finalAspdFull,
    statAspd,
    statAspdFull,
  } = useMemo(() => {
    return calculateAspd(aspdInput);
  }, [aspdInput]);

  return (
    <div>
      <AspdInput
        aspdInput={aspdInput}
        onAspdInputChange={changeAspdInput}
      />
      <div>
        <strong>Stat ASPD</strong>: {statAspd} ({statAspdFull.toFixed(2)})
      </div>
      <div>
        <strong>Final ASPD</strong>: {finalAspd} ({finalAspdFull.toFixed(2)})
      </div>
    </div>
  );
};