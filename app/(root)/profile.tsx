import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Profile() {
  const [balance, setBalance] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { user } = useUser();
  const userId = user?.id;

  const router = useRouter()

  const updateBalance = async () => {
    if (!balance || isNaN(Number(balance))) {
      Alert.alert('Invalid Input', 'Please enter a valid number.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(
        `https://tcash-api.onrender.com/api/users/update-balance`,
        {
          userId: userId,
          balance: parseFloat(balance), // ✅ fixed key
        }
      );
      Alert.alert('Success', response.data.message);
      setBalance('');
      router.push('/')
    } catch (error: any) {
      console.error('Error updating balance:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Something went wrong.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollContainer}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Enter new balance (₱)"
            keyboardType="numeric"
            value={balance}
            onChangeText={setBalance}
          />

          <TouchableOpacity
            onPress={updateBalance}
            style={[styles.button, submitting && styles.disabledButton]}
            disabled={submitting}
          >
            <Ionicons
              name="cloud-upload-outline"
              size={20}
              color="white"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>
              {submitting ? 'Updating...' : 'Update Balance'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#E8FFD7',
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#5E936C',
    borderRadius: 8,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
