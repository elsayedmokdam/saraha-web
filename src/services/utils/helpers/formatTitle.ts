export default function formatTitle(title: string, maxLength: number) {
  if (title.length > maxLength) {
    return title.substring(0, maxLength) + "...";
  }
  return title;
}
