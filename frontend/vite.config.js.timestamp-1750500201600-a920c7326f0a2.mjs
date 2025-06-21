// vite.config.js
import path from "path";
import { defineConfig, loadEnv } from "file:///D:/dev/reactjs/idurar-erp-crm/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///D:/dev/reactjs/idurar-erp-crm/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\dev\\reactjs\\idurar-erp-crm\\frontend";
var vite_config_default = ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const proxy_url = process.env.VITE_DEV_REMOTE === "remote" ? process.env.VITE_BACKEND_SERVER : "http://localhost:8888/";
  const config = {
    plugins: [react()],
    resolve: {
      base: "/",
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "src")
      }
    },
    server: {
      port: 3e3,
      proxy: {
        "/api": {
          target: proxy_url,
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
  return defineConfig(config);
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxkZXZcXFxccmVhY3Rqc1xcXFxpZHVyYXItZXJwLWNybVxcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcZGV2XFxcXHJlYWN0anNcXFxcaWR1cmFyLWVycC1jcm1cXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2Rldi9yZWFjdGpzL2lkdXJhci1lcnAtY3JtL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcblxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7IG1vZGUgfSkgPT4ge1xyXG4gIHByb2Nlc3MuZW52ID0geyAuLi5wcm9jZXNzLmVudiwgLi4ubG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKSB9O1xyXG5cclxuICBjb25zdCBwcm94eV91cmwgPVxyXG4gICAgcHJvY2Vzcy5lbnYuVklURV9ERVZfUkVNT1RFID09PSAncmVtb3RlJ1xyXG4gICAgICA/IHByb2Nlc3MuZW52LlZJVEVfQkFDS0VORF9TRVJWRVJcclxuICAgICAgOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4Lyc7XHJcblxyXG4gIGNvbnN0IGNvbmZpZyA9IHtcclxuICAgIHBsdWdpbnM6IFtyZWFjdCgpXSxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYmFzZTogJy8nLFxyXG4gICAgICBhbGlhczoge1xyXG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBwb3J0OiAzMDAwLFxyXG4gICAgICBwcm94eToge1xyXG4gICAgICAgICcvYXBpJzoge1xyXG4gICAgICAgICAgdGFyZ2V0OiBwcm94eV91cmwsXHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH07XHJcbiAgcmV0dXJuIGRlZmluZUNvbmZpZyhjb25maWcpO1xyXG59O1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThTLE9BQU8sVUFBVTtBQUUvVCxTQUFTLGNBQWMsZUFBZTtBQUN0QyxPQUFPLFdBQVc7QUFIbEIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQzNCLFVBQVEsTUFBTSxFQUFFLEdBQUcsUUFBUSxLQUFLLEdBQUcsUUFBUSxNQUFNLFFBQVEsSUFBSSxDQUFDLEVBQUU7QUFFaEUsUUFBTSxZQUNKLFFBQVEsSUFBSSxvQkFBb0IsV0FDNUIsUUFBUSxJQUFJLHNCQUNaO0FBRU4sUUFBTSxTQUFTO0FBQUEsSUFDYixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsSUFDakIsU0FBUztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLE1BQ3BDO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLFVBQ04sUUFBUTtBQUFBLFVBQ1IsY0FBYztBQUFBLFVBQ2QsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDQSxTQUFPLGFBQWEsTUFBTTtBQUM1QjsiLAogICJuYW1lcyI6IFtdCn0K
