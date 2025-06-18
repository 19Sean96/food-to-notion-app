import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function GET(
  request: Request,
  { params }: { params: { pageId: string } }
) {
  try {
    const { pageId } = params;
    const page = await notion.pages.retrieve({ page_id: pageId });
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    });

    return NextResponse.json({ page, blocks: blocks.results });
  } catch (error: any) {
    console.error('Error fetching Notion page:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch Notion page' },
      { status: error.status || 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: { pageId: string } }) {
  try {
    const { pageId } = params;
    const { food, servingSizeDisplay } = await request.json();

    // Prepare properties to update
    const props: any = {
      'Food Name': { title: [{ text: { content: food.description } }] },
      'Serving Size': { rich_text: [{ text: { content: servingSizeDisplay || `${food.servingSize} ${food.servingSizeUnit}` } }] },
    };

    // Include metric and imperial if present
    if (food.servingSizeMetric && food.servingSizeMetricUnit) {
      props['Serving Size Metric'] = { rich_text: [{ text: { content: `${food.servingSizeMetric} ${food.servingSizeMetricUnit}` } }] };
    }
    if (food.servingSizeImperial && food.servingSizeImperialUnit) {
      props['Serving Size Imperial'] = { rich_text: [{ text: { content: `${food.servingSizeImperial} ${food.servingSizeImperialUnit}` } }] };
    }

    await notion.pages.update({
      page_id: pageId,
      properties: props,
    });

    return NextResponse.json({ success: true, message: 'Successfully updated Notion page' });
  } catch (error: any) {
    console.error('Error updating Notion page:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to update Notion page' }, { status: 500 });
  }
} 