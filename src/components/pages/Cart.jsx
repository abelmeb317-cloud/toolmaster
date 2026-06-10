import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import useCartStore from "../store/cartStore";

function Cart() {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const increaseQty = useCartStore((state) => state.increaseQty);
  const decreaseQty = useCartStore((state) => state.decreaseQty);

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity ?? 1),
    0,
  );

  const handleRemove = (id) => {
    removeFromCart(id);
    toast.success("Removed from cart");
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-center">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-3 text-slate-600">Add products to start your order.</p>
        <Link
          to="/products"
          className="mt-6 inline-flex rounded-full bg-orange-500 px-6 py-3 text-white"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-slate-600">Manage your items before checkout.</p>
        </div>
        <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
          {cart.reduce((sum, item) => sum + (item.quantity ?? 1), 0)} items
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-sm text-slate-500">{item.category}</p>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="rounded-full border border-slate-300 px-3 py-1 transition hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span>{item.quantity ?? 1}</span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="rounded-full border border-slate-300 px-3 py-1 transition hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-lg font-bold text-slate-900">
                  birr {(item.price * (item.quantity ?? 1)).toFixed(2)}
                </p>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-sm font-semibold text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Order summary</h2>
          <div className="mt-5 space-y-3 text-slate-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>birr {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-900">
              <span>Total</span>
              <span>birr {total.toFixed(2)}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="mt-6 inline-flex w-full justify-center rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
