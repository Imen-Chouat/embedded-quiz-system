import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../Navigation'; // Import UserContext

const SignInScreen = ({ navigation }) => {
    const { setUser } = useContext(UserContext); // Access setUser from context
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter email and password");
            return;
        }
    
        try {
            const response = await axios.post('http://10.42.0.1:7000/api/students/login', {
                email,
                password,
            });
    
            console.log("Response Data:", response.data); // Log the entire response
    
            const { token } = response.data;
    
            if (token) {
                await AsyncStorage.setItem('userToken', token);
                await AsyncStorage.setItem('studentData', JSON.stringify(response.data));  // Save the student data as well
    
                console.log("Token Saved Successfully:", token);
    
                // Set user context (optional: set basic email for now if no student object)
                setUser({ email });
    
                console.log("Navigating to Home...");
                navigation.replace('Home');
            } else {
                Alert.alert("Sign In Failed", "Invalid server response: No token received");
            }
        } catch (err) {
            console.log("Sign In Error:", err);
    
            if (err?.response?.data) {
                console.log("Error Response:", err.response.data);
                Alert.alert("Sign In Failed", `Backend Error: ${err.response.data.message || 'Unknown error'}`);
            } else {
                Alert.alert("Sign In Failed", "Server error or no response from the backend");
            }
        }
    };
    
    
    
    
    
    
    
    

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('WelcomeScreen')}>
                <Image source={require('../assets/arrow.png')} style={styles.backIcon} />
            </TouchableOpacity>

            <Text style={styles.logoText}>κουί<Text style={styles.highlight}>ζ</Text>u</Text>

            <View style={styles.formContainer}>
                <Text style={styles.title}>SIGN IN</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Email" 
                        placeholderTextColor="gray" 
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Password"
                            placeholderTextColor="gray"
                            secureTextEntry={!passwordVisible}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                            <Image 
                                source={passwordVisible ? require('../assets/eye.png') : require('../assets/hidden.png')} 
                                style={styles.passwordIcon} 
                            />                         
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotText}>Forgotten your password?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.signinButton} onPress={handleSignIn}>
                    <Text style={styles.signinText}>Sign In</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.signupNavigation} onPress={() => navigation.navigate('SignUpScreen')}>
                <Text style={styles.signupText}>Don't have an account?</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingTop: 50,
        bottom: -30,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
    },
    logoText: {
        fontSize: 65,
        fontWeight: 'bold',
        color: '#184F78',
        marginTop: 30,
    },
    highlight: {
        color: '#FEDC62',
    },
    formContainer: {
        width: '100%',
        backgroundColor: '#184F78',
        borderRadius: 50,
        padding: 30,
        alignItems: 'center',
        height: '100%',
        marginTop: 50,
    },
    title: {
        fontSize: 22,
        color: '#FFF',
        fontWeight: 'bold',
        marginBottom: 40,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 50,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 10,
        fontSize: 16,
        color: 'black',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 10,
        justifyContent: 'space-between',
    },
    passwordInput: {
        flex: 1,
        fontSize: 16,
        color: 'black',
    },
    forgotPassword: {
        alignSelf: 'flex-start',
        marginTop: -30,
    },
    forgotText: {
        color: '#FFF',
        fontSize: 14,
    },
    signinButton: {
        backgroundColor: '#FEDC62',
        width: '80%',
        padding: 12,
        borderRadius: 50,
        alignItems: 'center',
        marginTop: 50,
    },
    signinText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#184F78',
    },
    signupNavigation: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        width: '80%',
        padding: 12,
        borderRadius: 50,
        alignItems: 'center',
        position: 'absolute',
        bottom: 100,
    },
    signupText: {
        color: '#FFF',
        fontSize: 16,
    },
    backIcon: {
        width: 24,
        height: 24,
        tintColor: '#184F78', 
    },
    passwordIcon: {
        width: 22,
        height: 22,
        tintColor: 'gray',
    },
});

export default SignInScreen;
