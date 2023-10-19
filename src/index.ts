import type { Plugin, BuildOptions } from 'esbuild';

export interface RawLoaderPluginOptions {
  esbuildOptions: Partial<BuildOptions>
}

module.exports = function rawLoaderPlugin({ esbuildOptions }: RawLoaderPluginOptions): Plugin {
  return {
    name: "esbuild:plugin:rawbundle",
    setup(build) {
      build.onResolve(
        { filter: /.*\?rawbundle$/ },
        async ({ path, resolveDir }) => {
          return {
            path: path.slice(0, -'?rawbundle'.length),
            namespace: 'rawbundle',
            pluginData: {
              resolveDir
            }
          }
        }
      );
      build.onLoad({ filter: /./, namespace: 'rawbundle' }, async ({ path, pluginData: { resolveDir } }) => {
        const result = await build.esbuild.build({
          absWorkingDir: resolveDir,
          entryPoints: [path],
          bundle: true,
          write: false,
          sourcemap: false,
          ...esbuildOptions
        });
        return {
          contents: `export default ${JSON.stringify(
            result.outputFiles![0].text
          )}`,
          loader: 'js',
        };
      });
    },
  };
}
