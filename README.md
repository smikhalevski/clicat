# clicat&ensp;[![build](https://github.com/smikhalevski/clicat/actions/workflows/master.yml/badge.svg?branch=master&event=push)](https://github.com/smikhalevski/clicat/actions/workflows/master.yml)

CLI arguments parser.

```sh
npm install --save-prod clicat
```

```ts
import { parseCliOptions } from 'clicat';

const result = parseCliOptions(process.argv.slice(2), {
  foo: 'f',
  bar: ['b', 'B'],
});

result.foo;
// → ['hello']
```
