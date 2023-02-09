import fs from "fs";
import p from "path";

export function normalize(...paths: string[])
{
    return p.normalize(p.join(...paths));
}

export function exists(path: string)
{
    path = normalize(path);

    try { fs.statSync(path); return true; }
    catch (e) {}

    return false;
}

export function writeFile(path: string, data: string)
{
    path = normalize(path);
    
    fs.mkdirSync(p.dirname(path), { recursive: true });
    fs.writeFileSync(path, data ?? '');
}

export function readFile(path: string)
{
    path = normalize(path);
    
    return fs.readFileSync(path, { encoding: 'utf-8' });
}

export function copyFile(from: string, to: string)
{
    from = normalize(from);
    to = normalize(to);

    fs.mkdirSync(p.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
}

export function b2fSlash(path: string)
{
    return path.split('\\').join('/');
}