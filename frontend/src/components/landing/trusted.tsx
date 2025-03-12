import React from "react";

const Trusted = ({ className }: { className: string }) => {
  return (
    <div className="flex items-center gap-4 text-zinc-600">
      <div className="flex -space-x-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full border-2 border-white ring-2 ring-white bg-cover bg-center"
            style={{
              backgroundImage: `url(https://randomuser.me/api/portraits/${
                i % 2 ? "women" : "men"
              }/${i}.jpg)`,
            }}
          />
        ))}
      </div>
      <p className={className}>Be among the first to experience scrive.</p>
    </div>
  );
};

export default Trusted;
