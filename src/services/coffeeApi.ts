import axios, { AxiosError } from 'axios'; 


const API_BASE_URL = 'http://localhost:3000/coffees';

export const getCoffees = async (filters = {}) => {
  try {
    const response = await axios.get(API_BASE_URL, { params: filters });
    return response.data;
  } catch (error: AxiosError | any) { 
    
    console.error('Erro ao buscar cafés:', error.response?.data || error.message);
    throw error; 
  }
};

export const getCoffeeById = async (id: string) => { 
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error: AxiosError | any) { 
    console.error(`Erro ao buscar café com ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const createCoffee = async (coffeeData: any) => { 
  try {
    const response = await axios.post(API_BASE_URL, coffeeData);
    return response.data;
  } catch (error: AxiosError | any) { 
    console.error('Erro ao criar café:', error.response?.data || error.message);
    throw error;
  }
};

