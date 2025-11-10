import { Vector2 } from '@stdlib/math/vector2';

interface MouseButtonState {
  downThisFrame: boolean;
  upThisFrame: boolean;
  pressed: boolean;
  queuedState: boolean;
  frame: number;
}

const MouseButtonP2 = {
  left: 1,
  right: 2,
} as const;

export class MouseInput {
  public readonly mousePosition: Vector2;

  #_scrollAmount: number;
  #_mouseBtn1State: MouseButtonState;
  #_mouseBtn2State: MouseButtonState;

  #_canvas: HTMLCanvasElement | null;

  constructor() {
    this.#_canvas = null;
    this.mousePosition = new Vector2();
    this.#_scrollAmount = 0;
    this.#_mouseBtn1State = {
      downThisFrame: false,
      upThisFrame: false,
      pressed: false,
      queuedState: false,
      frame: 0,
    };
    this.#_mouseBtn2State = {
      downThisFrame: false,
      upThisFrame: false,
      pressed: false,
      queuedState: false,
      frame: 0,
    };
  }

  public attach(canvas: HTMLCanvasElement): void {
    if (this.#_canvas !== null) {
      throw new Error('MouseInput already attached to canvas!');
    }

    this.#_canvas = canvas;

    // press not working...
    canvas.addEventListener('mousedown', this.#handleMouseEvent);
    canvas.addEventListener('mouseup', this.#handleMouseEvent);
    window.addEventListener('mousemove', this.#handleMouseEvent);
    window.addEventListener('contextmenu', this.#disableContextMenu);
  }

  public tick(frame: number): void {
    this.#_mouseBtn1State = this.#updateButtonState(frame, this.#_mouseBtn1State);
    this.#_mouseBtn2State = this.#updateButtonState(frame, this.#_mouseBtn2State);
  }

  public detach(): void {
    this.#_canvas?.removeEventListener('mousedown', this.#handleMouseEvent);
    this.#_canvas?.removeEventListener('mouseup', this.#handleMouseEvent);
    window.removeEventListener('mousemove', this.#handleMouseEvent);
    window.removeEventListener('contextmenu', this.#disableContextMenu);
  }

  public getMouse1DownThisFrame(): boolean {
    return this.#_mouseBtn1State.downThisFrame;
  }

  public getMouse1Pressed(): boolean {
    return this.#_mouseBtn1State.pressed;
  }

  public getMouse1UpThisFrame(): boolean {
    return this.#_mouseBtn1State.upThisFrame;
  }

  public getMouse2DownThisFrame(): boolean {
    return this.#_mouseBtn2State.downThisFrame;
  }

  public getMouse2Pressed(): boolean {
    return this.#_mouseBtn2State.pressed;
  }

  public getMouse2UpThisFrame(): boolean {
    return this.#_mouseBtn2State.upThisFrame;
  }

  #updateButtonState(frame: number, state: MouseButtonState): MouseButtonState {
    if (state.queuedState !== state.pressed) {
      const { queuedState } = state;
      return {
        downThisFrame: queuedState,
        upThisFrame: !queuedState,
        pressed: queuedState,
        queuedState,
        frame,
      };
    }

    if (state.downThisFrame && state.frame !== frame) {
      return {
        ...state,
        downThisFrame: false,
      };
    }

    if (state.upThisFrame && state.frame !== frame) {
      return {
        ...state,
        upThisFrame: false,
      };
    }

    return state;
  }

  #disableContextMenu = (ev: Event): void => {
    ev.stopPropagation();
  };

  #handleMouseEvent = (ev: MouseEvent): void => {
    ev.preventDefault();
    ev.stopPropagation();
    const { buttons, clientX, clientY } = ev;

    // Check for left mouse button
    this.#_mouseBtn1State.queuedState = Boolean(buttons & MouseButtonP2.left);
    this.#_mouseBtn2State.queuedState = Boolean(buttons & MouseButtonP2.right);
    this.mousePosition.x = clientX;
    this.mousePosition.y = clientY;
  };
}
