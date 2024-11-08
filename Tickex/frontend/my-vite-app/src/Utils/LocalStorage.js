export function loadData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading data from localStorage", error);
    return null;
  }
}

export function saveData(key, item) {
  try {
    const jsonData = JSON.stringify(item);
    localStorage.setItem(key, jsonData);
  } catch (error) {
    console.error("Error saving data to localStorage", error);
  }
}
