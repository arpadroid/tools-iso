import { debounce, throttle, waitFor } from './functionTool.js';

const store = {
    conditionMet: false
};

describe('Function Tool', () => {
    afterEach(() => {
        if (jest.isMockFunction(setTimeout)) {
            jest.runOnlyPendingTimers();
            jest.clearAllTimers();
        }
        jest.useRealTimers();
        store.conditionMet = false;
    });

    test('debounce function should delay execution', async () => {
        jest.useFakeTimers();
        const fn = jest.fn();
        const debouncedFn = debounce(fn, 1000);

        debouncedFn();
        debouncedFn();
        debouncedFn();

        expect(fn).not.toHaveBeenCalled();

        jest.advanceTimersByTime(1000);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    test('throttle function should limit execution rate', async () => {
        jest.useFakeTimers();
        const fn = jest.fn();
        const throttledFn = throttle(fn, 1000);

        throttledFn();
        throttledFn();
        throttledFn();

        expect(fn).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(1000);
        throttledFn();
        expect(fn).toHaveBeenCalledTimes(2);
    });

    test('waitFor function should resolve when condition is met', async () => {
        jest.useRealTimers();
        setTimeout(() => {
            store.conditionMet = true;
        }, 500);

        await expect(waitFor(() => store.conditionMet, { timeout: 2000, interval: 100 })).resolves.toBe(true);
    });

    test('waitFor function should reject on timeout', async () => {
        jest.useRealTimers();

        await expect(waitFor(() => false, { timeout: 200, interval: 50 })).rejects.toThrow(
            'Condition not met within timeout'
        );
    });

    test('waitFor function should support async condition', async () => {
        jest.useRealTimers();
        let count = 0;

        const result = await waitFor(
            async () => {
                count += 1;
                return count >= 3 ? 'ready' : false;
            },
            { timeout: 1000, interval: 50 }
        );

        expect(result).toBe('ready');
    });

    test('waitFor function should support cancellation', async () => {
        jest.useRealTimers();
        const controller = new AbortController();

        const promise = waitFor(() => false, {
            timeout: 2000,
            interval: 50,
            signal: controller.signal
        });

        controller.abort();

        await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
    });
});
