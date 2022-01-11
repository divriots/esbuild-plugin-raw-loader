import fs from "fs";
import path from "path";
import type { Plugin } from 'esbuild';

export interface RawLoaderPluginOptions {
}

module.exports = function rawLoaderPlugin({}: RawLoaderPluginOptions = {}): Plugin {
  return {
    name: "esbuild:plugin:raw-loader",
    setup(build) {
      build.onResolve(
        { filter: /^!!raw-loader!/ },
        ({ path: id, importer }) => ({
          path: id.slice('!!raw-loader!'.length).startsWith('.')
            ? path.resolve(
                path.dirname(importer),
                id.slice('!!raw-loader!'.length)
              )
            : require.resolve(id.slice('!!raw-loader!'.length)),
          namespace: 'raw',
        })
      );
      build.onLoad({ filter: /./, namespace: 'raw' }, async ({ path }) => {
        return {
          contents: `export default ${JSON.stringify(
            await fs.promises.readFile(path, 'utf-8')
          )}`,
          loader: 'js',
          watchFiles: [path]
        };
      });
    },
  };
}
