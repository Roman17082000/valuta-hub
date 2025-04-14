import { useEffect, useState } from "react";
import { fetchRates } from "../../lib/fetchRates.ts";
import Flag from "../Flag/Flag.tsx";
import CurrencySelect from "../CurrencySelect/CurrencySelect.tsx";
import DateInput from "../DateInput/DateInput.tsx";

const CurrencyConverter = () => {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("RUB");
  const [amountFrom, setAmountFrom] = useState("0");
  const [amountTo, setAmountTo] = useState("0");
  const [activeInput, setActiveInput] = useState<"from" | "to">("from");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [rates, setRates] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRates = async () => {
      try {
        const result = await fetchRates(selectedDate);
        setRates(result);
        setError(null);
      } catch (err) {
        console.error("Ошибка при загрузке курсов ЦБ РФ", err);
      }
    };

    loadRates();
  }, [selectedDate]);

  useEffect(() => {
    if (
      !fromCurrency ||
      !toCurrency ||
      !rates[fromCurrency] ||
      !rates[toCurrency]
    )
      return;

    try {
      const fromRate = rates[fromCurrency];
      const toRate = rates[toCurrency];

      if (activeInput === "from") {
        const from = parseFloat(amountFrom);
        if (!isNaN(from)) {
          const rub = from * fromRate;
          setAmountTo((rub / toRate).toFixed(2));
        }
      } else {
        const to = parseFloat(amountTo);
        if (!isNaN(to)) {
          const rub = to * toRate;
          setAmountFrom((rub / fromRate).toFixed(2));
        }
      }
    } catch (e: any) {
      setError("Ошибка при расчёте");
      alert("Ошибка при конвертации: " + e.message);
    }
  }, [amountFrom, amountTo, fromCurrency, toCurrency, rates, activeInput]);

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
      <h1 className="text-4xl font-bold text-white text-center mb-6">
        Конвертер валют
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Flag currencyCode={fromCurrency} />
            <CurrencySelect value={fromCurrency} onChange={setFromCurrency} />
          </div>
          <input
            type="number"
            value={amountFrom}
            onChange={(e) => {
              setActiveInput("from");
              setAmountFrom(e.target.value);
            }}
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Flag currencyCode={toCurrency} />
            <CurrencySelect value={toCurrency} onChange={setToCurrency} />
          </div>
          <input
            type="number"
            value={amountTo}
            onChange={(e) => {
              setActiveInput("to");
              setAmountTo(e.target.value);
            }}
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-6">
        <DateInput value={selectedDate} onChange={setSelectedDate} />
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
