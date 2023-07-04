import * as SQLite from "expo-sqlite";

const dbName = "little_lemon";

function openDatabase() {
  const connection = SQLite.openDatabase(`${dbName}.db`);
  connection.transaction((tx) => {
    tx.executeSql(
      "create table if not exists menuitems (id integer primary key not null, name text, description text, price decimal, image text, category text);"
    );
  });
  return connection;
}

const db = openDatabase();

export const getItems = () => {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql("select * from menuitems", [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
};

export const setItems = (items) => {
  const placeholders = items.map((_) => "(?, ?, ?, ?, ?)").join(", ");
  const values = items.reduce((acc, item) => {
    acc.push(
      item.name,
      item.price,
      item.description,
      item.image,
      item.category
    );
    return acc;
  }, []);

  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `insert into menuitems (name, price, description, image, category) values ${placeholders}`,
          values
        );
      },
      reject,
      resolve
    );
  });
};

export async function filterByQueryAndCategories(query, activeCategories) {
  let statement = `select * from menuitems where name like '%${query}%'`;
  if (activeCategories?.length)
    statement += `and category in (${activeCategories
      .map((_) => `?`)
      .join(", ")})`;
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(statement, activeCategories, (_, { rows }) => {
        console.log(rows._array);
        resolve(rows._array);
      });
    });
  });
}
