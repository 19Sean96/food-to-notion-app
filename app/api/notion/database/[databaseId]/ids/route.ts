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
    let allFdcIds: number[] = [];
    let hasMore = true;
    let startCursor: string | undefined = undefined;

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

      const fdcIds = response.results
        .map((page: any) => page.properties['FDC ID']?.number)
        .filter((id: number | null) => id !== null);

      allFdcIds = [...allFdcIds, ...fdcIds];
      hasMore = response.has_more;
      startCursor = response.next_cursor;
    }

    return NextResponse.json({ fdcIds: allFdcIds });
  } catch (error: any) {
    console.error('Error fetching FDC IDs from Notion:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to fetch FDC IDs from Notion',
      },
      { status: error.status || 500 }
    );
  }
} 