import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import MantraCard from '../../components/mantra/MantraCard';
import { colors } from '../../constants/Colors';
import { mantraAPI } from '../../services/api';

const categories = [
  { id: 'all', name: 'All', display: 'All' },
  { id: 'peace', name: 'Peace', display: 'Peace' },
  { id: 'health', name: 'Health', display: 'Health' },
  { id: 'prosperity', name: 'Prosperity', display: 'Prosperity' },
  { id: 'knowledge', name: 'Knowledge', display: 'Knowledge' },
  { id: 'love', display: 'Love' },
  { id: 'protection', name: 'Protection', display: 'Protection' },
  { id: 'general', name: 'General', display: 'General' }
];

export default function MantrasScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mantras, setMantras] = useState([]);
  const [filteredMantras, setFilteredMantras] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch mantras from API
  const fetchMantras = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('📡 Fetching mantras from API...');
      const result = await mantraAPI.getAllMantras();
      
      if (result.success) {
        console.log(`✅ Fetched ${result.data.data.length} mantras`);
        setMantras(result.data.data);
        setFilteredMantras(result.data.data);
      } else {
        console.error('❌ Failed to fetch mantras:', result.error);
        setError(result.error);
        Alert.alert('Error', 'Failed to load mantras. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error fetching mantras:', error);
      setError(error.message);
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchMantras();
  }, []);

  // Filter mantras based on search and category
  useEffect(() => {
    if (!mantras.length) return;

    let filtered = [...mantras];

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(mantra => 
        mantra.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(mantra => 
        mantra.name.toLowerCase().includes(query) ||
        (mantra.englishTransliteration && mantra.englishTransliteration.toLowerCase().includes(query)) ||
        (mantra.description && mantra.description.toLowerCase().includes(query))
      );
    }

    setFilteredMantras(filtered);
  }, [mantras, selectedCategory, searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMantras();
  };

  const handleMantraPress = (mantra) => {
    router.push({
      pathname: '/(tabs)/chant',
      params: { 
        mantraId: mantra._id,
        mantraName: mantra.name,
        sanskritText: mantra.sanskritText
      }
    });
  };

  // Loading state
  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading mantras...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search mantras..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.gray} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive,
                ]}
              >
                {category.display}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Mantras Count */}
      {/* <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {filteredMantras.length} {filteredMantras.length === 1 ? 'mantra' : 'mantras'} found
        </Text>
        {selectedCategory !== 'all' && (
          <Text style={styles.categoryFilterText}>
            in {categories.find(c => c.id === selectedCategory)?.display}
          </Text>
        )}
      </View> */}

      {/* Mantras List */}
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={60} color={colors.danger} />
          <Text style={styles.errorText}>Failed to load mantras</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchMantras}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredMantras}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <MantraCard
              mantra={item}
              onPress={() => handleMantraPress(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="book" size={60} color={colors.lightGray} />
              <Text style={styles.emptyText}>No mantras found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery ? 'Try a different search' : 'Try selecting a different category'}
              </Text>
            </View>
          }
        />
      )}

      {/* Debug Info (Remove in production) */}
      {/* {__DEV__ && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>
            Total: {mantras.length} | Filtered: {filteredMantras.length} | Category: {selectedCategory}
          </Text>
        </View>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: colors.gray,
  },
  searchContainer: {
    //paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: colors.dark,
  },
  categoriesContainer: {
    //paddingHorizontal: 20,
    marginBottom: 15,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.white,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray,
  },
  categoryTextActive: {
    color: colors.white,
  },
  countContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  countText: {
    fontSize: 14,
    color: colors.gray,
    fontWeight: '600',
  },
  categoryFilterText: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 2,
  },
  listContainer: {
    //paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.darkGray,
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 5,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.danger,
    marginTop: 15,
    marginBottom: 5,
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  debugContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 5,
  },
  debugText: {
    fontSize: 10,
    color: colors.white,
  },
});