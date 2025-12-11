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

        <main className="flex-1 p-6 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <div className="mb-10 md:mb-12">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 pb-1">
                Boju Components
              </h1>
              <p className="text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed">
                Explore the whole collection of responsive, accessible
                components built with React and HTML ready to be used on your
                website or app.
              </p>
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
    </div>
  );
}
