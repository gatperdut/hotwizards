import { Injectable } from '@angular/core';
import { Assets, Texture } from 'pixi.js';
import { forkJoin, from, Observable, tap } from 'rxjs';
import { GroundSpritePaths } from '../types/ground-sprite-paths.const';

@Injectable()
export class TextureService {
  public textures: Record<string, Texture> = {};

  public setup(): Observable<Texture[]> {
    return forkJoin(
      [...GroundSpritePaths].map((spritePath) =>
        from(Assets.load<Texture>(spritePath)).pipe(
          tap((texture) => {
            this.textures[spritePath] = texture;
          }),
        ),
      ),
    );
  }

  public shutdown(): void {
    void Assets.unload([...GroundSpritePaths]);
  }
}
