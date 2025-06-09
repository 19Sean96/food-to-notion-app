import { NextResponse } from 'next/server';
import axios from 'axios';

const USDA_API_KEY = process.env.USDA_API_KEY || '';
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

export async function GET(
  request: Request,
  { params }: { params: { fdcId: string } }
) {
  try {
    const { fdcId } = params;

    if (!fdcId) {
      return NextResponse.json({ message: 'Food ID (fdcId) parameter is required' }, { status: 400 });
    }

    const response = await axios.get(`${USDA_BASE_URL}/food/${fdcId}`, {
      params: {
        api_key: USDA_API_KEY,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('USDA Details API Error:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to fetch data from USDA API', error: message }, { status: 500 });
  }
}
