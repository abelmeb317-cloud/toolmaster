import { Link, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { useMemo } from "react";
import products from "../data/products";
import useCartStore from "../store/cartStore";
import { ArrowRight } from "lucide-react";

function ProductDetails() {
  const { id } = useParams();
  const addToCart = useCartStore((s) => s.addToCart);
  const product = useMemo(
    () => products.find((p) => p.id === Number(id)),
    [id],
  );

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-center">
        <h1 className="text-3xl font-bold">Product not found</h1>
        <p className="mt-3 text-slate-600">
          Please return to the product catalog.
        </p>
        <div className="flex justify-end">
          <Link
            to="/products"
            className="inline-flex items-center rounded-full bg-orange-500 px-6 py-3 text-white hover:bg-orange-600 hover:scale-105 transition-all duration-200"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl bg-white shadow-sm">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover rounded-3xl"
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <Link
              to="/products"
              className="ml-70  inline-flex items-center px-7 font-semibold text-orange-800 hover:text-amber-500 transition  border-transparent hover:border-amber-500"
            >
              View Products
              <ArrowRight size={30} />
            </Link>
            <p className="text-sm uppercase tracking-[0.35em] text-orange-500">
              {product.category}
            </p>
            <h1 className="mt-4 text-4xl font-bold text-slate-900">
              {product.name}
            </h1>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <FaStar className="text-orange-400" />
              <span>{product.rating.toFixed(1)} / 5.0</span>
            </div>
            <p className="mt-6 text-slate-600">{product.description}</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Price</span>
              <span className="text-3xl font-bold text-slate-900">
                birr {product.price.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => addToCart(product)}
              className="mt-8 w-full rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
