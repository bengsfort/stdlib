export type EventMap = Record<string, unknown[]>;
export type EventType<Map extends EventMap> = keyof Map;
export type EventPayload<
  Map extends EventMap,
  Key extends EventType<Map> = EventType<Map>,
> = Map[Key];
export type EventListener<
  Map extends EventMap,
  Key extends EventType<Map> = EventType<Map>,
> = (...args: EventPayload<Map, Key>) => void | Promise<void>;

type LazyListenerMap<Map extends EventMap> = {
  [K in keyof Map]?: Set<EventListener<Map, K>>;
};

type UnsubListener = () => void;

export class EventDispatcher<Map extends EventMap> {
  #_listeners: LazyListenerMap<Map> = {};
  #_autoRemoveListeners: LazyListenerMap<Map> = {};

  #_listenerCount = 0;
  #_events = new Set<EventType<Map>>();

  public addListener<Event extends EventType<Map> = EventType<Map>>(
    event: Event,
    listener: EventListener<Map, Event>,
    once?: boolean,
  ): UnsubListener {
    // Lazy-instantiate the listener set.
    let listeners = this.#_listeners[event];
    if (!listeners) {
      listeners = new Set();
      this.#_listeners[event] = listeners;
      this.#_events.add(event);
    }

    const unsub: UnsubListener = () => {
      this.removeListener(event, listener);
    };

    // Only add the listener if we don't already have it.
    if (listeners.has(listener)) {
      return unsub;
    }

    this.#_listenerCount++;
    listeners.add(listener);

    // Cache the listener reference to the auto remove set so we can remove it
    // after it triggers for the first time.
    if (once) {
      let autoRemoveListeners = this.#_autoRemoveListeners[event];

      if (!autoRemoveListeners) {
        autoRemoveListeners = new Set();
        this.#_autoRemoveListeners[event] = autoRemoveListeners;
      }

      autoRemoveListeners.add(listener);
    }

    return unsub;
  }

  public removeListener<Event extends EventType<Map> = EventType<Map>>(
    event: Event,
    listener: EventListener<Map, Event>,
  ): void {
    const listeners = this.#_listeners[event];
    if (listeners && listeners.delete(listener)) {
      this.#_listenerCount = Math.max(this.#_listenerCount - 1, 0);
    }

    // TODO: Implement
  }

  public removeAllListeners(): void {
    // TODO: Implement
  }

  public getListenerCount(): number {
    return this.#_listenerCount;
  }

  public getEvents(): EventType<Map>[] {
    return [...this.#_events];
  }
}
