// Inside useFilterDataByType.js
const useFilterDataByType = (data, key, value) => {
  if (!value) return { filteredData: data };
  const filteredData = data?.filter(
    (item) => item[key]?.toLowerCase() === value?.toLowerCase()
  );
  return { filteredData };
};

export default useFilterDataByType;
