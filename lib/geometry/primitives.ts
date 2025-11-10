import { IVec2 } from '../math/vector2.js';
import { IVec3 } from '../math/vector3.js';

export interface IAABB {
  readonly min: IVec3;
  readonly max: IVec3;
}

export interface IAABB2D {
  readonly min: IVec2;
  readonly max: IVec2;
}

export interface ICircle {
  readonly position: IVec2;
  readonly radius: number;
}

export interface ISphere {
  readonly position: IVec3;
  readonly radius: number;
}

export interface IRay2D {
  readonly position: IVec2;
  readonly direction: IVec2;
}

export interface IRay3D {
  readonly position: IVec3;
  readonly direction: IVec3;
}
