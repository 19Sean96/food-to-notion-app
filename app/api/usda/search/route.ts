import { NextResponse } from 'next/server';
import axios from 'axios';

const USDA_API_KEY = process.env.USDA_API_KEY || '';
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const dataTypes = searchParams.get('dataTypes');
    const pageSize = searchParams.get('pageSize');

    if (!query) {
      return NextResponse.json({ message: 'Query parameter is required' }, { status: 400 });
    }

    const response = await axios.get(`${USDA_BASE_URL}/foods/search`, {
      params: {
        api_key: USDA_API_KEY,
        query,
        dataType: dataTypes || 'Foundation,Branded',
        pageSize: pageSize || 15,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('USDA Search API Error:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to fetch data from USDA API', error: message }, { status: 500 });
  }
} 