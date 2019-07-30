import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import autoExternal from 'rollup-plugin-auto-external';

export default {
  input: ['./src/index.ts'],
  output: {
    dir: './dist',
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [
    nodeResolve({
      extensions: ['.js', '.ts', '.tsx'],
    }),
    commonjs(),
    babel({
      extensions: ['.js', '.ts', '.tsx'],
      exclude: 'node_modules/**',
    }),
    autoExternal(),
  ],
};
