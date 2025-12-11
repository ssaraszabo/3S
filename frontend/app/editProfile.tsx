import { Text, View, StyleSheet, Alert, TextInput, Button, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

const API_URL = 'http://localhost:8081';

export default function EditProfileScreen() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    const [newUsername, setNewUsername] = useState('');
    const [usernamePassword, setUsernamePassword] = useState('');
    const [usernameLoading, setUsernameLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill all fields.');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match.');
            return;
        }
        if (newPassword.length < 8) {
            Alert.alert('Error', 'New password must be at least 8 characters.');
            return;
        }

        setPasswordLoading(true);
        try {
            const userDataString = await AsyncStorage.getItem('userData');
            const userData = userDataString ? JSON.parse(userDataString) : null;
            const userId = userData?.id;

            if (!userId) {
                Alert.alert('Error', 'User not logged in. Please log in again.');
                router.replace('/login');
                return;
            }

            const response = await fetch(`${API_URL}/api/users/change-password/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            let data;
            try { data = await response.json(); } catch (e) { }

            if (response.ok) {
                Alert.alert('Success', 'Your password has been changed.');

                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');

                router.back();
            } else if (response.status === 401) {
                Alert.alert('Error', (data && data.message) || 'Incorrect old password.');
            } else {
                Alert.alert('Error', (data && data.message) || 'Failed to change password due to a server error.');
            }
        } catch (error) {
            console.error('Password change error:', error);
            Alert.alert('Connection Error', 'Could not reach the server.');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleChangeUsername = async () => {
        if (!newUsername || !usernamePassword) {
            Alert.alert('Error', 'Please fill both username fields.');
            return;
        }
        if (newUsername.length < 3) {
            Alert.alert('Error', 'Username must be at least 3 characters.');
            return;
        }

        setUsernameLoading(true);
        try {
            const userDataString = await AsyncStorage.getItem('userData');
            const userData = userDataString ? JSON.parse(userDataString) : null;
            const userId = userData?.id;

            if (!userId) {
                Alert.alert('Error', 'User not logged in. Please log in again.');
                router.replace('/login');
                return;
            }

            const response = await fetch(`${API_URL}/api/users/change-username/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newUsername, password: usernamePassword }),
            });

            let data;
            try { data = await response.json(); } catch (e) { }

            if (response.ok) {
                const updatedUserData = { ...userData, username: data.newUsername };
                await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));

                Alert.alert('Success', `Username successfully changed to ${data.newUsername}.`);

                setNewUsername('');
                setUsernamePassword('');

                router.back();
            } else if (response.status === 400) {
                Alert.alert('Error', (data && data.message) || 'Username already taken or invalid input.');
            } else if (response.status === 401) {
                Alert.alert('Error', (data && data.message) || 'Incorrect password for verification.');
            } else {
                Alert.alert('Error', (data && data.message) || 'Failed to change username due to a server error.');
            }
        } catch (error) {
            Alert.alert('Connection Error', 'Could not reach the server.');
        } finally {
            setUsernameLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <FontAwesome name="arrow-left" size={24} color="#007AFF" />
            </TouchableOpacity>

            <View style={styles.formContainer}>
                <Text style={styles.title}>Change Password</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Old Password"
                    secureTextEntry
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    editable={!passwordLoading && !usernameLoading}
                />

                <TextInput
                    style={styles.input}
                    placeholder="New Password (min 8 chars)"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                    editable={!passwordLoading && !usernameLoading}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Confirm New Password"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    editable={!passwordLoading && !usernameLoading}
                />

                <TouchableOpacity
                    style={[styles.button, passwordLoading && styles.disabledButton]}
                    onPress={handleChangePassword}
                    disabled={passwordLoading || usernameLoading}
                >
                    {passwordLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Change Password</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.title}>Change Username</Text>

                <TextInput
                    style={styles.input}
                    placeholder="New Username (min 3 chars)"
                    value={newUsername}
                    onChangeText={setNewUsername}
                    editable={!passwordLoading && !usernameLoading}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Your Current Password (to confirm)"
                    secureTextEntry
                    value={usernamePassword}
                    onChangeText={setUsernamePassword}
                    editable={!passwordLoading && !usernameLoading}
                />

                <TouchableOpacity
                    style={[styles.button, usernameLoading && styles.disabledButton]}
                    onPress={handleChangeUsername}
                    disabled={passwordLoading || usernameLoading}
                >
                    {usernameLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Change Username</Text>
                    )}
                </TouchableOpacity>
            </View>

            <Link href="/userProfile" style={styles.backLink}>
                Go back to Profile
            </Link>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
        padding: 10,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#eee',
    },
    button: {
        backgroundColor: '#007AFF',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    disabledButton: {
        backgroundColor: '#cccccc',
        opacity: 0.7,
    },
    backLink: {
        marginTop: 20,
        color: '#007AFF',
        fontSize: 16,
        marginBottom: 40,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
});