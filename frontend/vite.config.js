// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// });

  // build: {
  //   rollupOptions: {
  //     external: [
  //       "react", // ignore react stuff
  //       "react-dom",
  //     ],
  //   },
  // }

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://mern-ecommerce-2wa7.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
