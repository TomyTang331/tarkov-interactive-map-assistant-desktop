import { atom } from 'recoil';

const mobileMenuVisibleState = atom<boolean>({
  key: 'mobileMenuVisibleState',
  default: false,
});

export default mobileMenuVisibleState;
