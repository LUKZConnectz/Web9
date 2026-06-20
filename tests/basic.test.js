import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('app includes the five requested shop systems', () => {
  const source = readFileSync('src/main.js','utf8');
  ['shop','modal','topup','cart','orders'].forEach(name => assert.match(source, new RegExp(`${name}`)));
});
