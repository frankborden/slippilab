import { RawCharacterAnimations } from './index';

declare module '*.json' {
  const value: RawCharacterAnimations;
  export default value;
}
