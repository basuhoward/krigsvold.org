import { cp, mkdir, rm } from 'node:fs/promises';
await rm('.generated/public', { recursive: true, force: true });
await mkdir('.generated/public', { recursive: true });
await cp('assets', '.generated/public/assets', { recursive: true });
for (const file of ['CNAME','robots.txt','llms.txt']) await cp(file, '.generated/public/'+file);
