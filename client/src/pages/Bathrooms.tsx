type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
export function Bathrooms({ value, onChange }: Props) {
  return (
    <input
      type="number"
      name="bathrooms"
      placeholder="Bathrooms"
      value={value}
      onChange={onChange}
      className="bg-gray-800 text-white px-4 py-2 rounded placeholder-gray-400"
    />
  );
}
