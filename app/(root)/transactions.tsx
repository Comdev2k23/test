import { useUser } from '@clerk/clerk-expo';
import { FlashList } from '@shopify/flash-list';
import axios from 'axios';
import { Trash2Icon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Transaction = {
  id: number,
  refnumber: string;
  amount: number;
  created_at: string;
  type: string;
};

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUser();
  const userId = user?.id;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString || 'No date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
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

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://tcash-api.onrender.com/api/transactions/${userId}`
      );
      setTransactions(response.data);
      setFilteredTransactions(response.data);
    } catch (error) {
      console.log('Error Fetching Transactions', error);
    }
  };

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      fetchData().finally(() => setIsLoading(false));
    }
  }, [userId]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter(transaction =>
        transaction.refnumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTransactions(filtered);
    }
  }, [searchQuery, transactions]);

  const renderItem = ({ item }: { item: Transaction }) => {
    const isCashIn = item.type === 'cashin';
    const amountColor = isCashIn ? 'text-red-400' : 'text-[#5E936C]';
    const amountPrefix = isCashIn ? '-' : '+';


  async function handleDelete (id:number) {
     Alert.alert(
    'Confirm Delete',
    'Are you sure you want to delete this transaction?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`https://tcash-api.onrender.com/api/transactions/delete/${id}`);
            Alert.alert('Deleted', 'Transaction has been deleted.');
            fetchData(); // Refresh the list after deletion
          } catch (error) {
            Alert.alert('Error', 'Failed to delete transaction.');
            console.log('Delete error:', error);
          }
        },
      },
    ]
  );
  }

    return (
      <View className="p-4 mb-2 bg-white  rounded-lg shadow-sm mx-4 border border-gray-100">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-[#3E5F44] font-medium">Ref:</Text>
          <Text className="text-[#3E5F44] font-semibold">{item.refnumber}</Text>
        </View>
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-[#3E5F44] font-medium">Amount:</Text>
          <Text className={`font-bold ${amountColor}`}>
            {amountPrefix}{Math.abs(Number(item.amount)).toFixed(2)}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-[#3E5F44] font-medium">Date:</Text>
          <Text className="text-[#5E936C]">{formatDate(item.created_at)}</Text>
        </View>
        <View className="mt-2 flex-row justify-between items-center">
          <Text className={`text-xs font-medium ${isCashIn ?  'text-red-400' : 'text-[#5E936C]' }`}>
            {isCashIn ? 'Cash In' : 'Cash Out'}
          </Text>
          <TouchableOpacity onPress={()=> handleDelete(item.id)}>
            <Trash2Icon color={'#3E5F44'} size={20}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#E8FFD7] items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-lg text-gray-600 mt-4">Loading transactions...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#E8FFD7]">
      <View className="p-4 shadow-sm">
        <Text className="text-2xl font-bold text-[#3E5F44] mb-2"> Transactions</Text>
        <View className="relative">
          <TextInput
            className="bg-white rounded-lg p-3 pl-10 text-gray-800 border border-[#93DA97]"
            placeholder="Search by reference number..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            keyboardType='numeric'
          />
          <View className="absolute left-3 top-3">
            <Text className="text-gray-400">🔍</Text>
          </View>
        </View>
      </View>

      {filteredTransactions.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          {searchQuery ? (
            <Text className="text-gray-500">Transaction not yet claimed  </Text>
            
          ) : (
            <Text className="text-gray-500">No transactions found</Text>
          )}
        </View>
      ) : (
        <FlashList
          data={filteredTransactions}
          renderItem={renderItem}
          estimatedItemSize={100}
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await fetchData();
            setRefreshing(false);
          }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          ListFooterComponent={() => <View className="h-8" />}
          contentContainerStyle={{ paddingVertical: 16 }}
        />
      )}
    </View>
  );
}