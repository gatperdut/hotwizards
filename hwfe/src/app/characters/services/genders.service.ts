import { Injectable } from '@angular/core';
import { Gender } from '@hw/prismagen/enums';

@Injectable({ providedIn: 'root' })
export class GendersService {
  public name(gender: Gender): string {
    switch (gender) {
      case 'MALE':
        return 'Male';
      case 'FEMALE':
        return 'Female';
    }
  }
}
