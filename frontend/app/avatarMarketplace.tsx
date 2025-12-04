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
    ActivityIndicator,
    Alert
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface Avatar {
    id: string;
    name: string;
    image: any;
    requiredHours: number;
    unlocked: boolean;
}

interface UserProfile {
    id: number;
    username: string;
    email: string;
    totalFocusTime: number;
    avatar: string;
}

const AVATARS: Avatar[] = [
    {
        id: 'avatar1',
        name: 'Classic Avatar',
        image: require('../assets/images/avatar1.png'),
        requiredHours: 0,
        unlocked: true
    },
    {
        id: 'avatar2',
        name: 'Cone Avatar',
        image: require('../assets/images/avatar2.png'),
        requiredHours: 5,
        unlocked: false
    },
    {
        id: 'avatar3',
        name: 'Mushroom Avatar',
        image: require('../assets/images/avatar3.png'),
        requiredHours: 10,
        unlocked: false
    }
];

export default function AvatarMarketplace() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [avatars, setAvatars] = useState<Avatar[]>(AVATARS);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<any>();

    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false, title: '' });
    }, [navigation]);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const userData = await AsyncStorage.getItem('userData');
            
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setProfile(parsedUser);
                updateAvatarUnlockStatus(parsedUser.totalFocusTime);
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setLoading(false);
        }
    };

    const updateAvatarUnlockStatus = (totalMinutes: number) => {
        const totalHours = totalMinutes / 60;
        
        const updatedAvatars = AVATARS.map(avatar => ({
            ...avatar,
            unlocked: totalHours >= avatar.requiredHours
        }));
        
        setAvatars(updatedAvatars);
    };

    const handleUnlockAvatar = async (avatarId: string) => {
        if (!profile) return;

        try {
            // Update user's avatar
            const updatedProfile = {
                ...profile,
                avatar: `${avatarId}.png`
            };

            await AsyncStorage.setItem('userData', JSON.stringify(updatedProfile));
            setProfile(updatedProfile);

            Alert.alert(
                'Avatar Updated!',
                'Your avatar has been successfully changed.',
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('Error updating avatar:', error);
            Alert.alert('Error', 'Failed to update avatar. Please try again.');
        }
    };

    const formatHours = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        return `${hours}h`;
    };

    const getProgressPercentage = (requiredHours: number, currentMinutes: number): number => {
        const currentHours = currentMinutes / 60;
        return Math.min((currentHours / requiredHours) * 100, 100);
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
                    <Text style={styles.title}>Avatar Marketplace</Text>
                    <Text style={styles.subtitle}>
                        Total Focus Time: {profile ? formatHours(profile.totalFocusTime) : '0h'}
                    </Text>
                </View>

                {avatars.map((avatar) => (
                    <View key={avatar.id} style={styles.avatarCard}>
                        <Image source={avatar.image} style={styles.avatarImage} />
                        
                        <View style={styles.avatarInfo}>
                            <Text style={styles.avatarName}>{avatar.name}</Text>
                            
                            {avatar.requiredHours === 0 ? (
                                <Text style={styles.defaultText}>Default Avatar</Text>
                            ) : (
                                <View style={styles.progressContainer}>
                                    <Text style={styles.requirementText}>
                                        Required: {avatar.requiredHours}h focus time
                                    </Text>
                                    
                                    <View style={styles.progressBarContainer}>
                                        <View style={styles.progressBarBackground}>
                                            <View
                                                style={[
                                                    styles.progressBarFill,
                                                    {
                                                        width: `${getProgressPercentage(
                                                            avatar.requiredHours,
                                                            profile?.totalFocusTime || 0
                                                        )}%`
                                                    }
                                                ]}
                                            />
                                        </View>
                                        <Text style={styles.progressText}>
                                            {Math.floor(getProgressPercentage(
                                                avatar.requiredHours,
                                                profile?.totalFocusTime || 0
                                            ))}%
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.unlockButton,
                                !avatar.unlocked && styles.disabledButton,
                                profile?.avatar === `${avatar.id}.png` && styles.selectedButton
                            ]}
                            onPress={() => handleUnlockAvatar(avatar.id)}
                            disabled={!avatar.unlocked}
                        >
                            <Text
                                style={[
                                    styles.unlockButtonText,
                                    !avatar.unlocked && styles.disabledButtonText,
                                    profile?.avatar === `${avatar.id}.png` && styles.selectedButtonText
                                ]}
                            >
                                {profile?.avatar === `${avatar.id}.png` 
                                    ? 'Selected' 
                                    : avatar.unlocked 
                                        ? 'Select' 
                                        : 'Locked'
                                }
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    avatarCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15,
    },
    avatarInfo: {
        flex: 1,
        marginRight: 15,
    },
    avatarName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    defaultText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
    },
    progressContainer: {
        marginTop: 5,
    },
    requirementText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    progressBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBarBackground: {
        flex: 1,
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        marginRight: 10,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#007AFF',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
        minWidth: 35,
    },
    unlockButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    unlockButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    disabledButton: {
        backgroundColor: '#CCCCCC',
    },
    disabledButtonText: {
        color: '#666',
    },
    selectedButton: {
        backgroundColor: '#34C759',
    },
    selectedButtonText: {
        color: 'white',
    },
});