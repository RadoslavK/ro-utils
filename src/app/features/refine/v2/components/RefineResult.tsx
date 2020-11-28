import React, { useMemo } from 'react';
import { RefineType } from '../../common/types/refineType.type';
import { RefineLevelResult } from '../utils/calculateUpgradeCost';
import { css } from '@emotion/core';
import { getOreLabel } from '../../common/utils/getOreLabel';

type Props = {
  readonly level: number;
  readonly onPreferredParamsChange: (id: string) => void;
  readonly refineType: RefineType;
  readonly result: RefineLevelResult;
}

export const RefineResult: React.FC<Props> = (props) => {
  const {
    level,
    onPreferredParamsChange,
    refineType,
    result,
  } = props;

  const sortedResults = useMemo(() => {
    const results = [...result.refineParamsResults.entries()];

    return results.sort(([, result], [,otherResult]) => result.average.cost - otherResult.average.cost);
  }, [result]);

  return (
    <div
      css={css`flex: 0 0 auto`}
    >
      <h3 css={css`text-align: center`}>
        +{level}
      </h3>

      {sortedResults.map(([paramsId, paramsResult]) => {
        const isUsed = paramsId === result.usedRefineParamsId;
        const { refineParams } = paramsResult;
        const oreLabel = getOreLabel(refineType, refineParams.oreType);
        const refineMethodLabel = `${refineParams.useBsb ? 'BSB + ' : ''}${oreLabel}`;

        return (
          <div
            key={paramsId}
            css={css`
              margin: 10px;
              padding: 10px;
              border: ${isUsed ? 2.5 : 1}px ${isUsed ? 'gold' : 'black'} solid;
              width: 250px;
            `}
            onClick={() => onPreferredParamsChange(paramsId)}
          >
            <div><strong>Method</strong>: {refineMethodLabel}</div>
            <div><strong>Avg item cost</strong>: {Math.round(paramsResult.average.totalCost).toLocaleString()} Z</div>
            {paramsResult.min.totalCost !== paramsResult.max.totalCost && (
              <div><strong>Variance</strong>: {Math.round(paramsResult.min.totalCost).toLocaleString()} ~ {Math.round(paramsResult.max.totalCost).toLocaleString()} Z</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

RefineResult.displayName = 'RefineResult';