export default function Button(props: any) {
  const { children, className, isLoading } = props;
  return (
    <button
      {...props}
      className={`w-full text-white bg-gray-700 hover:bg-gray-500 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
        className ? className : ""
      }`}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
