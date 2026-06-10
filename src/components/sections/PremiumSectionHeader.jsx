function PremiumSectionHeader({ eyebrow, title, description, align = "left" }) {
  const alignClass =
    align === "center" ? "text-center items-center" : "text-left";

  return (
    <div className={`flex flex-col gap-3 ${alignClass}`}>
      {eyebrow ? (
        <p className="text-xs font-semibold tracking-[0.3em] text-orange-600">
          {eyebrow}
        </p>
      ) : null}
      <div className={align === "center" ? "text-center" : "text-left"}>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default PremiumSectionHeader;
