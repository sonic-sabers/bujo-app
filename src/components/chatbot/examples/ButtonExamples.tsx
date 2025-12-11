"use client";

import { PlusIcon, TrashIcon, DownloadIcon, HeartIcon } from "lucide-react";
import {
  RippleButton,
  RippleButtonRipples,
} from "@/components/animate-ui/components/buttons/ripple";

export function ButtonExamples({
  hideHeader = false,
}: {
  hideHeader?: boolean;
}) {
  return (
    <div className="relative bg-gray-50 rounded-lg">
      {!hideHeader && (
        <div className="p-4 pb-2">
          <h4 className="font-semibold text-gray-900 mb-3">
            Button Variations
          </h4>
        </div>
      )}

      <div
        className={` pb-4 space-y-3 w-full ${
          hideHeader ? "max-h-[300px] pb-6 overflow-hidden px-6 " : ""
        }`}
      >
        <div>
          <p className="text-xs text-gray-600 mb-2">Default Button</p>
          <RippleButton variant="default" size="default">
            Click me
            <RippleButtonRipples />
          </RippleButton>
        </div>

        <div>
          <p className="text-xs text-gray-600 mb-2">Secondary Button</p>
          <RippleButton variant="secondary" size="default">
            Secondary
            <RippleButtonRipples />
          </RippleButton>
        </div>

        <div>
          <p className="text-xs text-gray-600 mb-2">Outline Button</p>
          <RippleButton variant="outline" size="default">
            Outline
            <RippleButtonRipples />
          </RippleButton>
        </div>

        <div>
          <p className="text-xs text-gray-600 mb-2">Destructive Button</p>
          <RippleButton variant="destructive" size="default">
            <TrashIcon className="w-4 h-4 mr-2" />
            Delete
            <RippleButtonRipples />
          </RippleButton>
        </div>

        <div>
          <p className="text-xs text-gray-600 mb-2">Icon Buttons</p>
          <div className="flex gap-2">
            <RippleButton variant="default" size="icon">
              <PlusIcon />
              <RippleButtonRipples />
            </RippleButton>
            <RippleButton variant="secondary" size="icon">
              <DownloadIcon />
              <RippleButtonRipples />
            </RippleButton>
            <RippleButton variant="outline" size="icon">
              <HeartIcon />
              <RippleButtonRipples />
            </RippleButton>
          </div>
        </div>
      </div>

      {/* Bottom fade effect */}
      {hideHeader && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none rounded-b-lg" />
      )}
    </div>
  );
}
