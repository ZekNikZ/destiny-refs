const CARDINALS = ["ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN"];

export function numberToCardinal(x: number) {
  return CARDINALS[x - 1] ?? x.toString();
}

export function numberToOrdinal(x: number) {
  const j = x % 10;
  const k = x % 100;

  if (j === 1 && k !== 11) {
    return x + "st";
  }
  if (j === 2 && k !== 12) {
    return x + "nd";
  }
  if (j === 3 && k !== 13) {
    return x + "rd";
  }
  return x + "th";
}
