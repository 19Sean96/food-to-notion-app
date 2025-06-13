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
  
      // Get database information
      const database = await notion.databases.retrieve({
        database_id: databaseId,
      });
  
      // Get the first 100 pages to count total pages
      const pages = await notion.databases.query({
        database_id: databaseId,
        page_size: 100,
      });
  
      const response = {
        title: (database as any).title[0]?.plain_text || "Untitled",
        pageCount: pages.results.length,
        properties: Object.entries(database.properties).map(([name, prop]) => ({
          name,
          type: prop.type,
        })),
      };
  
      return NextResponse.json(response);
    } catch (error: any) {
      console.error('Error fetching database info:', error);
      return NextResponse.json({
        error: error.message || 'Failed to fetch database information',
      }, { status: error.status || 500 });
    }
} 