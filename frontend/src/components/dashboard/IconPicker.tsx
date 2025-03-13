import { useState, useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

const categories = ["solid", "regular", "duotone", "light", "thin","brands"];

function IconPicker() {
  const [selectedCategory, setSelectedCategory] = useState("solid");
  const loader = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteQuery({
    queryKey: ["icons", selectedCategory],
    queryFn: async ({ pageParam = 1 }) => {
      console.log(`Fetching icons: category=${selectedCategory}, page=${pageParam}`);
      const res = await fetch(`http://localhost:5000/users/svgs?category=${selectedCategory}&page=${pageParam}`);
      if (!res.ok) {
        console.error("API Error:", res.status, res.statusText);
        throw new Error("Failed to fetch icons");
      }
      const data = await res.json();
      console.log("API response:", data);
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
  });

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (error) {
    console.error("Error fetching icons:", error);
    return <div className="text-red-500">Error loading icons. Please try again.</div>;
  }

  return (
    <div className="p-4">
      {/* Category Selector */}
      <div className="flex flex-wrap space-x-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 mb-2 rounded ${selectedCategory === cat ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && <div className="text-center py-4">Loading icons...</div>}

      {/* Icon Grid */}
      <div className="grid grid-cols-5 gap-4">
        {data?.pages.flat().map((src, index) => (
          <div key={index} className="p-2 border rounded hover:bg-gray-50 flex flex-col items-center">
            <img 
              src={`http://localhost:5000${src}`} 
              alt={`Icon ${index}`} 
              width={50} 
              height={50} 
              className="object-contain" 
            />
            <p className="text-xs text-center mt-1 truncate w-full">
              {src.split('/').pop()?.replace('.svg', '')}
            </p>
          </div>
        ))}
      </div>

      {/* Loading More */}
      {isFetchingNextPage && <div className="text-center py-4">Loading more icons...</div>}

      {/* Infinite Scroll Trigger */}
      <div ref={loader} className="h-10"></div>
    </div>
  );
}

export default IconPicker;
