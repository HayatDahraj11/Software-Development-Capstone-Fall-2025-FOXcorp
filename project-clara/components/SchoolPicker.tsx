import { Modal, View, Text, Pressable, StyleSheet, FlatList, TextInput, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { useEffect, useState } from "react";

// --- AWS Imports ---
import { generateClient } from 'aws-amplify/api';
import { listSchools } from '@/src/graphql/queries';
import awsconfig from "@/src/aws-exports"; // Import config for debugging
// -------------------

const client = generateClient();

type Props = {
    isVisible: boolean;
    onCloseModal: () => void;
    onSelect: (school: string) => void;
};

// Define the shape of a School object
type SchoolItem = {
    id: string;
    name: string;
    address?: string | null;
};

export default function SchoolPicker({isVisible, onCloseModal, onSelect}: Props) {
    const [search, setSearch] = useState<string>('');
    
    // Store the real list from the database
    const [fullList, setFullList] = useState<SchoolItem[]>([]);
    // Store the list currently being shown (filtered)
    const [filteredList, setFilteredList] = useState<SchoolItem[]>([]);
    
    const [loading, setLoading] = useState(true);

    // --- Fetch Data from AWS ---
    useEffect(() => {
        fetchSchools();
    }, []);

    async function fetchSchools() {
        console.log("🚀 ATTEMPTING TO FETCH SCHOOLS...");
        try {
            // Debug: Check if the client is configured with the right API Key
            console.log("🔑 Config API Key:", awsconfig.aws_appsync_apiKey ? "EXISTS" : "MISSING"); 
            console.log("🌐 Config Endpoint:", awsconfig.aws_appsync_graphqlEndpoint); 

            const schoolData = await client.graphql({ query: listSchools });
            
            // LOG THE EXACT DATA WE GOT BACK
            console.log("📦 Raw AWS Response:", JSON.stringify(schoolData, null, 2));
            
            const schools = schoolData.data.listSchools.items;
            console.log(`🏫 Number of schools found: ${schools.length}`);
            
            // Sort alphabetically for better UX
            schools.sort((a: any, b: any) => a.name.localeCompare(b.name));

            setFullList(schools);
            setFilteredList(schools);
            setLoading(false);
        } catch (err) {
            // LOG THE ERROR
            console.error("❌ FATAL ERROR fetching schools:", err);
            console.error("Error Details:", JSON.stringify(err, null, 2));
            setLoading(false);
        }
    }
    // ---------------------------

    // Handle Search Filtering
    useEffect(() => {
        if(search === '') {
            setFilteredList(fullList);
        } else {
            const lowerCaseSearch = search.toLowerCase();
            const newFilteredData = fullList.filter(item => 
                item.name.toLowerCase().includes(lowerCaseSearch)
            );
            setFilteredList(newFilteredData);
        }
    }, [search, fullList]);

    return (
        <View>
            <Modal animationType="slide" transparent={true} visible={isVisible}>
                <View style={styles.overlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText}>Select Your School</Text>
                            <Pressable onPress={onCloseModal}>
                                <Ionicons name={"close-circle-outline"} color={Colors.light.icon} size={22} />
                            </Pressable>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={search}
                                onChangeText={setSearch}
                                placeholder="Enter School Name..."
                                autoCapitalize="none"
                                spellCheck={false}
                            />
                        </View>
                        <View style={styles.listContainer}>
                            {loading ? (
                                <ActivityIndicator size="large" color={Colors.light.tint} style={{ marginTop: 20 }} />
                            ) : (
                                <FlatList
                                    data={filteredList}
                                    keyExtractor={(item) => item.id} // Use the real ID as key
                                    renderItem={({item}) => (
                                        <Pressable
                                            style={styles.listItem}
                                            onPress={() => {
                                                onSelect(item.name); // Pass the school name back
                                                onCloseModal();
                                        }}>
                                            <Text style={styles.listText}>{item.name}</Text>    
                                        </Pressable>
                                    )}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create ({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        height: '90%',
        width: '100%',
        position: 'absolute',
        bottom: 0, 
        backgroundColor: '#F7F8FA',
    },
    titleContainer: {
        height: '7%',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1D2939',
        textAlign: 'center',
    },
    listContainer: {
        paddingHorizontal: 20,
        justifyContent: 'center',
        marginTop: 10,
        flex: 1, // Ensure list takes available space
    },
    listItem: {
        paddingBottom: 10,
    },
    listText: {
        fontSize: 16,
        padding: 12, // Increased padding for easier tapping
        borderWidth: 1,
        borderRadius: 3,
        borderColor: 'rgba(29, 41, 57, 0.25)', 
        backgroundColor: '#fff', 
        color: '#1D2939',
        textAlign: 'left',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 56,
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E4E7EB',
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#1D2939',
    },
});