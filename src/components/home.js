import React, { Component } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      searchName: "",
      cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
      selectedQuantities: {}, // tambahkan state untuk menyimpan quantity yang dipilih per item
    };
  }

  bind = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleQuantityChange = (itemId, newQuantity) => {
    const quantity = Math.max(1, newQuantity); // Menghindari quantity kurang dari 1
    this.setState((prevState) => ({
      selectedQuantities: {
        ...prevState.selectedQuantities,
        [itemId]: quantity,
      },
    }));
  };

  handleAddToCartWithQuantity = (item) => {
    const { cartItems, selectedQuantities } = this.state;
    const quantityToAdd = selectedQuantities[item.id] || 1;

    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItemIndex !== -1) {
      // Jika item sudah ada di cart, update jumlahnya
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += quantityToAdd;
      this.setState({ cartItems: updatedCartItems }, () => {
        localStorage.setItem("cartItems", JSON.stringify(this.state.cartItems));
        toast.success(
          `${quantityToAdd} ${item.name} telah ditambahkan ke keranjang`
        );
      });
    } else {
      // Jika item belum ada di cart, tambahkan item baru
      const updatedItem = { ...item, quantity: quantityToAdd };
      this.setState(
        { cartItems: [...cartItems, updatedItem] },
        () => {
          localStorage.setItem(
            "cartItems",
            JSON.stringify(this.state.cartItems)
          );
          toast.success(
            `${quantityToAdd} ${item.name} ditambahkan ke keranjang`
          );
        }
      );
    }
  };

  getItems = () => {
    let url = "http://localhost:8000/food";
    if (this.state.searchName !== "") {
      url = `http://localhost:8000/food/${this.state.searchName}`;
    }

    axios
      .get(url)
      .then((response) => {
        this.setState({
          items: response.data.data,
          selectedQuantities: Object.fromEntries(
            response.data.data.map((item) => [item.id, 1])
          ),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount() {
    this.getItems();
  }

  render() {
    return (
      <div className="container mx-auto">
        <h1 className="text-3xl text-center my-8 font-semibold">
          Welcome to Food Shop
        </h1>
        <div className="flex justify-center my-8">
          <input
            type="text"
            placeholder="Cari berdasarkan menu"
            className="border border-gray-300 rounded-lg px-4 py-2 w-80"
            value={this.state.searchName}
            onChange={(e) => this.setState({ searchName: e.target.value })}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                this.getItems();
              }
            }}
          />
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-3 px-32 items-center"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          }}
        >
          {this.state.items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden mx-auto"
              style={{ width: "300px" }}
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-40 object-cover object-center"
              />
              <div className="p-6">
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-sm">{item.spicy_level}</p>
                <p className="text-sm">Rp. {item.price.toFixed(2)}</p>
                <div className="flex items-center pt-1">
                  <input
                    type="number"
                    min="1"
                    value={this.state.selectedQuantities[item.id] || 1}
                    onChange={(e) =>
                      this.handleQuantityChange(item.id, parseInt(e.target.value))
                    }
                    className="border border-gray-300 rounded px-2 py-1 text-center w-12 text-sm bg-white"
                  />
                </div>
                <button
                  className="block px-3 py-1 bg-green-500 text-white rounded mt-2"
                  onClick={() => this.handleAddToCartWithQuantity(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        <ToastContainer />
      </div>
    );
  }
}

export default Home;