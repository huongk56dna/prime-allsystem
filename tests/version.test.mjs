import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,readdirSync} from 'node:fs';
// Every module import and asset link must use the same cache-bust version, or browsers mix stale and new modules.
test('all ?v= cache-bust versions match',()=>{
 const dir=new URL('../docs/',import.meta.url),found=new Map();
 for(const f of readdirSync(dir).filter(f=>/\.(js|html)$/.test(f)))for(const m of readFileSync(new URL(f,dir),'utf8').matchAll(/\?v=(\d+)/g))found.set(m[1],[...(found.get(m[1])||[]),f]);
 assert.equal(found.size,1,'Mixed versions: '+JSON.stringify(Object.fromEntries(found)));
});
