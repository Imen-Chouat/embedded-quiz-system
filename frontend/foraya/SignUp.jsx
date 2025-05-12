import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';

const SignUp = ({ navigation }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSignUp = async () => {
        // Basic validation
        if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (!formData.email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        if (formData.password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await fetch('http://10.42.0.1:7000/api/students/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            const responseData = contentType?.includes('application/json') 
                ? await response.json() 
                : await response.text();

            if (!response.ok) {
                throw new Error(
                    typeof responseData === 'object' 
                        ? responseData.message || 'Registration failed'
                        : 'Server error occurred'
                );
            }

            Alert.alert('Success', 'Registration successful!');
            navigation.navigate('SignInScreen');
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert('Error', error.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.navigate('WelcomeScreen')}
                disabled={isLoading}
            >
                <Image source={require('../assets/arrow.png')} style={styles.backIcon} />
            </TouchableOpacity>

            <Text style={styles.logoText}>κουί<Text style={styles.highlight}>ζ</Text>u</Text>

            <View style={styles.formContainer}>
                <Text style={styles.title}>SIGN UP</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your first name"
                        placeholderTextColor="gray"
                        value={formData.first_name}
                        onChangeText={(text) => handleChange('first_name', text)}
                        editable={!isLoading}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your last name"
                        placeholderTextColor="gray"
                        value={formData.last_name}
                        onChangeText={(text) => handleChange('last_name', text)}
                        editable={!isLoading}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor="gray"
                        value={formData.email}
                        onChangeText={(text) => handleChange('email', text)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!isLoading}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Enter your password"
                            placeholderTextColor="gray"
                            secureTextEntry={!passwordVisible}
                            value={formData.password}
                            onChangeText={(text) => handleChange('password', text)}
                            autoCapitalize="none"
                            editable={!isLoading}
                        />
                        <TouchableOpacity 
                            onPress={() => setPasswordVisible(!passwordVisible)}
                            disabled={isLoading}
                        >
                            <Image 
                                source={passwordVisible ? require('../assets/eye.png') : require('../assets/hidden.png')} 
                                style={styles.passwordIcon} 
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity 
                    style={[styles.signupButton, isLoading && styles.disabledButton]} 
                    onPress={handleSignUp}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#184F78" />
                    ) : (
                        <Text style={styles.signupText}>Sign Up</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.alreadyAccount} 
                    onPress={() => navigation.navigate('SignInScreen')}
                    disabled={isLoading}
                >
                    <Text style={styles.alreadyText}>Already have an account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingTop: 50,
        bottom: -30
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
        fontSize: 24,
        color: '#FFF',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 5,
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
    signupButton: {
        backgroundColor: '#FEDC62',
        width: '80%',
        padding: 12,
        borderRadius: 50,
        marginVertical: 10,
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.7,
    },
    signupText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#184F78',
    },
    alreadyAccount: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        width: '80%',
        padding: 12,
        borderRadius: 50,
        alignItems: 'center',
    },
    alreadyText: {
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

export default SignUp;