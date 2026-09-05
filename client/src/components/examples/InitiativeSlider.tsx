import { useState } from 'react';
import InitiativeSlider from '../InitiativeSlider';

export default function InitiativeSliderExample() {
  const [value, setValue] = useState(50);

  return (
    <div className="max-w-md mx-auto p-4">
      <InitiativeSlider value={value} onChange={setValue} />
    </div>
  );
}
