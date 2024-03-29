import React, { useEffect, useState } from "react";
import supabase from "../Supabase";

const Package = ({ uniqueId, product }) => {
  const [data, setData] = useState([]);
  const [cartItems, setCartItems] = useState();
  const { productName, imageUrl, price, productDes } = product;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from("products").select("*");

        if (error) {
          throw error;
        }

        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const { data: cartItems, error } = await supabase
          .from("cart")
          .select("*");

        if (error) {
          throw error;
        }

        setCartItems(cartItems || []);
      } catch (error) {
        console.error("Error fetching cart items:", error.message);
      }
    };

    fetchCartItems();

    return () => {};
  }, [cartItems]);

  const addToCart = async (product) => {
    console.log("product", product);
    try {
      const existingCartItem = cartItems.find(
        (item) =>
          item.productId === product.id && item.userId === uniqueId.uniqueId
      );
      console.log("existing cart item", existingCartItem);

      if (existingCartItem) {
        const updatedQuantity = existingCartItem.quantity + 1;
        const { data, error } = await supabase
          .from("cart")
          .update({ quantity: updatedQuantity })
          .eq("id", existingCartItem.id);
        console.log("DATA", data);
        if (error) {
          throw error;
        }

        const updatedCartItems = cartItems.map((item) =>
          item.id === existingCartItem.id
            ? { ...item, quantity: updatedQuantity }
            : item
        );
        setCartItems(updatedCartItems);
      } else {
        const { data, error } = await supabase.from("cart").insert([
          {
            productId: product.id,
            name: product.productName,
            price: product.price,
            quantity: +1,
            userId: uniqueId.uniqueId,
          },
        ]);

        if (error) {
          throw error;
        }

        setCartItems([...cartItems, data[0]]);
      }
    } catch (error) {
      console.error("Error adding product to cart:", error.message);
    }
  };

  const hairAndMakeup = data.slice(6, 7);
  const images = data.slice(7);
  return (
    <div>
      <img src={imageUrl} alt='' style={{ height: "450px", width: "300px" }} />
      <h4>{productName}</h4>
      <p>${price}</p>
      <ul>
        {productDes?.map((des) => (
          <li key={des}>{des}</li>
        ))}
      </ul>
      {price === "400" ? (
        <div>
          <button
            onClick={() => {
              addToCart(hairAndMakeup[0]);
            }}
          >
            ADD Hair and Make up Artist
          </button>
          <p>Available upon request at least 48 Hours prior to your shoot.</p>
        </div>
      ) : (
        ""
      )}
      {/* Adding quantity button later */}
      <button
        onClick={() => {
          addToCart(images[0]);
        }}
      >
        Add additional images
      </button>
      <p>$25 per image</p>
      <button
        onClick={() => {
          addToCart(product);
        }}
      >
        Purchase
      </button>
    </div>
  );
};

export default Package;
