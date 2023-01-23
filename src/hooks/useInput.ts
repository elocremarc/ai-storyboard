import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const useInput = (isValid: any = () => {}, value = "") => {
  const [inputValue, setInputValue] = useState(value);
  const [inputTouched, setInputTouched] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const isValueValid = isValid(inputValue);
  const isInputInvalid = !isValueValid && inputTouched;

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const valueHandler = (event: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    setInputValue(event.target.value);
  };

  const blurHandler = () => {
    setInputTouched(true);
  };

  const reset = () => {
    setInputValue("");
    setInputTouched(false);
  };

  return {
    inputValue,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    isValueValid,
    isInputInvalid,
    valueHandler,
    blurHandler,
    reset,
  };
};

export default useInput;
