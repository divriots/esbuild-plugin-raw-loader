import fs from "fs";
import path from "path";
import type { Plugin } from 'esbuild';

export interface RawLoaderPluginOptions {
}

module.exports = function rawLoaderPlugin({}: RawLoaderPluginOptions = {}): Plugin {
  return {
    name: "esbuild:plugin:raw-loader",
    setup(build) {
      const namespace = 'raw';
      build.onResolve(
        { filter: /^!!raw-loader!/ },
        async ({ path: id, resolveDir }) => {
          const target = id.slice('!!raw-loader!'.length)
          const resolved = await build.resolve(target, { resolveDir })
          if (resolved.path && !resolved.external) {
            return {
              ...resolved,
              namespace,
            }
          }
          if (id.startsWith('.')) {
            return {
              path: path.resolve(resolveDir, id),
              namespace,
            }
          }
          return {
            path: require.resolve(id), // TODO should be relative to resolveDir
            namespace,
          }
        }
      );
      build.onLoad({ filter: /./, namespace }, async ({ path }) => {
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
