export interface RenderSettings {
  pixelsPerUnit: number;
  clearColor: string;
}

export const defaultRenderSettings = (): RenderSettings => ({
  pixelsPerUnit: 32,
  clearColor: '#000',
});
