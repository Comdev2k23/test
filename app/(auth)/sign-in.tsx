import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignInPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setIsLoading(true);
    setError(null);

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        switch (err.errors[0]?.code) {
          case 'form_password_incorrect':
            setError('Password is incorrect. Please try again.');
            break;
          case 'form_identifier_not_found':
            setError('Account not found. Please check your email.');
            break;
          default:
            setError(err.errors[0]?.longMessage || 'An error occurred. Please try again.');
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={30}
    >
      <View className="flex-1 bg-[#E8FFD7] justify-center p-6">
        {/* Header with Logo */}
        <View className="items-center mb-8">
          <Image 
            source={require('@/assets/images/signin.png')} 
            className="w-52 h-52 mb-4"
          />
          <Text className="text-4xl font-bold text-[#3E5F44]">Welcome Back</Text>
          <Text className="text-[#3E5F44] text-lg mt-1">Sign in to continue</Text>
        </View>

        {/* Error Message */}
        {error && (
          <View className="bg-red-100 p-3 rounded-lg mb-4 flex-row items-center">
            <Text className="text-red-700 flex-1">{error}</Text>
            <TouchableOpacity onPress={() => setError(null)}>
              <Text className="text-red-700 font-bold ml-2">✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Form  */}
        <View className="space-y-4">
          <View className='mt-3'>
            <TextInput
              className="bg-white p-4 rounded-lg text-lg border text-[#5E936C] border-[#93DA97]"
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter email"
              onChangeText={setEmailAddress}
              keyboardType="email-address"
            />
          </View>

          <View className='mt-6'>
            <TextInput
              className="bg-white p-4 rounded-lg border text-lg text-[#5E936C] border-[#93DA97]"
              value={password}
              placeholder="Enter password"
              secureTextEntry={true}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity 
            className="bg-[#5E936C] p-4 rounded-lg items-center mt-8"
            onPress={onSignInPress}
            disabled={isLoading}
          >
            <Text className="text-white text-lg">
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center pt-4">
            <Text className="text-[#3E5F44] text-lg">Don&apos;t have an account? </Text>
            <Link href="/sign-up" className="text-[#3E5F44] font-medium text-lg">
              Sign Up
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}