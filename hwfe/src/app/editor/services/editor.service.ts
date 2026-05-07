import { Injectable, signal } from '@angular/core';
import { Map } from '../types/map.type';

@Injectable()
export class EditorService {
  public map = signal<Map>({ width: 0, height: 0, cells: [] });
}
