import { useEffect } from "react";

export default function Input(props: any) {
  const { label, labelClassName, inputClassName, error } = props;
  useEffect(() => {
    console.log(error);
  }, [props]);
  return (
    <div>
      {label && (
        <label
          htmlFor="password"
          className={`block mb-2 text-sm font-medium text-gray-900 dark:text-white ${
            labelClassName ? labelClassName : ""
          }`}
        >
          {label}
        </label>
      )}
      <input
        className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
          inputClassName ? inputClassName : ""
        }`}
        {...props}
      />
      {error && <span className="text-sm font-bold text-red-900">{error}</span>}
    </div>
  );
}
