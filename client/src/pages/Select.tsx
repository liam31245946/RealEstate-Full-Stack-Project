type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};
export function Select({ value, onChange }: Props) {
  return (
    <select
      name="status"
      value={value}
      onChange={onChange}
      className="bg-gray-800 text-white px-4 py-2 rounded">
      <option value="">Select</option>
      <option value="for-sale">For Sale</option>
      <option value="for-rent">For Rent</option>
    </select>
  );
}
