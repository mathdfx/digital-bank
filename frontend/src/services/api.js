import axios from 'axios';
import { format, subDays } from 'date-fns';

const COINGECKO_IDS = {
    'BTC': 'bitcoin',
};

const FIAT_CURRENCIES = ['USD', 'EUR', 'GBP', 'CNY'];

const fetchCoinGeckoData = async (currency, days) => {
    const coinId = COINGECKO_IDS[currency];
    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
            params: {
                vs_currency: 'brl',
                days: days,
            }
        });
        return response.data.prices;
    } catch (error) {
        console.error(`Erro ao buscar dados da CoinGecko para ${currency}:`, error);
        return null;
    }
};

const fetchFxRatesData = async (currency, days) => {

    const numberOfDaysToFetch = days === 1 ? 2 : days;
    const datePromises = [];
    for (let i = 0; i < numberOfDaysToFetch; i++) {
        const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
        const promise = axios.get(`https://api.fxratesapi.com/historical?date=${date}&base=BRL&symbols=${currency}`);
        datePromises.push(promise);
    }

    try {
        const responses = await Promise.all(datePromises);
        const prices = responses.map(response => {
            const date = new Date(response.data.date).getTime();
            const price = 1 / response.data.rates[currency];
            return [date, price];
        });
        return prices.reverse();
    } catch (error) {
        console.error(`Erro ao buscar dados da FxRatesAPI para ${currency}:`, error);
        return null;
    }
};

export const fetchHistoricalData = async (currency, days = 7) => { // O padrão agora é 7 dias
    if (COINGECKO_IDS[currency]) {
        return fetchCoinGeckoData(currency, days);
    }
    
    if (FIAT_CURRENCIES.includes(currency)) {
        return fetchFxRatesData(currency, days);
    }

    console.warn(`Nenhuma fonte de dados históricos encontrada para a moeda: ${currency}`);
    return null;
};
