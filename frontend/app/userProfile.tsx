import { useEffect, useLayoutEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const AVATAR_MAP: { [key: string]: any } = {
    'avatar1': require('../assets/images/avatar1.png'),
    'avatar2': require('../assets/images/avatar2.png'),
    'avatar3': require('../assets/images/avatar3.png'),
};

const getAvatarImage = (avatarString: any): any => {
    if (!avatarString || typeof avatarString !== 'string') {
        return AVATAR_MAP['avatar1']; 
    }

    
    const filename = avatarString.split('/').pop(); 
    const avatarKey = filename?.replace('.png', ''); 

    return AVATAR_MAP[avatarKey!] || AVATAR_MAP['avatar1'];
};

interface UserProfile {
    id: number;
    username: string;
    email: string;
    nrFocusSessions: number;
    totalFocusTime: number;
    nrFocusSessionsToday: number;
    focusTimeToday: string;
    avatar: any;
}

export default function UserProfileScreen() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<any>();

    useEffect(() => {
        fetchUserProfile();
    }, []);


    
    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false, title: '' });
    }, [navigation]);


    const fetchUserProfile = async () => {
        try {
            setLoading(true);

            const userData = await AsyncStorage.getItem('userData');

            if (userData) {
                const parsedUser = JSON.parse(userData);
                console.log('Loaded user profile:', parsedUser);
                setProfile(parsedUser);
            } else {
                console.log('No user data found in storage');
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setLoading(false);
        }
    };

    const formatTotalTime = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userData');
            console.log('User logged out');
            router.replace('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    if (loading) {
        return (
            <ImageBackground
                source={require('../assets/images/background.png')}
                style={styles.background}
            >
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            </ImageBackground>
        );
    }

    if (!profile) {
        return (
            <ImageBackground
                source={require('../assets/images/background.png')}
                style={styles.background}
            >
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Unable to load profile</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={fetchUserProfile}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }

    return (
        <ImageBackground
            source={require('../assets/images/background.png')}
            style={styles.background}
        >
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>

                <View style={styles.header}>
                    <Image
                        source={getAvatarImage(profile.avatar)}
                        style={styles.avatarLarge}
                    />
                    <Text style={styles.username}>{profile.username}</Text>
                    <Text style={styles.email}>{profile.email}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Today's Progress</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{profile.nrFocusSessionsToday}</Text>
                            <Text style={styles.statLabel}>Sessions</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{profile.focusTimeToday}</Text>
                            <Text style={styles.statLabel}>Focus Time</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>All-Time Stats</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{profile.nrFocusSessions}</Text>
                            <Text style={styles.statLabel}>Total Sessions</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>
                                {formatTotalTime(profile.totalFocusTime)}
                            </Text>
                            <Text style={styles.statLabel}>Total Time</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Achievements</Text>
                    <View style={styles.achievementsContainer}>
                        {profile.nrFocusSessions >= 10 && (
                            <View style={styles.achievement}>
                                <Text style={styles.achievementIcon}>🏆</Text>
                                <Text style={styles.achievementText}>10 Sessions</Text>
                            </View>
                        )}
                        {profile.nrFocusSessions >= 25 && (
                            <View style={styles.achievement}>
                                <Text style={styles.achievementIcon}>⭐</Text>
                                <Text style={styles.achievementText}>25 Sessions</Text>
                            </View>
                        )}
                        {profile.nrFocusSessions >= 50 && (
                            <View style={styles.achievement}>
                                <Text style={styles.achievementIcon}>💎</Text>
                                <Text style={styles.achievementText}>50 Sessions</Text>
                            </View>
                        )}
                        {profile.totalFocusTime >= 600 && (
                            <View style={styles.achievement}>
                                <Text style={styles.achievementIcon}>⏰</Text>
                                <Text style={styles.achievementText}>10+ Hours</Text>
                            </View>
                        )}
                    </View>
                </View>

                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                    <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                        Settings
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.logoutButton]}
                    onPress={handleLogout}
                >
                    <Text style={styles.actionButtonText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 60,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        paddingHorizontal: 30,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    backButtonText: {
        fontSize: 24,
        color: '#007AFF',
        fontWeight: 'bold',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarLarge: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
        borderWidth: 4,
        borderColor: 'rgba(255, 255, 255, 0.9)',
    },
    username: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: '#666',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    divider: {
        width: 1,
        height: 50,
        backgroundColor: '#E0E0E0',
    },
    achievementsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
    },
    achievement: {
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        padding: 15,
        minWidth: 80,
    },
    achievementIcon: {
        fontSize: 32,
        marginBottom: 5,
    },
    achievementText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
    },
    actionButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    actionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderWidth: 2,
        borderColor: '#007AFF',
    },
    secondaryButtonText: {
        color: '#007AFF',
    },
    logoutButton: {
        backgroundColor: '#FF3B30',
        marginTop: 20,
    },
});
