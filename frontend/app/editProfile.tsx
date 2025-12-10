import { Text, View, StyleSheet, Alert, TextInput, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Needed for user ID

// NOTE: Use the correct, reachable URL for your Spring Boot Backend
const API_URL = 'http://localhost:8081';

export default function EditProfileScreen() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

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

        setLoading(true);
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

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Your password has been changed.');

                // Clear form fields
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');

                // Navigate back to the profile screen
                router.back();
            } else if (response.status === 401) {
                // Specific error for incorrect old password
                Alert.alert('Error', data.message || 'Incorrect old password.');
            } else {
                // General error handler
                Alert.alert('Error', data.message || 'Failed to change password due to a server error.');
            }
        } catch (error) {
            console.error('Password change error:', error);
            Alert.alert('Connection Error', 'Could not reach the server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Change Password</Text>

            <TextInput
                style={styles.input}
                placeholder="Old Password"
                secureTextEntry
                value={oldPassword}
                onChangeText={setOldPassword}
                editable={!loading}
            />

            <TextInput
                style={styles.input}
                placeholder="New Password (min 8 chars)"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                editable={!loading}
            />

            <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
            />

            <TouchableOpacity
                style={[styles.button, loading && styles.disabledButton]}
                onPress={handleChangePassword}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Change Password</Text>
                )}
            </TouchableOpacity>

            <Link href="/userProfile" style={styles.backLink}>
                Go back to Profile
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
    },
    input: {
        width: '100%',
        maxWidth: 400,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        backgroundColor: '#007AFF',
        width: '100%',
        maxWidth: 400,
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
    }
});