/**
 * Debounce function.
 * @template T
 * @param {(...args: T[]) => void} fn
 * @param {number} delay
 * @returns {(...args: T[]) => void}
 */
export function debounce(fn, delay) {
    /** @type {ReturnType<typeof setTimeout> | null} */
    let timer;
    return (...args) => {
        timer && clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

/**
 * Throttle function.
 * @param {() => void} fn
 * @param {number} limit
 * @returns {() => void}
 */
export function throttle(fn, limit) {
    /** @type {boolean} */
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Waits for a condition to be true or until timeout.
 * @template T
 * @param {() => (T | boolean | Promise<T | boolean>)} conditionFn
 * @param {import("./functionTool.types.js").WaitForOptionsType} [options]
 * @returns {Promise<T | true>}
 */
export function waitFor(conditionFn, options = {}) {
    const { timeout = 3000, interval = 50, signal, immediate = true } = options;

    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        /** @type {ReturnType<typeof setTimeout> | null} */
        let timer = null;
        let isDone = false;

        const cleanup = () => {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            if (signal) {
                // eslint-disable-next-line no-use-before-define
                signal.removeEventListener('abort', onAbort);
            }
        };

        /**
         * Finalizes the wait operation.
         * @type {(action: () => void) => void}
         */
        const finalize = action => {
            if (isDone) return;
            isDone = true;
            cleanup();
            action();
        };

        const onAbort = () => {
            const abortError = new Error('Operation aborted');
            abortError.name = 'AbortError';
            finalize(() => reject(abortError));
        };

        if (signal?.aborted) {
            return onAbort();
        }

        if (signal) {
            signal.addEventListener('abort', onAbort, { once: true });
        }

        const checkCondition = async () => {
            try {
                if (isDone) return;
                const result = await conditionFn();
                if (isDone) return;

                if (signal?.aborted) {
                    onAbort();
                    return;
                }

                if (result) {
                    finalize(() => resolve(result === true ? true : result));
                    return;
                }

                if (Date.now() - startTime >= timeout) {
                    finalize(() => reject(new Error('Condition not met within timeout')));
                    return;
                }

                if (!isDone) {
                    timer = setTimeout(checkCondition, interval);
                }
            } catch (error) {
                finalize(() => reject(error));
            }
        };

        if (immediate) {
            void checkCondition();
        } else {
            if (!isDone) {
                timer = setTimeout(checkCondition, interval);
            }
        }
    });
}
