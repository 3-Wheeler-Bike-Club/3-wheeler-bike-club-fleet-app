import { getCurrencyRateAction } from "@/app/actions/currencyRate/getCurrencyRateAction"
import { useState, useEffect } from "react"

export interface CurrencyRate {
    currency: string
    rate: string
}

export const useGetCurrencyRate = (currency: string | undefined) => {
    const [currencyRate, setCurrencyRate] = useState<CurrencyRate | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any | null>(null)

    useEffect(() => {
        async function getCurrencyRate() {
            if (currency) {
                setLoading(true)
                try {
                    const data = await getCurrencyRateAction(currency)
                    setCurrencyRate(data)
                } catch (err) {
                    setError(err)
                }
                setLoading(false)
            }
        }
        getCurrencyRate()
    }, [currency])

    return { currencyRate, loading, error }
}
