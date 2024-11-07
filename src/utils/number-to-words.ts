const CARDINALS = ["ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN"];

export function numberToCardinal(x: number) {
  return CARDINALS[x - 1] ?? x.toString();
}
