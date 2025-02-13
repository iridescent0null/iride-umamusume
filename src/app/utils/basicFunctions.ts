// simple type guards to let ts narrow types
/** just to remove undefined */
function isDefined<T>(x: T | undefined): x is T {
    return x !== undefined;
}

/** just to remove falsy values (especially "") */
function isTruely<T>(x: T | undefined): x is T {
    return !!x;
}

export { isDefined, isTruely };