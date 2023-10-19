# esbuild-plugin-rawbundle [![npm](https://img.shields.io/npm/v/esbuild-plugin-rawbundle.svg)](https://www.npmjs.com/package/esbuild-plugin-rawbundle)

### Installation

```
npm install --save-dev esbuild-plugin-rawbundle
```

### Usage

Add it to esbuild plugins

```js
import rawBundlePlugin from 'esbuild-plugin-rawbundle';

const esbuildOptions = {
  format: 'esm',
  platform: 'browser',
}

const buildOptions = {
  plugins: [rawBundlePlugin({ esbuildOptions })]
}
```

Then you can import ?rawbundle modules:

```js
import rawBundle from 'jquery?rawbundle';

// rawBundle default export esm bundled jquery output
```

### License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2021-present, <DIV>Riots
