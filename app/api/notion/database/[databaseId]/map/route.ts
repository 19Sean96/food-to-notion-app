import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function GET(
  request: Request,
  { params }: { params: { databaseId: string } }
) {
  try {
    const { databaseId } = params;
    let hasMore = true;
    let startCursor: string | undefined = undefined;
    const map: Record<number, string> = {};

    while (hasMore) {
      const response: any = await notion.databases.query({
        database_id: databaseId,
        page_size: 100,
        start_cursor: startCursor,
        filter: {
          property: 'FDC ID',
          number: {
            is_not_empty: true,
          },
        },
      });

      response.results.forEach((page: any) => {
        const id = page.properties['FDC ID']?.number;
        if (id) {
          map[id] = page.id;
        }
      });

      hasMore = response.has_more;
      startCursor = response.next_cursor;
    }

    return NextResponse.json({ map });
  } catch (error: any) {
    console.error('Error fetching FDC map from Notion:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch FDC map from Notion' },
      { status: error.status || 500 }
    );
  }
}
