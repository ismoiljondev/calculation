function useLocalStorage<T>(key: string) {
  function getValue() {
    try {
      const item = window.localStorage.getItem(key);
      return item;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  const setValue = (value: string) => {
    try {
      window.localStorage.setItem(key, value as string);
    } catch (error) {
      console.error(error);
    }
  };

  const removeValue = () => {
    window.localStorage.removeItem(key);
  };

  return { value: getValue(), setValue, getValue, removeValue };
}

export default useLocalStorage;
