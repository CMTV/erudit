export function indent(str: string, level: number = 1)
{
    return str.split('\n').map(line => line.length ? (('    '.repeat(level)) + line) : '').join('\n');
}