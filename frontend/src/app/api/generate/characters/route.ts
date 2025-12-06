import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await axios.post('http://localhost:8000/generate/characters', body, {
      timeout: 120000, // 2 minutes
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return Response.json(response.data);
  } catch (error) {
    console.error('Character generation error:', error);
    return Response.json({ error: 'Failed to generate characters' }, { status: 500 });
  }
}
