import { IVec3 } from '../math/vector3.js';

export interface IAABB {
  readonly position: IVec3;
  readonly size: IVec3;
}

export interface ICircle {
  readonly position: IVec3;
  readonly radius: number;
}
