type Category = { value: string };
type Amount = { value: number };

export function supportCategory(categories: Category[], preferred?: string): string {
  return categories.find(item => item.value === preferred)?.value || categories[0]?.value || '';
}

// Labels are editorial text; only the numeric CMS value is sent to the API.
export function supportAmount(amounts: Amount[], category: string, selected?: number): number | undefined {
  if (category === 'materiel') return undefined;
  return amounts.find(item => item.value === selected && Number.isFinite(item.value) && item.value > 0 && item.value <= 999999999 && Math.round(item.value * 100) / 100 === item.value)?.value;
}
