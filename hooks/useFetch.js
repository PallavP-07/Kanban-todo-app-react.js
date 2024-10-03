import { useEffect, useState } from 'react'


const useFetch = (url) => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {


        const fetchData = async () => {
            setLoading(true)
            try {
                let response = await fetch(url)
                if (!response.ok) {
                    throw new Error("failed fetch data")
                }
                const result = await response.json()
                setData(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false)
            }


        }
        if (url) {
            fetchData();
        }
    }, [url]);
    return { data, loading, error }
}

export default useFetch