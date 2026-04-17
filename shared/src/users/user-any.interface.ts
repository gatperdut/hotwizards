import { HwUserExt } from './user-ext.interface.js';
import { HwUser } from './user.interface.js';

export interface HwUserAny extends HwUser, HwUserExt {}
