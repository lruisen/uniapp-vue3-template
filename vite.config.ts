import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import type { UserConfig, ConfigEnv } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { wrapperEnv } from './scripts/utils';
import AutoImport from 'unplugin-auto-import/vite';
import { configHtmlPlugin } from './plugin/configHtml';
import UniManifest from '@uni-helper/vite-plugin-uni-manifest';
import Unocss from 'unocss/vite';

// https://vitejs.dev/config/
export default defineConfig(async ({ mode, command }: ConfigEnv): Promise<UserConfig> => {
  const { UNI_PLATFORM } = process.env;
  const isBuild = command === 'build';

  const env = loadEnv(mode, process.cwd());
  const viteEnv = wrapperEnv(env);
  const { VITE_GLOB_PUBLIC_PATH, VITE_APP_PORT, VITE_SHOW_SOURCEMAP, VITE_DELETE_CONSOLE } =
    viteEnv;

  return {
    base: VITE_GLOB_PUBLIC_PATH,
    plugins: [
      AutoImport({
        imports: ['vue', 'uni-app'],
        dts: './types/auto-import.d.ts',
        dirs: [], // 自动导入文件夹中的内容
        eslintrc: { enabled: true },
        vueTemplate: true, // default false
      }),
      UniManifest(),
      uni(),
      Unocss(),
      UNI_PLATFORM === 'h5' && configHtmlPlugin(viteEnv, isBuild),
    ],
    define: {
      // 定义 uniapp 运行的平台为常量
      __UNI_PLATFORM__: JSON.stringify(UNI_PLATFORM),
    },
    css: {
      postcss: {
        plugins: [],
      },
    },
    resolve: {
      alias: {
        '@/': path.join(process.cwd(), './src/'),
        '/#/': path.join(process.cwd(), './types/'),
      },
    },
    // 仅 H5 端生效，其他端不生效（其他端走build，不走devServer)
    server: {
      hmr: true,
      host: '0.0.0.0',
      port: parseInt(VITE_APP_PORT, 10),
      // proxy: undefined,
    },
    build: {
      // 方便非h5端调试
      target: 'es6',
      // 开发环境不用压缩
      minify: mode === 'development' ? false : 'terser',
      sourcemap: VITE_SHOW_SOURCEMAP === 'true', // App，小程序端源码调试需要开启 sourcemap
      terserOptions: {
        compress: {
          drop_console: VITE_DELETE_CONSOLE === 'true', // 删除 console
          drop_debugger: true, // 删除 debugger
        },
      },
      rollupOptions: {
        output: {
          // 此配置只对 H5 打包生效
          assetFileNames: (assetInfo: any): string => {
            if (assetInfo.name.endsWith('.css')) {
              return `css/[name]-[hash].css`;
            }

            const imgExt: string[] = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'];
            if (imgExt.some((ext: string) => assetInfo.name.endsWith(ext))) {
              return `images/[name]-[hash].[ext]`;
            }

            return `assets/[name]-[hash].[ext]`;
          },
        },
      },
    },
  };
});
