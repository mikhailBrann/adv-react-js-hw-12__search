const SearchSkills = async (search: string, signal: any) => {
    const apiUrl = import.meta.env.VITE_API_SEARCH_URL;
    const params = new URLSearchParams({ q: search });
    const reqParams = signal ? { signal } : {};
  
    const response = await fetch(`${apiUrl}${params}`, reqParams);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
};

export default SearchSkills;
  