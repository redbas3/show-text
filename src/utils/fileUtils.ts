export const readTextFile = async (filePath: string): Promise<string> => {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load file: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error("Error reading file:", error);
    return "";
  }
};
