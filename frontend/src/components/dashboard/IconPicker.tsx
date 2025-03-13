import { useState, useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


// Props interface for the main IconPicker component
interface FullIconPickerProps {
  onSelectIcon?: (iconPath: string) => void;
}

// Categories with nice display names
const categories = [
  { id: "solid", name: "Solid" },
  { id: "regular", name: "Regular" },
  { id: "duotone", name: "Duotone" },
  { id: "light", name: "Light" },
  { id: "thin", name: "Thin" },
  { id: "brands", name: "Brands" }
];

// The full icon picker component - now with proper props type
const IconPicker = ({ onSelectIcon }: FullIconPickerProps) => {
  const [selectedCategory, setSelectedCategory] = useState("solid");
  const [searchQuery, setSearchQuery] = useState("");
  const loader = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteQuery({
    queryKey: ["icons", selectedCategory, searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      console.log(`Fetching icons: category=${selectedCategory}, page=${pageParam}, search=${searchQuery}`);
      const queryParams = new URLSearchParams({
        category: selectedCategory,
        page: pageParam.toString()
      });
      
      if (searchQuery) {
        queryParams.append("search", searchQuery);
      }
      
      const res = await fetch(`http://localhost:5000/users/svgs?${queryParams.toString()}`);
      if (!res.ok) {
        console.error("API Error:", res.status, res.statusText);
        throw new Error("Failed to fetch icons");
      }
      const data = await res.json();
      console.log("API response data count:", data.length);
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

  // Get all icons across all pages
  const allIcons = data?.pages.flat() || [];

  const handleIconClick = (iconPath: string) => {
    if (onSelectIcon) {
      onSelectIcon(iconPath);
    }
  };

  return (
    <div className="w-[300px] absolute z-10 animate-shape-slide bg-white rounded-xl shadow-dropdown p-3">
      {/* Search Box */}
      <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search icons..."
          className="w-full pl-10 pr-4 py-2 bg-tool border border-tool-border rounded-lg focus:outline-none focus:ring-1 focus:ring-tool-active text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Pills */}
      <div className="flex overflow-x-auto pb-2 mb-3 no-scrollbar">
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all",
                selectedCategory === cat.id
                  ? "bg-tool-active text-white shadow-sm"
                  : "bg-tool hover:bg-tool-hover text-tool-text"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-500 text-sm">
          <p>Failed to load icons. Please try again.</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Icon Grid Container */}
      <ScrollArea className="h-[280px]">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-40">
            <Loader2 className="animate-spin text-tool-active mb-2" size={24} />
            <p className="text-sm text-gray-500">Loading icons...</p>
          </div>
        )}

        {/* No Results */}
        {!isLoading && allIcons.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <p className="text-sm">No icons found</p>
            {searchQuery && (
              <p className="text-xs mt-1">Try a different search term</p>
            )}
          </div>
        )}

        {/* Icon Grid - with click handler */}
        <div className="grid grid-cols-4 gap-2">
          {allIcons.map((src, index) => (
            <div 
              key={index} 
              className="p-2 rounded-lg hover:bg-tool transition-colors group cursor-pointer flex flex-col items-center"
              onClick={() => handleIconClick(src)}
            >
              <div className="w-10 h-10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <img 
                  src={`http://localhost:5000${src}`} 
                  alt={`Icon ${index}`} 
                  className="w-6 h-6 object-contain" 
                />
              </div>
              <p className="text-[10px] text-center text-gray-500 truncate w-full">
                {src.split('/').pop()?.replace('.svg', '')}
              </p>
            </div>
          ))}
        </div>

        {/* Loading More Indicator */}
        {isFetchingNextPage && (
          <div className="flex justify-center py-3">
            <Loader2 className="animate-spin text-tool-active" size={18} />
          </div>
        )}

        {/* Infinite Scroll Trigger */}
        <div ref={loader} className="h-4"></div>
      </ScrollArea>
    </div>
  );
};

export default IconPicker;
