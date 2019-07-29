import { BrowserWindow, MenuItemConstructorOptions } from 'electron';
import getOpen, { Open } from './lib/getOpen';
import dm from './decorateMenu';

let open: Open;
export const onWindow = (win: BrowserWindow): void => {
  open = getOpen(win);
};

export const decorateMenu = (
  menu: MenuItemConstructorOptions[],
): MenuItemConstructorOptions[] => dm(open, menu);
