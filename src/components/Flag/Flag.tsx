type Props = {
  currencyCode: string;
};

const Flag = ({ currencyCode }: Props) => {
  const countryCode = currencyCode.slice(0, 2).toLowerCase();
  const src = `https://flagsapi.com/${countryCode.toUpperCase()}/flat/64.png`;

  return (
    <img
      src={src}
      alt={`Флаг ${currencyCode}`}
      className="w-6 h-4 object-cover rounded border"
      onError={(e) => {
        (e.target as HTMLImageElement).src = "";
      }}
    />
  );
};

export default Flag;
