import { Injectable } from '@angular/core';
import { SpritePaths } from '@hw/shared/sprites';
import { Assets, Texture } from 'pixi.js';
import { forkJoin, from, Observable, tap } from 'rxjs';

@Injectable()
export class TextureService {
  public textures: Record<string, Texture> = {};

  private spritePaths = SpritePaths.slice();

  public setup(): Observable<Texture[]> {
    return forkJoin(
      this.spritePaths.map((spritePath) =>
        from(Assets.load<Texture>(spritePath)).pipe(
          tap((texture) => {
            this.textures[spritePath] = texture;
          }),
        ),
      ),
    );
  }

  public shutdown(): void {
    void Assets.unload(this.spritePaths);
  }
}
