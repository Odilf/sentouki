import { type ClassValue, clsx } from "clsx";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
    y?: number;
    x?: number;
    start?: number;
    duration?: number;
};

export const flyAndScale = (
    node: Element,
    params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
    const style = getComputedStyle(node);
    const transform = style.transform === "none" ? "" : style.transform;

    const scaleConversion = (
        valueA: number,
        scaleA: [number, number],
        scaleB: [number, number]
    ) => {
        const [minA, maxA] = scaleA;
        const [minB, maxB] = scaleB;

        const percentage = (valueA - minA) / (maxA - minA);
        const valueB = percentage * (maxB - minB) + minB;

        return valueB;
    };

    const styleToString = (
        style: Record<string, number | string | undefined>
    ): string => {
        return Object.keys(style).reduce((str, key) => {
            if (style[key] === undefined) return str;
            // biome-ignore lint/style/useTemplate: here concat is more idiomatic and better indicates intent
            return str + `${key}:${style[key]};`;
        }, "");
    };

    return {
        duration: params.duration ?? 200,
        delay: 0,
        css: (t) => {
            const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
            const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
            const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

            return styleToString({
                transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                opacity: t,
            });
        },
        easing: cubicOut,
    };
};

export function panic(message: string): never {
    throw new Error(message);
}

/**
 * Unwrap a value that is possibly null or undefined
 */
export function unwrap<T>(
    value: T | null | undefined,
    message = "Tried to unwrap a null value"
): NonNullable<T> {
    if (value === null || value === undefined) {
        panic(message);
    }

    return value;
}

export function todo(message = "Not implemented"): never {
    throw new Error(message);
}

/**
 * Creates a promise that rejects after a certain amount of time.
 *
 * Useful for doing, e.g., `Promise.race([somePromise, delay(200)])`.
 */
export function delayReject(ms: number): Promise<void> {
    return new Promise((_, reject) => setTimeout(reject, ms));
}

export function encodePath(path: string) {
    return path.split("/").map(encodeURIComponent).join("/");
}

export function decodePath(path: string) {
    return path.split("/").map(decodeURIComponent).join("/");
}
