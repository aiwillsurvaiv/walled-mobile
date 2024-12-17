import { Text, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [user, setUser] = useState({});
  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('token');
        console.log(value);
        if (value !== null) {
          const res = await axios.get('http://192.168.30.49:8080/profile', {
            headers: {
              Authorization: `Bearer ${value}`,
            },
          });
          const user = res.data;
          // console.log(user.data, "Aiko")
          setUser(user.data);
        }
      } catch (e) {
        console.log(e.response);
      }
    };
    getData();
  }, []);
  console.log(user, "userrrrr");
  return (
    <View style={styles.container}>
      {user.users_email && <Text>{user.users_email}</Text>}
      <Text>Home Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 50,
    height: 50,
  },
});