import typescript from '@rollup/plugin-typescript';

export default {
  input: 'manual-test/manual-test.ts',
  output: {
    file: 'manual-test/manual-test.js',
    format: 'umd'
  },
  plugins: [typescript({
    tsconfig: false,
    include: ['src/**/*.ts', 'manual-test/manual-test.ts'],
    compilerOptions: {
      ignoreDeprecations: '6.0',
      lib: ['es6', 'dom'],
      module: 'esnext',
      strict: false,
      target: 'es5'
    }
  })]
};
