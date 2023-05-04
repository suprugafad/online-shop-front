import { ICartItem } from "../../types";
import { ChangeEvent, FC, useState } from "react";
import { TextField } from "@mui/material";

interface QuantityInputProps {
  item: ICartItem;
  onChange: (item: ICartItem, newQuantity: number) => void;
}

const QuantityInput: FC<QuantityInputProps> = ({ item, onChange }) => {
  const [value, setValue] = useState(item.quantity);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value);
    if (newQuantity >= 1 && newQuantity <= 99) {
      setValue(newQuantity);
      onChange(item, newQuantity);
    }
  };

  return (
    <TextField
      type="number"
      InputProps={{ inputProps: { min: 1, max: 99 } }}
      value={value}
      onChange={handleChange}
      variant="outlined"
      size="small"
    />
  );
};

export default QuantityInput;