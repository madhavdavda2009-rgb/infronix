export function enquiryDescription(body) {
  const primary = body.projectDescription || body.projectDetails || body.message;
  if (typeof primary !== 'string' || primary.trim().length < 5) {
    throw new Error('Please provide a brief message.');
  }
  return [
    primary.trim().slice(0, 6000),
    typeof body.websiteUrl === 'string' && body.websiteUrl.trim() ? `Current website: ${body.websiteUrl.trim().slice(0, 2000)}` : '',
    typeof body.additionalNotes === 'string' && body.additionalNotes.trim() ? `Additional notes: ${body.additionalNotes.trim().slice(0, 1500)}` : '',
  ].filter(Boolean).join('\n\n');
}
