import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useCartStore from "../store/cartStore";

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

  const onSubmit = (data) => {
    toast.success(`Order placed successfully, ${data.name}!`);
    clearCart();
    navigate("/", { replace: true });
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
