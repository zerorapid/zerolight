/**
 * ZeroLight Spring Physics & Motion Curves
 * Engineered for tactile Apple-grade micro-interactions.
 */

export interface SpringPreset {
  id: '1' | '2' | '3';
  name: string;
  cubic: string;
  description: string;
}

export const SPRING_PRESETS: Record<'1' | '2' | '3', SpringPreset> = {
  '1': {
    id: '1',
    name: 'Subtle Linear',
    cubic: 'cubic-bezier(0, 0, 0.2, 1)',
    description: 'Clean, understated corporate transition with zero overshoot.',
  },
  '2': {
    id: '2',
    name: 'Apple Damped',
    cubic: 'cubic-bezier(0.175, 0.885, 0.32, 1.25)',
    description: 'Natural fluid spring with subtle tactile momentum.',
  },
  '3': {
    id: '3',
    name: 'Elastic Spring',
    cubic: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    description: 'High-energy kinetic spring with expressive rebound.',
  },
};
