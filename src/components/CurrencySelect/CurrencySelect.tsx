import { useState, useEffect, useRef } from "react";
import { Currency } from "../../types";

type Props = {
  value: string;
  onChange: (code: string) => void;
};

const CurrencySelect = ({ value, onChange }: Props) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState<Currency[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const ref = useRef<HTMLDivElement | null>(null);
  const [recentlyUsed, setRecentlyUsed] = useState<Currency[]>([]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");
        const data = await res.json();

        const currencyList: Currency[] = [
          { code: "RUB", name: "Российский рубль" },
          ...Object.entries(data.Valute).map(([code, val]: any) => ({
            code,
            name: val.Name,
          })),
        ];

        setCurrencies(currencyList);
        setFiltered(currencyList);
        const savedRecent = JSON.parse(
          localStorage.getItem("recentCurrencies") || "[]",
        );
        setRecentlyUsed(savedRecent);
      } catch (err) {
        console.error("Не удалось загрузить список валют", err);
      }
    };

    fetchCurrencies();
  }, []);

  const saveToLocalStorage = (currency: Currency) => {
    const updated = [
      currency,
      ...recentlyUsed.filter((c) => c.code !== currency.code),
    ].slice(0, 5);
    setRecentlyUsed(updated);
    localStorage.setItem("recentCurrencies", JSON.stringify(updated));
  };

  useEffect(() => {
    const selected = currencies.find((c) => c.code === value);
    if (selected) {
      setSearch(`${selected.code} — ${selected.name}`);
    }
  }, [value, currencies]);

  useEffect(() => {
    const query = search.toLowerCase();
    if (search === "") {
      setFiltered(currencies);
    } else {
      setFiltered(
        currencies.filter(
          (cur) =>
            cur.code.toLowerCase().includes(query) ||
            cur.name.toLowerCase().includes(query),
        ),
      );
    }
  }, [search, currencies]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSelect = (currency: Currency) => {
    onChange(currency.code);
    saveToLocalStorage(currency);
    setSearch(`${currency.code} — ${currency.name}`);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearch("");
    onChange("");
  };

  const groupedCurrencies = recentlyUsed.length
    ? [
        { label: "Недавние", currencies: recentlyUsed },
        {
          label: "Все валюты",
          currencies: filtered.filter((c) => !recentlyUsed.includes(c)),
        },
      ]
    : [{ label: "Все валюты", currencies: filtered }];

  return (
    <div className="relative" ref={ref}>
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Поиск валюты"
        className="w-full p-3 border rounded pr-10"
      />
      {/* Кнопка очистки */}
      {search && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
      {isOpen && (
        <div className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-60 overflow-y-auto">
          {groupedCurrencies.map((group) => (
            <div key={group.label}>
              <div className="px-4 py-2 font-bold">{group.label}</div>
              {group.currencies.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">Ничего не найдено</div>
              ) : (
                group.currencies.map((currency) => (
                  <div
                    key={currency.code}
                    onClick={() => handleSelect(currency)}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                  >
                    {currency.code} — {currency.name}
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencySelect;
