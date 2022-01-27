import { db } from "../db.js";

const SELECT_JOIN =
  "SELECT tw.id, tw.text, tw.created_at, tw.user_id, us.username, us.name, us.url FROM tweet as tw JOIN user as us ON tw.user_id=us.id";
const ORDER_DESC = "ORDER BY tw.created_at DESC";

export async function getAll() {
  return db
    .execute(`${SELECT_JOIN} ${ORDER_DESC}`) //
    .then((result) => result[0]);
}

export async function getAllByUsername(username) {
  return db
    .execute(`${SELECT_JOIN} WHERE username=? ${ORDER_DESC}`, [username])
    .then((result) => result[0]);
}

export async function getById(id) {
  return db
    .execute(`${SELECT_JOIN} WHERE tw.id=?`, [id])
    .then((result) => result[0][0]);
}

export async function create(text, userId) {
  return db
    .execute("INSERT INTO tweet (text, created_at, user_id) VALUES (?, ?, ?)", [
      text,
      new Date(),
      userId,
    ])
    .then((result) => getById(result[0].insertId));
}

export async function update(id, text) {
  return db
    .execute("UPDATE tweet SET text=? WHERE id=?", [text, id])
    .then(() => getById(id));
}

export async function remove(id) {
  return db.execute("DELETE FROM tweet WHERE id=?", [id]);
}
