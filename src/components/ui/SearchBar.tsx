"use client";

import { useState } from "react";

export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({
  placeholder = "Search components...",
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <div
      className={`relative transition-all duration-300 ${
        isFocused ? "scale-105" : ""
      }`}
    >
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg
          className={`w-5 h-5 transition-colors duration-200 ${
            isFocused ? "text-blue-500" : "text-gray-400"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`
          w-full pl-12 pr-4 py-3 
          bg-white border-2 rounded-xl
          text-gray-900 placeholder-gray-400
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500/20
          ${
            isFocused
              ? "border-blue-400 shadow-lg shadow-blue-500/10"
              : "border-gray-200 hover:border-gray-300 shadow-sm"
          }
        `}
      />
      {query && (
        <button
          onClick={() => {
            setQuery("");
            onSearch?.("");
          }}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
