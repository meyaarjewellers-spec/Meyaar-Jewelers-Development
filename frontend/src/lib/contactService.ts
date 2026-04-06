/**
 * Send contact form submission to backend
 */
export async function sendContactMessage(data: {
  name: string;
  email: string;
  message: string;
}) {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending contact message:', error);
    throw error;
  }
}
