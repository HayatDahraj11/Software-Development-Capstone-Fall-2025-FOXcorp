import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveUsername = async (username: string) => {
  try { await AsyncStorage.setItem("rememberedUsername", username); } 
  catch (err) { console.log("Error saving username", err); }
};

export const loadUsername = async () => {
  try { return await AsyncStorage.getItem("rememberedUsername"); } 
  catch (err) { console.log("Error loading username", err); return null; }
};

export const clearUsername = async () => {
  try { await AsyncStorage.removeItem("rememberedUsername"); } 
  catch (err) { console.log("Error clearing username", err); }
};