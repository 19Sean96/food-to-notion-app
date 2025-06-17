import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';
import { mapFoodCategory, createTableRow } from '@/lib/notion';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

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

    const nutrients = food.nutrients;

    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        "Food Name": {
          title: [{ text: { content: food.description } }]
        },
        "Food Group": {
          select: mapFoodCategory(food.foodCategory)
        },
        "Serving Size": {
          rich_text: [{ text: { content: servingSize } }]
        },
        "Serving Size Metric": {
          rich_text: [{ text: { content: `${food.servingSizeMetric ?? ''} ${food.servingSizeMetricUnit ?? ''}` } }]
        },
        "Serving Size Imperial": {
          rich_text: [{ text: { content: `${food.servingSizeImperial ?? ''} ${food.servingSizeImperialUnit ?? ''}` } }]
        },
        "Data Type": {
          select: { name: food.dataType || 'Foundational' }
        },
        "Brand Name": {
          rich_text: food.brandName ? [{ text: { content: food.brandName } }] : []
        },
        "FDC ID": {
          number: food.id || 0
        },
        "Calories (kcal)": {
          number: nutrients.calories || 0
        },
        "Protein (g)": {
          number: nutrients.protein || 0
        },
        "Total Carbs (g)": {
          number: nutrients.carbs?.total || 0
        },
        "Fiber (g)": {
          number: nutrients.carbs?.fiber || 0
        },
        "Sugar (g)": {
          number: nutrients.carbs?.sugar || 0
        },
        "Total Fat (g)": {
          number: nutrients.fats?.total || 0
        },
        "Saturated Fat (g)": {
          number: nutrients.fats?.saturated || 0
        },
        "Trans Fat (g)": {
          number: nutrients.fats?.trans || 0
        },
        "MUFA (g)": {
          number: nutrients.fats?.mufa || 0
        },
        "PUFA (g)": {
          number: nutrients.fats?.pufa || 0
        },
        "Cholesterol (mg)": {
          number: nutrients.cholesterol || 0
        },
        "Sodium (mg)": {
          number: nutrients.micronutrients?.sodium || 0
        },
        "Potassium (mg)": {
          number: nutrients.micronutrients?.potassium || 0
        },
        "Calcium (mg)": {
          number: nutrients.micronutrients?.calcium || 0
        },
        "Iron (mg)": {
          number: nutrients.micronutrients?.iron || 0
        }
      },
      children: [
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [
              {
                text: {
                  content: "Foundational Data",
                },
              },
            ],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                text: {
                  content: "Basic nutritional components including calories, macronutrients, and essential dietary elements.",
                },
              },
            ],
          },
        },
        {
          object: "block",
          type: "table",
          table: {
            table_width: 2,
            has_column_header: false,
            has_row_header: false,
            children: [
              {
                object: "block",
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Calories" } }],
                    [{
                      text: { content: nutrients.calories ? `${nutrients.calories} kcal` : "N/A" },
                      annotations: { color: nutrients.calories ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block", 
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Water" } }],
                    [{
                      text: { content: nutrients.water ? `${nutrients.water} g` : "N/A" },
                      annotations: { color: nutrients.water ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row", 
                table_row: {
                  cells: [
                    [{ text: { content: "Total Carbs" } }],
                    [{
                      text: { content: nutrients.carbs?.total ? `${nutrients.carbs.total} g` : "N/A" },
                      annotations: { color: nutrients.carbs?.total ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Dietary Fiber" } }],
                    [{
                      text: { content: nutrients.carbs?.fiber ? `${nutrients.carbs.fiber} g` : "N/A" },
                      annotations: { color: nutrients.carbs?.fiber ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Total Sugars" } }],
                    [{
                      text: { content: nutrients.carbs?.sugar ? `${nutrients.carbs.sugar} g` : "N/A" },
                      annotations: { color: nutrients.carbs?.sugar ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Added Sugars" } }],
                    [{
                      text: { content: nutrients.carbs?.addedSugar ? `${nutrients.carbs.addedSugar} g` : "N/A" },
                      annotations: { color: nutrients.carbs?.addedSugar ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Total Fat" } }],
                    [{
                      text: { content: nutrients.fats?.total ? `${nutrients.fats.total} g` : "N/A" },
                      annotations: { color: nutrients.fats?.total ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Saturated Fat" } }],
                    [{
                      text: { content: nutrients.fats?.saturated ? `${nutrients.fats.saturated} g` : "N/A" },
                      annotations: { color: nutrients.fats?.saturated ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Trans Fat" } }],
                    [{
                      text: { content: nutrients.fats?.trans ? `${nutrients.fats.trans} g` : "N/A" },
                      annotations: { color: nutrients.fats?.trans ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Cholesterol" } }],
                    [{
                      text: { content: nutrients.cholesterol ? `${nutrients.cholesterol} mg` : "N/A" },
                      annotations: { color: nutrients.cholesterol ? "blue" : "red" }
                    }]
                  ]
                }
              }
            ]
          }
        },
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [
              {
                text: {
                  content: "Core Micronutrients",
                },
              },
            ],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                text: {
                  content: "Essential vitamins and minerals necessary for proper bodily function and health maintenance.",
                },
              },
            ],
          },
        },
        {
          object: "block",
          type: "table",
          table: {
            table_width: 2,
            has_column_header: false,
            has_row_header: false,
            children: [
              {
                object: "block",
                type: "table_row", 
                table_row: {
                  cells: [
                    [{ text: { content: "Vitamin A / Retinol" } }],
                    [{
                      text: { content: nutrients.vitamins?.a ? `${nutrients.vitamins.a} µg` : "N/A" },
                      annotations: { color: nutrients.vitamins?.a ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Vitamin D / Calciferol" } }],
                    [{
                      text: { content: nutrients.vitamins?.d ? `${nutrients.vitamins.d} µg` : "N/A" },
                      annotations: { color: nutrients.vitamins?.d ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block", 
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Vitamin E / Tocopherol" } }],
                    [{
                      text: { content: nutrients.vitamins?.e ? `${nutrients.vitamins.e} mg` : "N/A" },
                      annotations: { color: nutrients.vitamins?.e ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Vitamin K / Phylloquinone" } }],
                    [{
                      text: { content: nutrients.vitamins?.k ? `${nutrients.vitamins.k} µg` : "N/A" },
                      annotations: { color: nutrients.vitamins?.k ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Vitamin B6 / Pyridoxine" } }],
                    [{
                      text: { content: nutrients.vitamins?.b6 ? `${nutrients.vitamins.b6} mg` : "N/A" },
                      annotations: { color: nutrients.vitamins?.b6 ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row", 
                table_row: {
                  cells: [
                    [{ text: { content: "Vitamin B12 / Cobalamin" } }],
                    [{
                      text: { content: nutrients.vitamins?.b12 ? `${nutrients.vitamins.b12} µg` : "N/A" },
                      annotations: { color: nutrients.vitamins?.b12 ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Vitamin B9 / Folate (DFE)" } }],
                    [{
                      text: { content: nutrients.vitamins?.folate ? `${nutrients.vitamins.folate} µg` : "N/A" },
                      annotations: { color: nutrients.vitamins?.folate ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Calcium" } }],
                    [{
                      text: { content: nutrients.micronutrients?.calcium ? `${nutrients.micronutrients.calcium} mg` : "N/A" },
                      annotations: { color: nutrients.micronutrients?.calcium ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Iron" } }],
                    [{
                      text: { content: nutrients.micronutrients?.iron ? `${nutrients.micronutrients.iron} mg` : "N/A" },
                      annotations: { color: nutrients.micronutrients?.iron ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Magnesium" } }],
                    [{
                      text: { content: nutrients.micronutrients?.magnesium ? `${nutrients.micronutrients.magnesium} mg` : "N/A" },
                      annotations: { color: nutrients.micronutrients?.magnesium ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row", 
                table_row: {
                  cells: [
                    [{ text: { content: "Zinc" } }],
                    [{
                      text: { content: nutrients.micronutrients?.zinc ? `${nutrients.micronutrients.zinc} mg` : "N/A" },
                      annotations: { color: nutrients.micronutrients?.zinc ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Iodine" } }],
                    [{
                      text: { content: nutrients.micronutrients?.iodine ? `${nutrients.micronutrients.iodine} µg` : "N/A" },
                      annotations: { color: nutrients.micronutrients?.iodine ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block", 
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Sodium" } }],
                    [{
                      text: { content: nutrients.micronutrients?.sodium ? `${nutrients.micronutrients.sodium} mg` : "N/A" },
                      annotations: { color: nutrients.micronutrients?.sodium ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Potassium" } }],
                    [{
                      text: { content: nutrients.micronutrients?.potassium ? `${nutrients.micronutrients.potassium} mg` : "N/A" },
                      annotations: { color: nutrients.micronutrients?.potassium ? "blue" : "red" }
                    }]
                  ]
                }
              }
            ]
          }
        },
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [
              {
                text: {
                  content: "Functional Clinical Data",
                },
              },
            ],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                text: {
                  content: "Detailed breakdown of specific nutrients important for clinical and therapeutic applications.",
                },
              },
            ],
          },
        },
        {
          object: "block",
          type: "table",
          table: {
            table_width: 2,
            has_column_header: false,
            has_row_header: false,
            children: [
              {
                object: "block",
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "MUFA" } }],
                    [{
                      text: { content: nutrients.fats?.mufa ? `${nutrients.fats.mufa} g` : "N/A" },
                      annotations: { color: nutrients.fats?.mufa ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block", 
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "PUFA" } }],
                    [{
                      text: { content: nutrients.fats?.pufa ? `${nutrients.fats.pufa} g` : "N/A" },
                      annotations: { color: nutrients.fats?.pufa ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Omega-3 ALA" } }],
                    [{
                      text: { content: nutrients.fats?.omega3?.ala ? `${nutrients.fats.omega3.ala} g` : "N/A" },
                      annotations: { color: nutrients.fats?.omega3?.ala ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row", 
                table_row: {
                  cells: [
                    [{ text: { content: "Omega-3 EPA" } }],
                    [{
                      text: { content: nutrients.fats?.omega3?.epa ? `${nutrients.fats.omega3.epa} g` : "N/A" },
                      annotations: { color: nutrients.fats?.omega3?.epa ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Omega-3 DHA" } }],
                    [{
                      text: { content: nutrients.fats?.omega3?.dha ? `${nutrients.fats.omega3.dha} g` : "N/A" },
                      annotations: { color: nutrients.fats?.omega3?.dha ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Leucine" } }],
                    [{
                      text: { content: nutrients.aminoAcids?.leucine ? `${nutrients.aminoAcids.leucine} g` : "N/A" },
                      annotations: { color: nutrients.aminoAcids?.leucine ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block", 
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Lysine" } }],
                    [{
                      text: { content: nutrients.aminoAcids?.lysine ? `${nutrients.aminoAcids.lysine} g` : "N/A" },
                      annotations: { color: nutrients.aminoAcids?.lysine ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row", 
                table_row: {
                  cells: [
                    [{ text: { content: "Methionine" } }],
                    [{
                      text: { content: nutrients.aminoAcids?.methionine ? `${nutrients.aminoAcids.methionine} g` : "N/A" },
                      annotations: { color: nutrients.aminoAcids?.methionine ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Cystine" } }],
                    [{
                      text: { content: nutrients.aminoAcids?.cystine ? `${nutrients.aminoAcids.cystine} g` : "N/A" },
                      annotations: { color: nutrients.aminoAcids?.cystine ? "blue" : "red" }
                    }]
                  ]
                }
              },
              {
                object: "block",
                type: "table_row",
                table_row: {
                  cells: [
                    [{ text: { content: "Choline" } }],
                    [{
                      text: { content: nutrients.choline ? `${nutrients.choline} mg` : "N/A" },
                      annotations: { color: nutrients.choline ? "blue" : "red" }
                    }]
                  ]
                }
              }
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