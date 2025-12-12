"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { ComponentCard } from "@/components/showcase/ComponentCard";
import { ComponentGrid } from "@/components/showcase/ComponentGrid";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { sidebarItems } from "@/data/sidebar";
import { componentsData } from "@/data/components";
import { ComponentCategory } from "@/types/ui-library";
import {
  ButtonPreview,
  CardPreview,
  ChatBubblePreview,
  InputGroupPreview,
} from "@/components/previews";
import { ButtonExamples } from "@/components/chatbot/examples/ButtonExamples";
import { CardExamples } from "@/components/chatbot/examples/CardExamples";
import { InputExamples } from "@/components/chatbot/examples/InputExamples";
import { ChatBubbleExamples } from "@/components/chatbot/examples/ChatBubbleExamples";
import { UiLibraryAssistant } from "@/components/chatbot/UiLibraryAssistant";

const previewComponents: Record<string, React.ReactNode> = {
  buttons: <ButtonExamples hideHeader />,
  cards: <CardExamples hideHeader />,
  "input-groups": <InputExamples hideHeader />,
  "chat-bubbles": <ChatBubbleExamples hideHeader />,
};

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<
    ComponentCategory | undefined
  >();
  const [toast, setToast] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast(`Copied: "${text}"`);
      setTimeout(() => setToast(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  useEffect(() => {
    const cards = document.querySelectorAll(".animate-fade-in");
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("opacity-100");
      }, index * 50);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />

      <div className="flex">
        <Sidebar
          items={sidebarItems}
          activeCategory={activeCategory}
          onCategoryClick={setActiveCategory}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <div className="mb-8 md:mb-10 lg:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 md:mb-4 pb-1">
                Bujo UI Components
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed">
                Explore the whole collection of responsive, accessible
                components built with React and HTML ready to be used on your
                website or app.
              </p>

              <div className="mt-6 flex items-start gap-3 max-w-xl">
                <div className="w-8 h-8 rounded-full bg-[#00b4d8] flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-700 mb-2">
                    Try asking me about:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Show me button variants",
                      "I need a ghost button",
                      "Create a CTA button",
                      "Show card examples",
                      "I want a gradient card",
                      "Show input fields",
                      "I need an email input",
                      "Show chat bubbles",
                      "Build a login form",
                      "Create a contact form",
                    ].map((prompt) => (
                      <span
                        key={prompt}
                        onClick={() => copyToClipboard(prompt)}
                        className="px-2.5 py-1 bg-gray-100 text-xs font-medium text-gray-600 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer select-none"
                      >
                        {prompt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <ComponentGrid>
              {componentsData.map((component) => (
                <ComponentCard
                  key={component.id}
                  title={component.name}
                  description={component.description}
                  variationCount={component.variationCount}
                  preview={
                    previewComponents[component.category] || <div>Preview</div>
                  }
                  onClick={() => setActiveCategory(component.category)}
                  isActive={activeCategory === component.category}
                />
              ))}
            </ComponentGrid>
          </div>
        </main>
      </div>

      <MobileMenu
        items={sidebarItems}
        activeCategory={activeCategory}
        onCategoryClick={setActiveCategory}
      />
      <ScrollToTop />
      <UiLibraryAssistant />

      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
