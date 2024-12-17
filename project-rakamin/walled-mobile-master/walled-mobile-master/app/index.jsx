import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TextInput, Image, Text } from 'react-native';
import Button from '../components/Button';
import { Link, router } from 'expo-router';
import { z } from 'zod';
import { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(4, { message: 'Must be 4 or more characters long' }),
});

let storeData = '';
export default function App() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errorMsg, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleInputChange = (key, value) => {
    setForm({ ...form, [key]: value });
    try {
      LoginSchema.pick({ [key]: true }).parse({ [key]: value });
      setErrors((prev) => ({ ...prev, [key]: '' }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [key]: err.errors[0].message }));
    }
  };

  const handleSubmit = async () => {
    try {
      LoginSchema.parse(form);
      console.log(form);
      const res = await axios.post('http://192.168.30.49:8080/auth/login', { users_email: form.email, users_password: form.password });
      await AsyncStorage.setItem('token', res.data.data.token);
      console.log(res.data.data, 'ini budi');
      router.replace('/(home)');
      // navigation.navigate("/(home)")
    } catch (err) {
      // console.log(err, "error");
      // if (err?.response) {
      //   setServerError(err.response.data.message)
      //   return
      // }
      // const errors = {};
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setServerError(err.response.data.message || 'An error occurred');
        } else if (err.request) {
          setServerError('Network error. Please try again later.');
          console.error('Network Error:', err.request);
        } else {
          setServerError('An unexpected error occurred.');
          console.error('Request Setup Error:', err.message);
        }
      } else if (err?.errors) {
        const errors = {};
        err.errors.forEach((item) => {
          const key = item.path[0];
          errors[key] = item.message;
        });
        setErrors(errors);
      } else {
        setServerError('An unknown error occurred.');
        console.error('Unhandled Error:', err);
      }
    }
  };
  // err.errors.forEach((item) => {
  //   const key = item.path[0];
  //   errors[key] = item.message;
  // });
  // setErrors(errors);

  return (
    <View style={styles.container}>
      {serverError && <Text>{serverError}</Text>}
      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="stretch" />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa" keyboardType="email-address" onChangeText={(text) => handleInputChange('email', text)} value={form.email} />
      {errorMsg.email ? <Text style={styles.errorMsg}>{errorMsg.email}</Text> : null}

      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#aaa" secureTextEntry={true} onChangeText={(text) => handleInputChange('password', text)} value={form.password} />
      {errorMsg.password ? <Text style={styles.errorMsg}>{errorMsg.password}</Text> : null}

      <Link href="/(home)" style={styles.linkText}>
        Masuk
      </Link>
      <Button handlePress={handleSubmit} text="Login" />
      <Text style={styles.link}>
        Don't have an account?{' '}
        <Link href="/register" style={styles.linkText}>
          Register here
        </Link>
      </Text>
      <StatusBar style="auto" hidden />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 233,
    height: 57,
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 15,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  link: {
    marginTop: 10,
    textAlign: 'left',
    width: '100%',
  },
  linkText: {
    color: '#19918F',
  },
  errorMsg: {
    color: 'red',
    fontSize: 12,
    width: '100%',
    textAlign: 'left',
    marginTop: 5,
  },
});
