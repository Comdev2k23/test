import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import * as React from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleError = (err: unknown) => {
    if (isClerkAPIResponseError(err)) {
      switch (err.errors[0]?.code) {
        case 'form_password_incorrect':
          setError('Password is incorrect. Please try again.');
          break;
        case 'form_identifier_exists':
          setError('Email already in use. Try signing in instead.');
          break;
        default:
          setError(err.errors[0]?.longMessage || 'An error occurred. Please try again.');
      }
    } else {
      setError('An unexpected error occurred');
    }
  };

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setIsLoading(true);
    setError(null);

    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <View className='bg-[#E8FFD7] flex-1 justify-center items-center p-6'>
        <Text className='text-4xl font-medium text-[#3E5F44] mb-2'>Verify your email</Text>
        <Text className='text-[#5E936C] text-lg mb-6'>We&apos;ve sent a code to {emailAddress}</Text>

        {error && (
          <View className="bg-red-100 p-3 rounded-lg mb-4 flex-row items-center">
            <Text className="text-red-700 flex-1">{error}</Text>
            <TouchableOpacity onPress={() => setError(null)}>
              <Text className="text-red-700 font-bold ml-2">✕</Text>
            </TouchableOpacity>
          </View>
        )}

        <TextInput
          className="bg-white p-4 rounded-lg text-lg text-[#5E936C] border border-[#93DA97] w-full"
          value={code}
          placeholder="Enter 6-digit code"
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
        />

        <TouchableOpacity 
          onPress={async () => {
            if (!isLoaded) return;
            setIsLoading(true);
            try {
              const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });
              if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId });
                router.replace('/');
              }
            } catch (err) {
              handleError(err);
            } finally {
              setIsLoading(false);
            }
          }}
          className='mt-6 bg-[#5E936C] p-4 rounded-lg w-full items-center'
          disabled={isLoading || code.length < 6}
        >
          <Text className='text-white text-lg'>
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
   <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={30}
   >

       <View className='flex-1 bg-[#E8FFD7]  justify-center p-6'>

        <View className='items-center mb-8'>
          <Image 
            source={require('@/assets/images/signup.png')}
            className="w-52 h-52 mb-4"
          />
          <Text className='text-4xl font-bold text-[#3E5F44]'>Create Account</Text>
          <Text className='text-[#5E936C] text-lg mt-1'>Sign up to continue</Text>
        </View>

        {/* Form */}
        <View className='space-y-4'>
          <View className='mt-3'>
            <TextInput 
            className='bg-white p-4 rounded-lg text-lg text-[#5E936C] border border-[#93DA97]'
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            onChangeText={(email) => setEmailAddress(email)}
            keyboardType="email-address"
          />
        </View>

        <View className='mt-6'>
          <TextInput
          className='bg-white p-4 rounded-lg text-lg text-[#5E936C] border border-[#93DA97]'
          value={password}
          placeholder="Enter password at least 6 char above"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        </View>

        <TouchableOpacity onPress={onSignUpPress}
        className='bg-[#5E936C] p-4 rounded-lg items-center mt-8'
        >
          <Text className='text-white text-lg'>Continue</Text>
        </TouchableOpacity>
        </View>

        <View className='flex-row gap-3 justify-center pt-4'>
          <Text className='text-[#3E5F44] text-lg'>Already have an account?</Text>
          <Link href="/sign-in">
            <Text className='text-[#3E5F44] text-lg font-medium'>Sign in</Text>
          </Link>
        </View>
      
    </View>
   </KeyboardAwareScrollView>
  )
}