import getOpen from './lib/getOpen';
import dm from './decorateMenu';


let open;
export const onWindow = win => {
  open = getOpen(win);
};

export const decorateMenu = menu => dm(open, menu);
