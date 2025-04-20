export default function formatNectCoins(num) {
  if (num == null) return '';
  if (num < 1000) return String(num);
  if (num < 1000000) {
    return (Math.floor(num / 100) / 10).toFixed(1) + 'k';
  }
  if (num < 1000000000) return Math.floor(num / 1000000) + 'M';
  return Math.floor(num / 1000000000) + 'B';
}
