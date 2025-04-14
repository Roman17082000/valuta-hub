import { mockRates } from "./mockRates.ts";

export const fetchRates = async (
  date: string,
): Promise<Record<string, number>> => {
  if (mockRates[date]) {
    return mockRates[date];
  }

  try {
    const res = await fetch(`https://www.cbr-xml-daily.ru/daily_json.js`);
    const data = await res.json();

    const rates: Record<string, number> = {
      RUB: 1,
    };

    for (const [code, valute] of Object.entries(data.Valute) as [
      string,
      { Value: number },
    ][]) {
      rates[code] = valute.Value;
    }

    return rates;
  } catch (err) {
    throw new Error("Ошибка при получении данных с API ЦБ РФ");
  }
};
