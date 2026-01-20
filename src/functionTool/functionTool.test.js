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

    test('waitFor function should abort immediately if signal already aborted', async () => {
        jest.useRealTimers();
        const controller = new AbortController();
        controller.abort();

        const promise = waitFor(() => true, {
            timeout: 1000,
            interval: 50,
            signal: controller.signal
        });

        await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
    });

    test('waitFor function should handle abort during async condition check', async () => {
        jest.useRealTimers();
        const controller = new AbortController();
        let checkCount = 0;

        const promise = waitFor(
            async () => {
                checkCount++;
                // Abort after first check
                if (checkCount === 1) {
                    controller.abort();
                }
                await new Promise(resolve => setTimeout(resolve, 10));
                return false;
            },
            {
                timeout: 2000,
                interval: 50,
                signal: controller.signal
            }
        );

        await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
    });

    test('waitFor function should work with immediate=false', async () => {
        jest.useRealTimers();
        let count = 0;

        const result = await waitFor(
            () => {
                count += 1;
                return count >= 2;
            },
            { timeout: 1000, interval: 50, immediate: false }
        );

        expect(result).toBe(true);
    });

    test('waitFor function should handle condition throwing error', async () => {
        jest.useRealTimers();

        const promise = waitFor(
            () => {
                throw new Error('Test error');
            },
            { timeout: 1000, interval: 50 }
        );

        await expect(promise).rejects.toThrow('Test error');
    });

    test('debounce function should cancel previous timer on new call', async () => {
        jest.useFakeTimers();
        const fn = jest.fn();
        const debouncedFn = debounce(fn, 100);

        debouncedFn('first');
        jest.advanceTimersByTime(50);
        debouncedFn('second');
        jest.advanceTimersByTime(100);

        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith('second');
    });

    test('throttle function should pass arguments correctly', async () => {
        jest.useFakeTimers();
        const fn = jest.fn();
        const throttledFn = throttle(fn, 100);

        throttledFn('arg1', 'arg2');
        expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });
});
