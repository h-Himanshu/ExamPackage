import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    plugins: [react()],
    server: {
      proxy: {
        '/API': {
          target: 'http://localhost:9132',
          changeOrigin: true,
        },
        '/user': {
          target: 'http://localhost:9132',
          changeOrigin: true,
        },
      },
      allowedHosts: [
        'exam-pkg-mgmt.itclub.asmitphuyal.com.np'
      ],
    },
  };
});
