import { NgIf } from "@angular/common";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectorRef,
  Component,
  Input,
  computed,
  effect,
  signal,
} from "@angular/core";
import {
  NgtArgs,
  NgtCanvas,
  NgtMesh,
  NgtRepeat,
  NgtVector3,
  extend,
} from "angular-three";
import { NgtsGrid } from "angular-three-soba/abstractions";
import { NgtsOrbitControls } from "angular-three-soba/controls";
import * as THREE from "three";

extend(THREE);

const selected = signal<NgtMesh | null>(null);

@Component({
  selector: "app-cube",
  standalone: true,
  templateUrl: "./cube.html",
  imports: [NgIf],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Cube {
  @Input({ required: true }) position!: number[];

  readonly selected = selected;
  readonly hovered = signal(false);
}

@Component({
  standalone: true,
  templateUrl: "./scene.html",
  imports: [NgtArgs, NgtsGrid, NgtsOrbitControls, NgtRepeat, NgIf, Cube],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: { "(document:keydown)": "onKeyDown($event)" },
})
export class SceneGraph {
  readonly Math = Math;
  readonly boxCount = signal(20);

  readonly positions = computed(() =>
    Array.from({ length: this.boxCount() }, () => [
      THREE.MathUtils.randInt(-8, 8),
      0.5,
      THREE.MathUtils.randInt(-8, 8),
    ])
  );

  readonly selected = selected;

  onKeyDown(event: KeyboardEvent) {
    const selected = this.selected();
    if (selected) {
      const position = selected.position as THREE.Vector3;
      switch (event.key) {
        case "w":
          position.setZ(position.z - 1);
          break;
        case "a":
          position.setX(position.x - 1);
          break;
        case "s":
          position.setZ(position.z + 1);
          break;
        case "d":
          position.setX(position.x + 1);
          break;
      }
    }
  }
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [NgtCanvas],
  templateUrl: "./app.html",
})
export class AppComponent {
  readonly scene = SceneGraph;
  readonly selected = selected;
}
