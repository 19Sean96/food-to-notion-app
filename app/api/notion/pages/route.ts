import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';
import { mapFoodCategory } from '@/lib/notion';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Helper function to recursively clone an object and round all numbers to 2 decimal places
function roundNumbersInObject(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(roundNumbersInObject);
  }

  const newObj: { [key: string]: any } = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (typeof value === 'number') {
        newObj[key] = parseFloat(value.toFixed(2));
      } else {
        newObj[key] = roundNumbersInObject(value);
      }
    }
  }
  return newObj;
}

type NotionColor = "default" | "gray" | "brown" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "red";

const createTableRow = (label: string, value: number, unit: string, displayValue?: number) => {
    const display = displayValue !== undefined ? displayValue : value;
    const color: NotionColor = display ? 'blue' : 'red';
    return {
        object: 'block' as const,
        type: 'table_row' as const,
        table_row: {
            cells: [
                [{ type: 'text' as const, text: { content: label } }],
                [{
                    type: 'text' as const,
                    text: { content: display ? `${display} ${unit}` : 'N/A' },
                    annotations: { color: color }
                }]
            ]
        }
    };
};


export async function POST(request: Request) {
  try {
    const { food, databaseId, servingSizeDisplay } = await request.json();

    if (!food || !databaseId) {
        return NextResponse.json({
            success: false,
            message: 'Missing required parameters: food or databaseId',
            foodName: food?.description || 'Unknown food'
        }, { status: 400 });
    }

    const servingSize = servingSizeDisplay || (food.servingSize && food.servingSizeUnit
      ? `${food.servingSize} ${food.servingSizeUnit}`
      : 'Not specified');
    
    const originalNutrients = food.nutrients;
    const displayNutrients = roundNumbersInObject(originalNutrients);

    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        "Food Name": { title: [{ text: { content: food.description } }] },
        "Food Group": { select: mapFoodCategory(food.foodCategory) },
        "Serving Size": { rich_text: [{ text: { content: servingSize } }] },
        "Serving Size Metric": { rich_text: [{ text: { content: `${food.servingSizeMetric ?? ''} ${food.servingSizeMetricUnit ?? ''}` } }] },
        "Serving Size Imperial": { rich_text: [{ text: { content: `${food.servingSizeImperial ?? ''} ${food.servingSizeImperialUnit ?? ''}` } }] },
        "Data Type": { select: { name: food.dataType || 'Foundational' } },
        "Brand Name": { rich_text: food.brandName ? [{ text: { content: food.brandName } }] : [] },
        "FDC ID": { number: food.id || 0 },
        "Calories (kcal)": { number: originalNutrients.calories || 0 },
        "Protein (g)": { number: originalNutrients.protein || 0 },
        "Total Carbs (g)": { number: originalNutrients.carbs?.total || 0 },
        "Fiber (g)": { number: originalNutrients.carbs?.fiber || 0 },
        "Sugar (g)": { number: originalNutrients.carbs?.sugar || 0 },
        "Total Fat (g)": { number: originalNutrients.fats?.total || 0 },
        "Saturated Fat (g)": { number: originalNutrients.fats?.saturated || 0 },
        "Trans Fat (g)": { number: originalNutrients.fats?.trans || 0 },
        "MUFA (g)": { number: originalNutrients.fats?.mufa || 0 },
        "PUFA (g)": { number: originalNutrients.fats?.pufa || 0 },
        "Cholesterol (mg)": { number: originalNutrients.cholesterol || 0 },
        "Sodium (mg)": { number: originalNutrients.micronutrients?.sodium || 0 },
        "Potassium (mg)": { number: originalNutrients.micronutrients?.potassium || 0 },
        "Calcium (mg)": { number: originalNutrients.micronutrients?.calcium || 0 },
        "Iron (mg)": { number: originalNutrients.micronutrients?.iron || 0 }
      },
      children: [
        {
          object: "block",
          type: "heading_2",
          heading_2: { rich_text: [{ text: { content: "Foundational Data" } }] },
        },
        {
          object: "block",
          type: "table",
          table: {
            table_width: 2,
            has_column_header: false,
            has_row_header: false,
            children: [
                createTableRow('Calories', originalNutrients.calories, 'kcal', displayNutrients.calories),
                createTableRow('Water', originalNutrients.water, 'g', displayNutrients.water),
                createTableRow('Total Carbs', originalNutrients.carbs.total, 'g', displayNutrients.carbs.total),
                createTableRow('Dietary Fiber', originalNutrients.carbs.fiber, 'g', displayNutrients.carbs.fiber),
                createTableRow('Total Sugars', originalNutrients.carbs.sugar, 'g', displayNutrients.carbs.sugar),
                createTableRow('Added Sugars', originalNutrients.carbs.addedSugar, 'g', displayNutrients.carbs.addedSugar),
                createTableRow('Total Fat', originalNutrients.fats.total, 'g', displayNutrients.fats.total),
                createTableRow('Saturated Fat', originalNutrients.fats.saturated, 'g', displayNutrients.fats.saturated),
                createTableRow('Trans Fat', originalNutrients.fats.trans, 'g', displayNutrients.fats.trans),
                createTableRow('Cholesterol', originalNutrients.cholesterol, 'mg', displayNutrients.cholesterol),
            ]
          }
        },
        {
            object: "block",
            type: "heading_2",
            heading_2: { rich_text: [{ text: { content: "Core Micronutrients" } }] },
        },
        {
            object: "block",
            type: "table",
            table: {
              table_width: 2,
              has_column_header: false,
              has_row_header: false,
              children: [
                createTableRow('Vitamin A / Retinol', originalNutrients.vitamins.a, 'µg', displayNutrients.vitamins.a),
                createTableRow('Vitamin D / Calciferol', originalNutrients.vitamins.d, 'µg', displayNutrients.vitamins.d),
                createTableRow('Vitamin E / Tocopherol', originalNutrients.vitamins.e, 'mg', displayNutrients.vitamins.e),
                createTableRow('Vitamin K / Phylloquinone', originalNutrients.vitamins.k, 'µg', displayNutrients.vitamins.k),
                createTableRow('Vitamin B6 / Pyridoxine', originalNutrients.vitamins.b6, 'mg', displayNutrients.vitamins.b6),
                createTableRow('Vitamin B12 / Cobalamin', originalNutrients.vitamins.b12, 'µg', displayNutrients.vitamins.b12),
                createTableRow('Vitamin B9 / Folate (DFE)', originalNutrients.vitamins.folate, 'µg', displayNutrients.vitamins.folate),
                createTableRow('Calcium', originalNutrients.micronutrients.calcium, 'mg', displayNutrients.micronutrients.calcium),
                createTableRow('Iron', originalNutrients.micronutrients.iron, 'mg', displayNutrients.micronutrients.iron),
                createTableRow('Magnesium', originalNutrients.micronutrients.magnesium, 'mg', displayNutrients.micronutrients.magnesium),
                createTableRow('Zinc', originalNutrients.micronutrients.zinc, 'mg', displayNutrients.micronutrients.zinc),
                createTableRow('Iodine', originalNutrients.micronutrients.iodine, 'µg', displayNutrients.micronutrients.iodine),
                createTableRow('Sodium', originalNutrients.micronutrients.sodium, 'mg', displayNutrients.micronutrients.sodium),
                createTableRow('Potassium', originalNutrients.micronutrients.potassium, 'mg', displayNutrients.micronutrients.potassium),
              ]
            }
        },
        {
            object: "block",
            type: "heading_2",
            heading_2: { rich_text: [{ text: { content: "Functional Clinical Data" } }] },
        },
        {
            object: "block",
            type: "table",
            table: {
                table_width: 2,
                has_column_header: false,
                has_row_header: false,
                children: [
                    createTableRow('MUFA', originalNutrients.fats.mufa, 'g', displayNutrients.fats.mufa),
                    createTableRow('PUFA', originalNutrients.fats.pufa, 'g', displayNutrients.fats.pufa),
                    createTableRow('Omega-3 ALA', originalNutrients.fats.omega3.ala, 'g', displayNutrients.fats.omega3.ala),
                    createTableRow('Omega-3 EPA', originalNutrients.fats.omega3.epa, 'g', displayNutrients.fats.omega3.epa),
                    createTableRow('Omega-3 DHA', originalNutrients.fats.omega3.dha, 'g', displayNutrients.fats.omega3.dha),
                    createTableRow('Leucine', originalNutrients.aminoAcids.leucine, 'g', displayNutrients.aminoAcids.leucine),
                    createTableRow('Lysine', originalNutrients.aminoAcids.lysine, 'g', displayNutrients.aminoAcids.lysine),
                    createTableRow('Methionine', originalNutrients.aminoAcids.methionine, 'g', displayNutrients.aminoAcids.methionine),
                    createTableRow('Cystine', originalNutrients.aminoAcids.cystine, 'g', displayNutrients.aminoAcids.cystine),
                    createTableRow('Choline', originalNutrients.choline, 'mg', displayNutrients.choline),
                ]
            }
        }
      ]
    });

    return NextResponse.json({
        success: true,
        message: 'Successfully added to Notion',
        foodName: food.description,
        pageId: response.id
      });
  } catch (error: any) {
    console.error('Error creating Notion page:', error);
    return NextResponse.json({
        success: false,
        message: error.message || 'Failed to create Notion page',
        foodName: 'Unknown food'
    }, { status: error.status || 500 });
  }
} 