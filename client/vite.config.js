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
          target: 'https://exam-backend.itclub.asmitphuyal.com.np',
          changeOrigin: true,
        },
      },
      allowedHosts: [
        'exam-pkg-mgmt.itclub.asmitphuyal.com.np'
      ],
    },
  };
});
