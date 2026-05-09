import { Injectable } from '@angular/core';
import { Assets, Texture } from 'pixi.js';
import { forkJoin, from, Observable, tap } from 'rxjs';
import { BaseSpritePaths } from '../types/base-sprite-paths.const';
import { FeatureSpritePaths } from '../types/feature-sprite-paths.const';

@Injectable()
export class TextureService {
  public textures: Record<string, Texture> = {};

  private texturePaths = [...BaseSpritePaths, ...FeatureSpritePaths];

  public setup(): Observable<Texture[]> {
    return forkJoin(
      this.texturePaths.map((spritePath) =>
        from(Assets.load<Texture>(spritePath)).pipe(
          tap((texture) => {
            this.textures[spritePath] = texture;
          }),
        ),
      ),
    );
  }

  public shutdown(): void {
    void Assets.unload(this.texturePaths);
  }
}
