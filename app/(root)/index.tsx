import { SignOutButton } from '@/components/SignOutButton';
import { SignedIn, useUser } from '@clerk/clerk-expo';
import axios from 'axios';
import { useFocusEffect, useRouter } from 'expo-router';
import { BanknoteArrowDown, BanknoteArrowUp } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';


type Transaction = {
  id: number;
  refnumber: string;
  amount: number;
  created_at: string;
  type: string;
};

export default function Page() {
  const { user } = useUser();
  const router = useRouter();

  const [balance, setBalance] = useState([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const userId = user?.id;
  const username = user?.emailAddresses?.[0]?.emailAddress.split('@')[0] || 'User';

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  })();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString || 'No date';
      }
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString || 'No date';
    }
  };

  async function fetchData() {
    try {
      setIsLoading(true);
      const [balanceRes, transactionsRes] = await Promise.all([
        axios.get(`https://tcash-api.onrender.com/api/users/${userId}`),
        axios.get(`https://tcash-api.onrender.com/api/transactions/${userId}`)
      ]);
      
      setBalance(balanceRes.data.user.balance);
      setTransactions(transactionsRes.data);
    } catch (error) {
      console.log("Error fetching data", error);
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
    if (userId) {
      fetchData();
    }
  }, [userId])
  )

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  const renderTransactionItem = (item: Transaction) => {
    const isCashIn = item.type === 'cashin';
    const amountColor = isCashIn ? 'text-red-400' : 'text-[#5E936C]';
    const amountPrefix = isCashIn ? '-' : '+';

    return (
      <View key={item.id} className="p-3 mb-2 bg-white rounded-lg shadow-sm border border-gray-100">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-[#3E5F44] font-medium">Ref: {item.refnumber}</Text>
          <Text className={`font-bold ${amountColor}`}>
            ₱{amountPrefix}{Math.abs(Number(item.amount)).toFixed(2)}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-[#5E936C]">{formatDate(item.created_at)}</Text>
          <Text className={`text-xs font-medium ${isCashIn ? 'text-red-400' : 'text-[#5E936C]'}`}>
            {isCashIn ? 'Cash In' : 'Cash Out'}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#E8FFD7] items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-[#E8FFD7]"
    >
      <View className="flex-1 p-6">
        <SignedIn>
          {/* Header Card */}
          <View className="flex-row items-center justify-between bg-white p-4 rounded-2xl shadow mb-6">
            <View className="border-2 border-emerald-400 rounded-full p-0.5">
              <Image
                className="w-20 h-20 rounded-full"
                source={require('@/assets/images/girl.png')}
              />
            </View>

            <View className="flex-1 ml-4">
              <Text className="text-lg font-semibold text-gray-800">Hi, {username}!</Text>
              <Text className="text-sm text-emerald-600">Good {greeting}!</Text>
            </View>

            <TouchableOpacity className="bg-emerald-100 p-2 rounded-full">
              <SignOutButton />
            </TouchableOpacity>
          </View>

          <View className='flex bg-white mb-6 p-2 rounded-lg shadow'>
            <Text className='pl-4 text-xl text-[#3E5F44] font-medium'>Balance:</Text>
            <Text className="text-md font-bold text-lg text-[#5E936C] mt-1 pl-4">
              ₱ {balance ?? '0.00'}</Text>
          </View>

          {/* Cash In / Cash Out */}
          <View className="flex-row justify-between mb-6">
            <TouchableOpacity
              onPress={() => router.push('/cashin')}
              className="bg-white p-6 rounded-2xl shadow flex-1 mr-3 items-center"
            >
              <View className="bg-emerald-100 p-4 rounded-full mb-2">
                <BanknoteArrowUp size={24} color="#3E5F44" />
              </View>
              <Text className="text-[#3E5F44] font-semibold">Cash In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/cashout')}
              className="bg-white p-6 rounded-2xl shadow flex-1 ml-3 items-center"
            >
              <View className="bg-amber-100 p-4 rounded-full mb-2">
                <BanknoteArrowDown size={24} color="#3E5F44" />
              </View>
              <Text className="text-[#3E5F44] font-semibold">Cash Out</Text>
            </TouchableOpacity>
          </View>

          {/* Transactions Section */}
          <View className="bg-white p-6 rounded-2xl shadow mb-6">
            <Text className="text-lg font-bold text-[#3E5F44] mb-4">Recent transactions</Text>
            
            {recentTransactions.length === 0 ? (
              <View className="items-center py-8">
                <Text className="text-gray-400">No recent transactions</Text>
              </View>
            ) : (
              <View>
                {recentTransactions.map(renderTransactionItem)}
                <TouchableOpacity 
                  onPress={() => router.push('/transactions')}
                  className="mt-4 items-center"
                >
                  <Text className="text-emerald-600 font-medium">View All Transactions</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </SignedIn>
      </View>
    </ScrollView>
  );
}