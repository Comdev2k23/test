import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { LogOut } from 'lucide-react-native'
import { Alert, Text, TouchableOpacity } from 'react-native'

export const SignOutButton = () => {
  const { signOut } = useClerk()
  const handleSignOut = async () => {
   Alert.alert(
    'Confirm Logout',
    'Are you sure do you want to logout?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
         try {
          await signOut()
          Linking.openURL(Linking.createURL('/'))
        } catch (err) {
          console.error(JSON.stringify(err, null, 2))
        }
        }
      }
    ]
   )
  }
  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Text>
        <LogOut />
      </Text>
    </TouchableOpacity>
  )
}