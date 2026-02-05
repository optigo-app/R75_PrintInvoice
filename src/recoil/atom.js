// atoms.js
import { atom } from 'recoil';

export const scannedValue = atom({
  key: 'scannedValue', // unique ID (with respect to other atoms/selectors)
  default: '', // default value (aka initial value)
})