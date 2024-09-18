import React, { Component } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // pastikan untuk import CSS ini agar toast bekerja dengan baik

class Keranjang extends Component {
  constructor() {
    super();
    this.state = {
      cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
      customerName: "",
      orderType: "Dine In",
    };
  }

  handleDeleteCartItem = (itemId) => {
    // Gunakan prevState untuk memastikan Anda mendapatkan state terbaru
    this.setState(
      (prevState) => ({
        cartItems: prevState.cartItems.filter((item) => item.id !== itemId),
      }),
      () => {
        // Simpan state yang diperbarui ke dalam localStorage setelah dihapus
        localStorage.setItem("cartItems", JSON.stringify(this.state.cartItems));
        toast.error("Item removed from cart");
      }
    );
  };

  handleCustomerNameChange = (e) => {
    this.setState({ customerName: e.target.value });
  };

  handleOrderTypeChange = (e) => {
    this.setState({ orderType: e.target.value });
  };

  handleQuantityChange = (itemId, newQuantity) => {
    // Validasi quantity agar tidak kurang dari 1
    const validQuantity = Math.max(1, newQuantity);

    const updatedCartItems = this.state.cartItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: validQuantity };
      }
      return item;
    });

    this.setState({ cartItems: updatedCartItems }, () => {
      localStorage.setItem("cartItems", JSON.stringify(this.state.cartItems));
    });
  };

  handleProcessPayment = async () => {
    if (this.state.customerName.trim() === "") {
      toast.error("Please enter customer name");
      return;
    }

    try {
      const orderData = {
        customer_name: this.state.customerName,
        order_type: this.state.orderType,
        order_date: new Date().toISOString().split("T")[0],
        order_detail: this.state.cartItems.map((item) => ({
          coffee_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const response = await fetch("http://localhost:8000/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to process payment");
      }

      this.setState({
        cartItems: [],
        customerName: "",
        orderType: "Dine In",
      });
      localStorage.removeItem("cartItems");
      toast.success("Order processed successfully");
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Failed to process payment");
    }
  };

  render() {
    const total = this.state.cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const tax = 5000;
    const grandTotal = total + tax;

    return (
      <div className="container mx-auto grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="px-8 items-center mt-10 pb-5 bg-white shadow-lg rounded-lg">
            <h1 className="text-lg text-center mt-4 mb-8 font-semibold">
              Detail Pemesanan
            </h1>
            <table className="table-fixed w-full">
              <thead className="text-center font-medium">
                <tr>
                  <th className="w-1/6">Gambar</th>
                  <th className="w-2/6">Nama</th>
                  <th className="w-1/6">Harga</th>
                  <th className="w-1/6">Jumlah</th>
                  <th className="w-1/6">Total</th>
                  <th className="w-1/6"></th>
                </tr>
              </thead>
              <tbody className="text-center">
                {this.state.cartItems.map((item, index) => (
                  <tr key={item.id}>
                    <td className="flex justify-center items-center">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-24 h-24 object-cover object-center p-3"
                      />
                    </td>
                    <td className="text-left">
                      <p className="text-md font-medium">{item.name}</p>
                      <p className="text-sm">{item.spicy_level}</p>
                    </td>
                    <td className="text-sm">Rp. {item.price.toFixed(2)}</td>
                    <td className="text-sm">
                      <button
                        className="px-2 py-1 bg-blue-500 rounded-l text-white"
                        onClick={() => {
                          const newQuantity = Math.max(1, item.quantity - 1);
                          this.handleQuantityChange(item.id, newQuantity);
                        }}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={item.quantity}
                        readOnly
                        className="border-none rounded px-2 py-1 text-center w-8 text-sm bg-white"
                      />
                      <button
                        className="px-2 py-1 bg-blue-500 rounded-r text-white"
                        onClick={() => {
                          const newQuantity = item.quantity + 1;
                          this.handleQuantityChange(item.id, newQuantity);
                        }}
                      >
                        +
                      </button>
                    </td>
                    <td className="text-sm">
                      Rp. {(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="flex justify-center items-center">
                      <button
                        className="block px-3 py-1 bg-red-500 text-white rounded"
                        onClick={() => {
                          this.handleDeleteCartItem(item.id);
                        }}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-center mt-8">
              <hr className="border-gray-400 mb-2" />
              <p className="text-lg font-medium">
                Total : Rp {total.toFixed(2)}
              </p>
            </div>

            <hr className="border-gray-400 mt-2" />
          </div>
        </div>
        <div className="col-span-1">
          <div className="px-8 items-center mt-10 pb-5 bg-white shadow-lg rounded-lg">
            <h1 className="text-lg text-center mt-4 mb-8 font-semibold">
              Informasi Pelanggan
            </h1>
            <input
              type="text"
              placeholder="Nama Pelanggan"
              value={this.state.customerName}
              onChange={this.handleCustomerNameChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded mb-4"
            />
            <select
              value={this.state.orderType}
              onChange={this.handleOrderTypeChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded mb-4"
            >
              <option value="Dine In">Dine In</option>
              <option value="Take Away">Take Away</option>
            </select>
            <hr className="border-gray-400 mb-2 mt-10" />
            <h1 className="text-md text-start mt-4 mb-8 font-semibold">
              Ringkasan Pemesanan
            </h1>
            <div className="flex justify-between">
              <p>Pajak</p>
              <p>Rp {tax.toFixed(2)}</p>
            </div>
            <hr className="border-gray-400 mb-2 mt-2" />
            <div className="flex justify-between">
              <p className="font-semibold">Grand Total</p>
              <p className="font-semibold">Rp {grandTotal.toFixed(2)}</p>
            </div>
            <button
              className="block px-3 py-1 bg-blue-500 text-white rounded mt-10"
              onClick={this.handleProcessPayment}
            >
              Proses Pembayaran
            </button>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }
}

export default Keranjang;