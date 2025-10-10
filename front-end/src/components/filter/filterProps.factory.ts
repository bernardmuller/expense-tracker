const FILTER_PLACEHOLDER = "Filter" as const

const filterItems = [
  ...Array(10).keys(),
].map(() => {
  return {
    name: "test"
  };
});
