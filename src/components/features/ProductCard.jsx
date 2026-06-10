import { useMemo, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useCartStore from "../store/cartStore";

function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const navigate = useNavigate();
  const [showDescription, setShowDescription] = useState(false);

  const description = useMemo(() => product?.description ?? "", [product]);

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setShowDescription((v) => !v);
            navigate(`/products/${product.id}`);
          }}
          aria-label={`View details for ${product.name}`}
          className="block h-56 w-full text-left"
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-56 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        </button>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

        {showDescription && (
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="line-clamp-3 rounded-2xl bg-white/95 px-4 py-3 text-sm text-slate-700 shadow-sm">
              {description}
            </p>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>

        <p className="mt-1 text-sm text-slate-500">{product.category}</p>

        <div className="mt-3 flex items-center gap-2">
          <FaStar className="text-orange-400" />
          <span className="text-sm font-semibold text-slate-700">
            {product.rating}
          </span>
          <span className="text-sm text-slate-500">/ 5</span>
        </div>

        <p className="mt-4 text-lg font-bold text-slate-900">
          birr {product.price.toFixed(2)}
        </p>

        <button
          onClick={() => addToCart(product)}
          aria-label={`Add ${product.name} to cart`}
          className="mt-5 w-full rounded-2xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 focus-visible:outline-none"
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
