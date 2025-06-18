import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';
import { ProcessedFoodItem } from '@/types';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Helper to safely extract property values
const getPropertyValue = (page: any, propertyName: string, type: string) => {
  const prop = page.properties[propertyName];
  if (!prop || !prop[type]) {
    return null;
  }
  if (type === 'number') {
    return prop.number;
  }
  if (type === 'title') {
    return prop.title[0]?.plain_text || '';
  }
  if (type === 'rich_text') {
    return prop.rich_text[0]?.plain_text || '';
  }
  if (type === 'select') {
    return prop.select?.name || '';
  }
  return null;
};

export async function POST(
  request: Request,
  { params }: { params: { databaseId: string } }
) {
  try {
    const { databaseId } = params;
    const { fdcIds } = await request.json();

    if (!Array.isArray(fdcIds) || fdcIds.length === 0) {
      return NextResponse.json({ pages: [] });
    }

    // Create a filter for all the FDC IDs
    const orFilter = fdcIds.map(id => ({
      property: 'FDC ID',
      number: {
        equals: id,
      },
    }));

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        or: orFilter,
      },
    });

    const processedPages: ProcessedFoodItem[] = response.results.map((page: any) => {
      // This is a simplified reconstruction. We assume that the core nutrient data
      // is not edited in Notion properties, so we only pull fields that can be edited.
      // A more robust solution might store the entire JSON blob in a Notion property.
      return {
        id: getPropertyValue(page, 'FDC ID', 'number'),
        description: getPropertyValue(page, 'Food Name', 'title'),
        brandOwner: getPropertyValue(page, 'Brand Name', 'rich_text'),
        dataType: getPropertyValue(page, 'Data Type', 'select'),
        foodCategory: getPropertyValue(page, 'Food Group', 'select'),
        servingSize: parseFloat(getPropertyValue(page, 'Serving Size', 'rich_text')),
        servingSizeUnit: getPropertyValue(page, 'Serving Size', 'rich_text')?.split(' ')[1] || 'g',
        // Nutrient data is not easily readable from properties, so we will rely on
        // the original fetch for that, but the UI will re-scale them based on the saved serving size.
        nutrients: {} as any, // Placeholder
      };
    });

    return NextResponse.json({ pages: processedPages });
  } catch (error: any) {
    console.error('Error fetching pages from Notion:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch pages from Notion' },
      { status: 500 }
    );
  }
} 