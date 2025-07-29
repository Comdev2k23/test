import { useUser } from "@clerk/clerk-expo";
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const TransactionContext = createContext()

export const TransactionProvider =({children}) => {

    const {user} = useUser()
    const [users, setUser] = useState(null)
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = (true)

    const userId = user.id

    const loadData = async () => {
        try {
            const [userRes, txRes] = await Promise.all([
                axios.get(`https://tcash-api.onrender.com/api/users/${userId}`),
                axios.get(`https://tcash-api.onrender.com/api/transactions/${userId}`)
            ])

            setUser(userRes.data)
            setTransactions(txRes.data)
        } catch (error) {
             console.error("❌ Failed to load data", error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=> {
        loadData()
    }, [])

     return (
    <TransactionContext.Provider value={{ user, transactions, loading }}>
      {children}
    </TransactionContext.Provider>
  );

}