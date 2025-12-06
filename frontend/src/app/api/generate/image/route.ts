import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await axios.post('http://localhost:8000/generate/image', body, {
      timeout: 180000, // 3 minutes for image generation
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return Response.json(response.data);
  } catch (error) {
    console.error('Image generation error:', error);
    return Response.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
