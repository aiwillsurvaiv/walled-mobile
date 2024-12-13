import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import Button from '../components/Button';
import InputNotes from '../components/InputNotes';
import { Link } from 'expo-router';

export default function App() {
  return (
    <View style={styles.container}>
      {/* <Text>Test aja</Text> */}
      <Image source={require('../assets/walledLogo.png')} style={styles.logo} />

      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa" keyboardType="email-address" />

      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#aaa" secureTextEntry={true} />

      <InputNotes text="Notes" />
      <Link href="/home">Ke home</Link>
      <Button text="Login" />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // textAlign: 'left',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
});
