import { Injectable } from '@angular/core';
import { Assets, Texture } from 'pixi.js';
import { from, Observable, tap } from 'rxjs';

@Injectable()
export class TextureService {
  private texturesPaths: string[] = [];
  public textures: Record<string, Texture> = {};

  public grounds = [
    '/tiles/ground/ground_01.png',
    '/tiles/ground/ground_02.png',
    '/tiles/ground/ground_03.png',
    '/tiles/ground/ground_04.png',
    '/tiles/ground/ground_05.png',
    '/tiles/ground/ground_06.png',
    '/tiles/ground/ground_07.png',
    '/tiles/ground/ground_08.png',
    '/tiles/ground/ground_09.png',
    '/tiles/ground/ground_10.png',
    '/tiles/ground/ground_11.png',
    '/tiles/ground/ground_12.png',
  ];

  public load(path: string): Observable<Texture> {
    if (!this.texturesPaths.includes(path)) {
      this.texturesPaths.push(path);
    }

    return from(Assets.load<Texture>(path)).pipe(
      tap((texture) => {
        this.textures[path] = texture;
      }),
    );
  }

  public shutdown(): void {
    void Assets.unload(this.texturesPaths);
  }
}
