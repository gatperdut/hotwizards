import { PaginationMeta } from './pagination-meta.interface.js';

export interface Paginated<T> {
  items: T[];
  meta: PaginationMeta;
}
