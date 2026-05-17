import { Gender, Klass } from '@hw/prismagen/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KlassesService {
  public portrait(klass: Klass, gender: Gender): string {
    return `/portraits/${klass.toLowerCase()}_${gender.toLowerCase()}.png`;
  }
}
