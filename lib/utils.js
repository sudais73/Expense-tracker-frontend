export function formatDate(dateString) {
  if (!dateString) return ''; // handle undefined/null
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString("en-US", options); // use "en-US" instead of "en_US"
}
