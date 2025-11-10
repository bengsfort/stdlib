import { describe, it, expect, vi } from 'vitest';

import { EventDispatcher, EventMap } from '../event-dispatcher.js';

interface TestEventMap extends EventMap {
  foo: [value: number, bool: boolean];
  bar: [str: string];
  gaz: [];
}

describe('EventDispatcher', () => {
  it('should expose how many listeners are currently attached', () => {
    const dispatch = new EventDispatcher<TestEventMap>();

    expect(dispatch.getListenerCount()).toEqual(0);

    const onFoo = vi.fn();
    const onBar = vi.fn();

    dispatch.addListener('foo', onFoo);
    dispatch.addListener('bar', onBar);
    expect(dispatch.getListenerCount()).toEqual(2);

    dispatch.removeListener('foo', onFoo);
    expect(dispatch.getListenerCount()).toEqual(1);

    dispatch.removeAllListeners();
    expect(dispatch.getListenerCount()).toEqual(0);
  });

  it('should expose the event names that have listeners', () => {
    const dispatch = new EventDispatcher<TestEventMap>();

    expect(dispatch.getEvents()).toHaveLength(0);

    dispatch.addListener('foo', () => {});
    expect(dispatch.getEvents()).toContain('foo');

    const onGaz = (): void => {};
    dispatch.addListener('foo', () => {});
    dispatch.addListener('gaz', onGaz);
    const withGaz = dispatch.getEvents();

    expect(withGaz).toHaveLength(2);
    expect(withGaz).toContain('gaz');

    dispatch.removeListener('gaz', onGaz);
    const withoutGaz = dispatch.getEvents();

    expect(withoutGaz).toHaveLength(1);
    expect(withoutGaz).not.toContain('gaz');
  });

  it('should support adding event listeners and triggering events', () => {
    const dispatch = new EventDispatcher<TestEventMap>();
    const onFoo = vi.fn();

    dispatch.addListener('foo', onFoo);
    dispatch.trigger('foo', 52, true);
    expect(onFoo).toHaveBeenCalledExactlyOnceWith(52, true);
  });

  it('should not call a listener after removing it', () => {
    const dispatch = new EventDispatcher<TestEventMap>();
    const onFoo = vi.fn();

    dispatch.addListener('foo', onFoo);
    dispatch.trigger('foo', 52, true);
    dispatch.removeListener('foo', onFoo);
    dispatch.trigger('foo', 5, false);

    expect(onFoo).toHaveBeenCalledExactlyOnceWith(52, true);
  });

  it('should only call listeners for the event that is being triggered', () => {
    const dispatch = new EventDispatcher<TestEventMap>();
    const onFoo = vi.fn();
    const onBar = vi.fn();

    dispatch.addListener('foo', onFoo);
    dispatch.addListener('bar', onBar);

    dispatch.trigger('foo', 52, true);
    dispatch.trigger('bar', 'triggered');

    expect(onFoo).toHaveBeenCalledExactlyOnceWith(52, true);
    expect(onBar).toHaveBeenCalledExactlyOnceWith('triggered');
  });

  it('should support removing a listener after one event', () => {
    const dispatch = new EventDispatcher<TestEventMap>();
    const onFoo = vi.fn();

    dispatch.addListener('foo', onFoo, true);
    expect(dispatch.getListenerCount()).toEqual(1);

    dispatch.trigger('foo', 52, true);
    dispatch.trigger('foo', 30, false);
    expect(onFoo).toHaveBeenCalledExactlyOnceWith(52, true);

    expect(dispatch.getListenerCount()).toEqual(0);
  });

  it('should support removing a listener via the unsub callback', () => {
    const dispatch = new EventDispatcher<TestEventMap>();
    const onFoo = vi.fn();

    const unsub = dispatch.addListener('foo', onFoo);
    expect(dispatch.getListenerCount()).toEqual(1);
    dispatch.trigger('foo', 52, true);

    unsub();
    expect(dispatch.getListenerCount()).toEqual(0);
    dispatch.trigger('foo', 30, false);
    expect(onFoo).toHaveBeenCalledExactlyOnceWith(52, true);
  });
});
