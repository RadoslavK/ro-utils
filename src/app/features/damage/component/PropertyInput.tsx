import React from 'react';
import { Property } from '../types/property.type';
import { DropDown } from '../../../components/DropDown';
import { PropertyElement } from '../types/propertyElement';
import { createOnChangeCallback } from '../../../utils/useOnChangeCallback';

type Props = {
  readonly onChange: (property: Property) => void;
  readonly property: Property;
}

export const PropertyInput: React.FC<Props> = ({ onChange, property }) => {
  const {
    element,
    level,
  } = property;
  const onChangeCb = createOnChangeCallback(property, onChange);

  return (
    <div>
      <h3>
        Property
      </h3>
      <DropDown
        selectedValue={element}
        values={Object.values(PropertyElement)}
        onChange={onChangeCb('element')}
        getId={element => element}
        getName={element => element}
        label="Element"
      />
      <DropDown
        selectedValue={level}
        values={[1, 2, 3, 4]}
        onChange={onChangeCb('level')}
        getId={level => level.toString()}
        getName={level => level.toString()}
        label="Level"
      />
    </div>
  );
};