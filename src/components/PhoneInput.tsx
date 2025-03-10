
import React, { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder = "88017xxxxxxxx",
  required = false,
  disabled = false,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Remove all non-digit characters
    const digitsOnly = inputValue.replace(/\D/g, "");
    
    // Update the input value
    onChange(digitsOnly);
    
    // Validate the phone number
    if (digitsOnly.length > 0 && digitsOnly.length < 8) {
      setError("নম্বরটি খুব ছোট");
    } else if (digitsOnly.length > 15) {
      setError("নম্বরটি খুব বড়");
    } else if (digitsOnly.length > 0 && !/^\d+$/.test(digitsOnly)) {
      setError("শুধুমাত্র সংখ্যা ব্যবহার করুন");
    } else {
      setError(null);
    }
  };

  return (
    <div className="space-y-1">
      <Input
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default PhoneInput;
