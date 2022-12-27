export function sanitizeFilepath(filepath: string): string {
    return filepath.replace(/(\/)[(/)]/g, '/');
}

export function splitFilepath(
    filepath: string,
    splitter: string = ' '
): string[] {
    return filepath.replace(/(\/|\/\/|\\|\\\\)/g, splitter).split(splitter);
}
