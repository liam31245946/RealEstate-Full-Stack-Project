type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
export function Bedrooms({ value, onChange }: Props) {
  return (
    <input
      type="number"
      name="bedrooms"
      placeholder="Bedrooms"
      value={value}
      onChange={onChange}
      className="bg-gray-800 text-white px-4 py-2 rounded placeholder-gray-400"
    />
  );
}
