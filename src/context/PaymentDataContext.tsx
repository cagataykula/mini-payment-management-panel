import { getPayments } from '@/services';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import type { Payment } from '@/types/payment.types';
import { PaymentDataContextValue } from '@/types/paymentDataContext.types';

const PaymentDataContext = createContext<PaymentDataContextValue | undefined>(undefined)

export const PaymentDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [paymentData, setPaymentData] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPaymentData = async () => {
    setIsLoading(true)
    const { data, error } = await getPayments()
    if (error) {
      console.error('an error occured')
    } else {
      setPaymentData(data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchPaymentData()
  }, [])

  return (
    <PaymentDataContext.Provider value={{
      paymentData,
      isLoading,
      fetchPaymentData
    }}>
      {children}
    </PaymentDataContext.Provider>
  )
}

export function usePaymentDataContext() {
  const context = useContext(PaymentDataContext);
  if (!context) {
    throw new Error('usePaymentDataContext has error');
  }

  return context!;
}