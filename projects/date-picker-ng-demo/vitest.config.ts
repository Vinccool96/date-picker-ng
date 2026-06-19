import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    server: {
      deps: {
        inline: [/fesm2022/, /fesm2015/],
      },
    },
  },
});
