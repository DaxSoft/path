export function sanitizeFilepath(filepath: string): string {
    return filepath.replace(/(\/)[(/)]/g, '/');
}
