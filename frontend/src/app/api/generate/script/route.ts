import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[API] Received request:', body);
    
    console.log('[API] Fetching from backend...');
    const response = await axios.post('http://localhost:8000/generate/script', body, {
      timeout: 120000, // 2 minutes
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('[API] Response received:', response.status);
    console.log('[API] Response data received');
    return Response.json(response.data);
  } catch (error) {
    console.error('Script generation error:', error);
    if (axios.isAxiosError(error)) {
      return Response.json({ 
        error: `Failed to generate script: ${error.message}` 
      }, { status: error.response?.status || 500 });
    }
    return Response.json({ 
      error: 'Failed to generate script: Unknown error' 
    }, { status: 500 });
  }
}
