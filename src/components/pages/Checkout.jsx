import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useCartStore from "../store/cartStore";
import useProductStore from "../store/productStore";
import { authStore } from "../store/authStore";
import api from "../../api/axios";

function Checkout() {
  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      name: "",
      email: "",
      address: "",
      payment: "card",
    },
  });

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/products");
    }
  }, [cart.length, navigate]);

  const onSubmit = async (data) => {
    const auth = authStore.get();
    const orderData = {
      items: cart.map(it => ({ id: it.id, name: it.name, price: it.price, quantity: it.quantity ?? 1 })),
      total: cart.reduce((s, it) => s + it.price * (it.quantity ?? 1), 0),
      username: auth?.username || data.name,
      email: data.email,
      address: data.address,
      payment: data.payment
    };

    try {
      await api.post("/orders", orderData);
      toast.success(`Order placed successfully, ${data.name}!`);
      
      // Update local product stock
      const fetchProducts = useProductStore.getState().fetchProducts;
      if (typeof fetchProducts === "function") {
        await fetchProducts();
      }

      clearCart();
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold mb-3">Checkout</h1>
      <p className="mb-8 text-slate-600">
        Complete your purchase with a secure checkout.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Full Name
            <input
              {...register("name", { required: true })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400"
              placeholder="Jane Doe"
            />
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Email address
            <input
              {...register("email", { required: true })}
              type="email"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400"
              placeholder="jane@example.com"
            />
          </label>
        </div>

        <label className="space-y-2 text-sm font-semibold text-slate-700">
          Shipping address
          <input
            {...register("address", { required: true })}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400"
            placeholder="123 Main St, City, Country"
          />
        </label>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-700">Payment method</p>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <input
              {...register("payment")}
              type="radio"
              value="card"
              defaultChecked
            />
            Credit / debit card
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <input {...register("payment")} type="radio" value="paypal" />
            PayPal
          </label>
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-white transition hover:bg-orange-600"
        >
          Place order
        </button>
      </form>
    </div>
  );
}

export default Checkout;
