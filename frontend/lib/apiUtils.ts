export async function extractJsonFromResponse(response: string): Promise<any> {
    if (!response) return null;
    
    // First try to extract JSON from code blocks
    const jsonBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonString = jsonBlockMatch?.[1] || response;
    
    try {
        // Try to parse as JSON directly
        return JSON.parse(jsonString);
    } catch (e) {
        // If direct parsing fails, try to find and extract JSON-like content
        try {
            // Look for JSON-like content (object or array)
            const jsonLikeMatch = jsonString.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
            if (jsonLikeMatch) {
                return JSON.parse(jsonLikeMatch[0]);
            }
            
            // If we still can't parse, try to clean up and parse again
            const cleaned = jsonString
                .replace(/^[^{[\s]*|[^}\]]*$/g, '') // Remove non-JSON content from start/end
                .replace(/[\n\r]+/g, '') // Remove newlines
                .replace(/\s+/g, ' ') // Collapse multiple spaces
                .trim();
                
            if (cleaned) {
                return JSON.parse(cleaned);
            }
            
            console.error('No valid JSON found in response');
            return null;
        } catch (innerError) {
            console.error('Failed to parse JSON from response:', innerError);
            return null;
        }
    }
}