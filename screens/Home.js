import {
  FlatList,
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { TYPOGRAPHY } from "../theme/typography";
import { COLORS } from "../theme/colors";
import { filterByQueryAndCategories, getItems, setItems } from "../db/sqlite";

const categories = ["starters", "mains", "desserts", "sides"];

const getImageUri = (imageFileName) =>
  `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${imageFileName}?raw=true`;

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    filterByQueryAndCategories("", selectedCategories).then(setMenu);
  }, [selectedCategories]);

  useEffect(() => {
    const fetchData = async () => {
      let data = await fetch(
        "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json"
      );
      data = await data.json();
      await setItems(data.menu);
      setMenu(data.menu);
    };

    getItems().then((items) => {
      if (!items.length) {
        fetchData();
      } else {
        setMenu(items);
      }
    });
  }, []);

  const keyExtractor = useCallback((item) => {
    return item.name;
  }, []);

  const renderItem = useCallback(({ item }) => {
    const imageUri = getImageUri(item.image);
    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardMain}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardBody}>{item.description}</Text>
          <Text style={styles.cardPrice}>${item.price}</Text>
        </View>
        <Image
          source={{ uri: imageUri }}
          resizeMode="cover"
          style={styles.itemImage}
        />
      </View>
    );
  }, []);

  const toggleCategory = (category) => {
    setSelectedCategories((curr) => {
      const s = new Set(curr);
      s.has(category) ? s.delete(category) : s.add(category);
      return Array.from(s);
    });
  };

  const ItemSeparator = () => <View style={styles.separator} />;

  const CategoryBadge = (props) => {
    const isActive = selectedCategories.includes(props.category);
    return (
      <TouchableOpacity onPress={() => toggleCategory(props.category)}>
        <View
          style={[
            styles.categoryContainer,
            isActive ? styles.activeCategoryContainer : undefined,
          ]}
        >
          <Text
            style={[
              styles.categoryLabel,
              isActive ? styles.activeCategoryLabel : undefined,
            ]}
          >
            {props.category}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.categoriesSection}>
        <Text style={styles.categoriesTitle}>Order for delivery</Text>
        <ScrollView
          style={styles.categoriesScrollview}
          contentContainerStyle={styles.categoriesContainerScrollview}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {categories.map((category, index) => (
            <CategoryBadge key={category + index} category={category} />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={menu}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
    </>
  );
}

const styles = StyleSheet.create({
  categoriesSection: {
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#bbb",
  },
  categoriesTitle: {
    ...TYPOGRAPHY.sectionHeader,
    textTransform: "uppercase",
    paddingHorizontal: 25,
  },
  categoriesScrollview: {
    marginTop: 10,
  },
  categoriesContainerScrollview: {
    paddingHorizontal: 25,
    gap: 20,
  },
  categoryContainer: {
    borderRadius: 16,
    backgroundColor: COLORS.light,
    padding: 10,
  },
  categoryLabel: {
    color: COLORS.accent,
    textTransform: "capitalize",
    ...TYPOGRAPHY.sectionHeader,
    fontSize: 16,
  },
  activeCategoryContainer: {
    backgroundColor: COLORS.accent,
  },
  activeCategoryLabel: {
    color: COLORS.light,
  },
  itemImage: {
    width: 80,
    height: 75,
  },
  cardTitle: {
    ...TYPOGRAPHY.cardTitle,
  },
  cardBody: {
    ...TYPOGRAPHY.cardBody,
  },
  cardPrice: {
    ...TYPOGRAPHY.cardPrice,
    color: COLORS.accent,
  },
  cardContainer: {
    padding: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  cardMain: {
    flex: 1,
    gap: 10,
  },
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#bbb",
  },
});
