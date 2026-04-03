import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Touchable,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Button } from "react-native";
import { API } from "../../src/api/api";

import {router}from "expo-router";
type Product = {
  id: string;
  name: string;
  dealerPrice: number;
  retailPrice: number;
  moq: number;
};
type CartItem = {
  product: Product;
  quantity: number;
};
export default function Index() {
  const [products, setProducts] = useState<Product[]>([]);

  // const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [customerType, setCustomerType] = useState("retail");
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]); // this is for multiple product order, we can show this in cart screen and place order from there, for now we are just adding to cart without showing it anywhere

  
  const placeOrder = () => {
    if (!selectedProduct) {
      setError("Please select a product");
      return;
    }
    const qty = Number(quantity);
    if (qty < selectedProduct.moq) {
      setError("MOQ not satisfied");
      return;
    }
    setError("");
    const price =
      customerType === "dealer"
        ? selectedProduct.dealerPrice
        : selectedProduct.retailPrice;
    setTotal(price * qty);
  };

  const addToCart = (product: Product) => {
    const qty = Number(quantity);

    if (!qty) {
      setError("Please enter quantity");
      return;
    }
    if (qty < product.moq) {
      setError("MOQ not satisfied");
      return;
    }
    setError("");

    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item,
        ),
      );
    } else {
      setCart([...cart, { product, quantity: qty }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const resetCart = () => {
    setCart([]);
    setSelectedProduct(null);
    setQuantity(0);
    setTotal(0);
    setError("");
  };

  const getTotal = () => {
    return cart.reduce((total, item) => {
      const price =
        customerType === "dealer"
          ? item.product.dealerPrice
          : item.product.retailPrice;

      return total + price * item.quantity;
    }, 0);
  };

  //  this is for bar code logic
 

    useEffect(() => {
      console.log("🌐 BASE URL:", API.defaults.baseURL);
      console.log("📡 Calling API: /products");

      API.get("/products")
        .then((res) => {
          console.log("✅ Response:", res.data);
          setProducts(res.data);
        })
        .catch((err) => {
          console.log("❌ Error:", err.message);
        });

      
      
    }, []);

    return (
      <View style={{ padding: 30, marginTop: 40 }}>
        {/* Customer Type */}
        {/* <Text>Customer Type:</Text>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 10,
            justifyContent: "space-around",
          }}
        >
          <Button title="Dealer" onPress={() => setCustomerType("dealer")} />
          <Button title="Retail" onPress={() => setCustomerType("retail")} />
        </View> */}  yeh kaam kr ra ha shi se 
    
 <Text style={{ padding: 9, fontSize: 20 }}>Customer Type:</Text>

  <View
    style={{
      flexDirection: "row",
      marginBottom: 10,
      justifyContent: "space-around",
    }}
  >
    <TouchableOpacity
      onPress={() => setCustomerType("dealer")}
      style={{
        backgroundColor: customerType === "dealer" ? "green" : "blue",
        padding: 10,
        borderRadius: 5,
      }}
    >
      <Text style={{ color: "white" }}>Dealer</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => setCustomerType("retail")}
      style={{
        backgroundColor: customerType === "retail" ? "green" : "blue",
        padding: 10,
        borderRadius: 5,
      }}
    >
      <Text style={{ color: "white" }}>Retail</Text>
    </TouchableOpacity>
  </View>


        {/* Product List */}
        <Text>Product List:</Text>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedProduct(item);
                addToCart(item);
              }}
              style={{
                borderWidth: 1,
                padding: 10,
                marginVertical: 5,
              }}
            >
              <Text>{item.name}</Text>
              <Text>MOQ: {item.moq}</Text>
              <Text>
                Price:{" "}
                {customerType === "dealer"
                  ? item.dealerPrice
                  : item.retailPrice}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Selected Product */}

        {/* Quantity */}
        <TextInput
          placeholder="Enter quantity"
          value={quantity.toString()}
          onChangeText={(text) => setQuantity(Number(text))}
          keyboardType="numeric"
          style={{
            borderWidth: 1,
            marginVertical: 10,
            padding: 8,
          }}
        />
        {/* cart item */}

        <Text>Cart </Text>
        {cart.map((item) => (
          <View
            key={item.product.id}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderWidth: 1,
              padding: 10,
              marginVertical: 5,
            }}
          >
            <Text>
              {item.product.name} - Qty: {item.quantity}retailPrice
            </Text>
            <Button
              title="Remove"
              onPress={() => removeFromCart(item.product.id)}
            />
          </View>
        ))}

        {/* Order Button */}
        <Button title="Place Order" onPress={placeOrder} />

        {/* Error */}
        {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

        {/* Total */}
        {total ? <Text>Total Price: ₹{getTotal()}</Text> : null}

        <Button title="Reset Cart" onPress={resetCart} />
        <Button title="Open scanner" onPress={()=>router.push("/scanner")}></Button>
      </View>
    );
  };

