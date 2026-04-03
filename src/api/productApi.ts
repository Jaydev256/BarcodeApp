
import { API } from "./api";
export const fetchProducts = async () => {
  try {
    console.log("📡 Calling API: /products");

    const res = await API.get("/products");

    console.log("✅ API Response Status:", res.status);
    console.log("📦 Data received:", res.data);

    return res.data;
  } catch (error: any) {
    console.log("❌ API Error:", error.message);

    if (error.response) {
      console.log("🔴 Server responded with:", error.response.data);
      console.log("🔴 Status code:", error.response.status);
    } else if (error.request) {
      console.log("⚠️ No response received:", error.request);
    } else {
      console.log("⚠️ Error setting up request:", error);
    }

    return [];
  }
};
