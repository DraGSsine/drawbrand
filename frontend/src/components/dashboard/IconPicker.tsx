import { useState, useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
  const [debouncedSearch, setDebouncedSearch] = useState(""); 
  const loader = useRef<HTMLDivElement | null>(null);

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteQuery({
    queryKey: ["icons", selectedCategory, debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      console.log(`Fetching icons: category=${selectedCategory}, page=${pageParam}, search=${debouncedSearch}`);
      const queryParams = new URLSearchParams({
        category: selectedCategory,
        page: pageParam.toString()
      });
      
      if (debouncedSearch) {
        queryParams.append("search", debouncedSearch);
      }
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/svgs?${queryParams.toString()}`);
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

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };


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
    <div className="absolute top-[30vh] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[280px] xl:w-[420px] bg-white rounded-xl shadow-dropdown p-4 animate-scale-in border border-gray-100">
      {/* Search Box */}
      <div className="relative mb-3 sm:mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg 
            width="14" 
            height="14"
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-400"
          >
            <path 
              d="M21 21L15.0001 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search icons..."
          className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-icon-active/20 focus:border-icon-active transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Pills */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-2 mb-3 sm:mb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={cn(
              "px-1 sm:px-2 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium rounded-full text-center transition-all",
              selectedCategory === cat.id
                ? " bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="p-3 sm:p-4 rounded-lg bg-red-50 text-red-500 text-xs sm:text-sm mb-2 animate-fade-in">
          <p className="font-medium">Failed to load icons</p>
          <p className="text-[10px] sm:text-xs mt-1 mb-2 text-red-400">Please check your connection and try again</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-1 bg-white border-red-200 hover:bg-red-50 text-red-500 text-[10px] sm:text-xs"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Icon Grid Container */}
      <ScrollArea className="h-[250px] sm:h-[300px] pr-2">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-32 sm:h-48 animate-fade-in">
            <div className="w-6 sm:w-8 h-6 sm:h-8 mb-2 sm:mb-3 relative">
              <svg 
                className="animate-spinner text-icon-active w-full h-full"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">Loading icons</p>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">Please wait a moment</p>
          </div>
        )}

        {/* No Results */}
        {!isLoading && allIcons.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 sm:h-48 text-gray-500 animate-fade-in">
            <svg 
              width="30" 
              height="30" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-300 mb-2 sm:mb-3"
            >
              <path 
                d="M9.172 14.828C10.3291 16.2466 11.8358 17.3579 13.0984 17.3638C14.361 17.3697 16.3299 16.2735 17.4966 14.8493M12.01 15.5H12" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M21.9551 11.743C20.8435 15.2711 16.9276 19 12.0076 19C7.08747 19 3.1686 15.2711 2.05701 11.743C1.02365 8.32047 7.04888 1.78658 11.132 5.74551C11.4093 6.0156 11.696 6.36977 12.0076 6.79798C12.3192 6.36977 12.6059 6.0156 12.8832 5.74551C16.9663 1.78658 22.9915 8.32047 21.9551 11.743Z" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-xs sm:text-sm font-medium">No icons found</p>
            {searchQuery && (
              <p className="text-[10px] sm:text-xs mt-1 text-gray-400">Try a different search term or category</p>
            )}
          </div>
        )}

        {/* Icon Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1 sm:gap-2">
            {allIcons.map((src: string, index: number) => (
              <div 
                key={index} 
                className="aspect-square rounded-lg hover:bg-icon-hover border border-transparent hover:border-gray-200 transition-all cursor-pointer flex flex-col items-center justify-center p-1 sm:p-2 group"
                onClick={() => handleIconClick(src)}
              >
                <div className="h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Image 
                    src={`${process.env.NEXT_PUBLIC_API_URL}${src}`}
                    width={24}
                    height={24}
                    alt={`Icon ${index}`} 
                    className="w-4 h-4 sm:w-6 sm:h-6 object-contain" 
                  />
                </div>
              </div>
            ))}
        </div>

        {/* Loading More Indicator */}
        {isFetchingNextPage && (
          <div className="flex justify-center py-3 sm:py-4">
            <svg 
              className="animate-spinner text-icon-active w-4 h-4 sm:w-5 sm:h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}

        {/* Infinite Scroll Trigger */}
        <div ref={loader} className="h-4"></div>
      </ScrollArea>
      
      {/* Footer with stats */}
      {!isLoading && allIcons.length > 0 && (
        <div className="mt-2 sm:mt-3 pt-2 border-t border-gray-100 flex justify-between items-center text-[10px] sm:text-xs text-gray-400">
          <span>{allIcons.length} icons</span>
          <span className="text-icon-active">{selectedCategory}</span>
        </div>
      )}
    </div>
  );
};

export default IconPicker;
