import { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { API } from "../../src/api/api";
export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState("");
  const [products, setProducts] = useState<any[]>([]);

//    decalring new variables that only work  fetch data from db.json 

const [productName, setProductName] = useState("");
const [barcodeValue, setBarcodeValue] = useState("");
const [isValid, setIsValid] = useState<boolean|null>(null);  

  useEffect(() => {
    API.get("/products")
      .then((res) => {
        console.log("Products loaded", res.data);
        setProducts(res.data);
      })
      .catch((err) => {
        console.log("API Error", err.message);
      });
  }, []);
  // 🔥 Main logic
  const handleScan = ({ data }: { data: string }) => {
    setScanned(true);

    console.log("📦 Scanned:", data);
    // last digit
    const lastDigit = Number(data.slice(-1));
    const isValid = lastDigit % 2 === 0;
    setIsValid(isValid);

    const product = products.find((p) => p.barcode.toString() === data);
    const productName = product ? product.name : "Unknown Product";
    // dummy product mapping
   
    setProductName(product?product.name:"Unknown Product");
    setBarcodeValue(data);
    setResult(
      `Product: ${productName}
        Barcode: ${data}
        Valid: ${isValid ? "Vaild" : "Invalid"}`,
    );
  };

  // permession handling
  if (!permission) {
    return <Text>Requesting Permission...</Text>;
  }
  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No camera access</Text>
        <Button title="Allow camera" onPress={requestPermission}></Button>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* camera */}
      {!scanned && (
        <CameraView
          style={{ flex: 1 }}
          barcodeScannerSettings={{ barcodeTypes: ["qr", "ean13", "code128"] }}
          onBarcodeScanned={scanned ? undefined : handleScan}
        />
      )}
      {/* Result */}
      {scanned && (
        <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
          {/* <Text>{result}</Text> */} this is first result that is working
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Scan Result</Text>
          {/* <Button title="Scan Again" onPress={() => setScanned(false)} /> */}
          ye bhi kaam kr ra tha
          <View
            style={{
              borderWidth: 1,
              padding: 10,
              marginBottom: 15,
            }}
          >
            <Text>Product: {productName}</Text>
            <Text>Barcode: {barcodeValue}</Text>
            <Text>Status: {isValid ? "Valid ✅" : "Invalid ❌"}</Text>
          </View>
          <Button title="Scan Again" onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
}
