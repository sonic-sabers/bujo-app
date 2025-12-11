"use client";

import { motion } from "framer-motion";

interface CardExamplesProps {
  hideHeader?: boolean;
}

export function CardExamples({ hideHeader = false }: CardExamplesProps) {
  return (
    <div className="relative bg-gray-50 rounded-lg">
      {!hideHeader && (
        <div className="pb-2">
          <h4 className="font-semibold text-gray-900 mb-3">Card Variations</h4>
        </div>
      )}

      <div
        className={` pb-4 space-y-3 w-full ${
          hideHeader ? "max-h-[300px] pb-6 overflow-hidden px-6 " : ""
        }`}
      >
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white p-3 rounded-lg shadow-md border border-gray-200"
          >
            <div className="w-full h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-md mb-2"></div>
            <h5 className="font-semibold text-xs mb-1 text-gray-900">
              Default
            </h5>
            <p className="text-[10px] text-gray-600 leading-tight">
              Basic card with shadow
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white p-3 rounded-lg shadow-xl"
          >
            <div className="w-full h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-md mb-2"></div>
            <h5 className="font-semibold text-xs mb-1 text-gray-900">
              Elevated
            </h5>
            <p className="text-[10px] text-gray-600 leading-tight">
              Card with large shadow
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white p-3 rounded-lg border-2 border-gray-300"
          >
            <div className="w-full h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-md mb-2"></div>
            <h5 className="font-semibold text-xs mb-1 text-gray-900">
              Outlined
            </h5>
            <p className="text-[10px] text-gray-600 leading-tight">
              Card with border
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-lg text-white"
          >
            <div className="w-full h-16 bg-white/20 rounded-md mb-2"></div>
            <h5 className="font-semibold text-xs mb-1 text-white">Gradient</h5>
            <p className="text-[10px] text-white/90 leading-tight">
              Card with gradient bg
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade effect */}
      {hideHeader && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none rounded-b-lg" />
      )}
    </div>
  );
}
