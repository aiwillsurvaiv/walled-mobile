import Checkbox from 'expo-checkbox';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TextInput, Image, Text, Modal, Pressable, ScrollView } from 'react-native';
import Button from '../components/Button';
import { Link, router, Stack } from 'expo-router';
import { z } from 'zod';

const RegisterSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(4, { message: 'Must be 4 or more characters long' }),
  // name: z.string().unique({ message: 'Account already exist' }),
});

export default function Register() {
  const [isChecked, setChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [errorMsg, setErrors] = useState({});
  const termsandconditions = `test`;
  const handleInputChange = (key, value) => {
    setForm({ ...form, [key]: value });
    try {
      RegisterSchema.pick({ [key]: true }).parse({ [key]: value });
      setErrors((prev) => ({ ...prev, [key]: '' }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [key]: err.errors[0].message }));
    }
  };

  const handleSubmit = async () => {
    try {
      RegisterSchema.parse(form);
      console.log(form);
      await axios.post('http://192.168.30.49:8080/auth/register', form);
      router.replace('/');
    } catch (err) {
      const errors = {};
      err.errors.forEach((item) => {
        const key = item.path[0];
        errors[key] = item.message;
      });
      setErrors(errors);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="stretch" />
      <TextInput style={styles.input} placeholder="Fullname" placeholderTextColor="#aaa" keyboardType="ascii-capable" onChangeText={(text) => handleInputChange('fullname', text)} value={form.name} />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa" keyboardType="email-address" onChangeText={(text) => handleInputChange('name', text)} value={form.email} />
      {errorMsg.email ? <Text style={styles.errorMsg}>{errorMsg.email}</Text> : null}
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#aaa" secureTextEntry={true} keyboardType="password" onChangeText={(text) => handleInputChange('password', text)} value={form.password} />
      {errorMsg.password ? <Text style={styles.errorMsg}>{errorMsg.password}</Text> : null}
      {/* <TextInput style={styles.input} placeholder="Avatar Url" placeholderTextColor="#aaa" onChangeText={(text) => handleInputChange('name', text)} value={form.name}  /> */}

      <View style={styles.tnc}>
        <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} color={isChecked ? '#4630EB' : undefined} />
        <Text style={styles.tncText}>I have read and agreee to the </Text>
        <Link href="/tnc">
          <Text style={styles.tncLink}>Terms and Conditions</Text>
        </Link>
      </View>
      <Button text="Register" />
      <Text style={styles.link}>
        Have an account?{' '}
        <Link href="/" style={styles.linkText}>
          Login here
        </Link>
      </Text>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <ScrollView>
          <View style={styles.modalView}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 20 }}>Terms and Conditions</Text>
            <Text style={styles.modalText}>{termsandconditions}</Text>
            <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </ScrollView>
      </Modal>
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
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4DB6AC',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 10,
    textAlign: 'left',
    width: '100%',
  },
  linkText: {
    color: '#19918F',
    paddingTop: 0,
    marginTop: 0,
  },
  tnc: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flext-start',
    flexWrap: 'nowrap',
    textAlign: 'left',
    paddingTop: 10,
    paddingBottom: 10,
  },
  tncText: {
    marginLeft: 10,
    fontSize: 12,
  },
  tncLink: {
    color: '#19918F',
    fontSize: 12,
  },
});
