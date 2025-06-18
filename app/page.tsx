"use client";

import React from "react";
import { FoodCard } from "@/components/FoodCard";
import { Database } from "lucide-react";
import { useAppStore } from "@/store/appStore";

export default function Home() {
  const {
    results,
    savingItems,
    existingFdcIds,
    pageIds,
    saveToNotion,
    updateNotionPage,
    savedFoodItems,
  } = useAppStore();

  return (
    <main className="flex-1 px-4 py-6 overflow-y-auto">
      {results.length > 0 ? (
        <div className="h-full flex flex-col">
          <div className="flex-1">
            <div className="h-full overflow-y-auto space-y-6 pb-8 px-3">
              {results.map((result) => (
                <div key={result.queryId}>
                  <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-xl font-bold">
                      Results for "{result.queryText}"
                    </h2>
                    <div className="text-sm text-muted-foreground">
                      {result.foods.length} items found
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {result.foods.map((food) => {
                      const isAlreadyInNotion = existingFdcIds.has(food.fdcId);
                      const savedData = savedFoodItems[food.fdcId];

                      return (
                        <FoodCard
                          key={food.fdcId}
                          food={food}
                          initialData={savedData}
                          isSaving={savingItems[food.fdcId] || false}
                          onSaveToNotion={saveToNotion}
                          isAlreadyInNotion={isAlreadyInNotion}
                          notionPageId={pageIds[food.fdcId]}
                          updatePage={updateNotionPage}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-center">
          <Database className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Start Your Nutrition Search
          </h3>
          <p className="text-muted-foreground max-w-md">
            Use the navigation sidebar to search for food items and
            discover detailed nutrition information from the USDA
            database.
          </p>
        </div>
      )}
    </main>
  );
}
