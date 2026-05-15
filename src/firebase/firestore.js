import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./config";

// ─── CATEGORIES ──────────────────────────────────────────────

export const getCategories = async () => {
  const q = query(collection(db, "categories"), orderBy("createdAt", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addCategory = async (name) => {
  return await addDoc(collection(db, "categories"), {
    name,
    createdAt: serverTimestamp(),
  });
};

export const deleteCategory = async (id) => {
  await deleteDoc(doc(db, "categories", id));
};

// ─── PRODUCTS ────────────────────────────────────────────────

export const getProducts = async () => {
  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getProductById = async (id) => {
  const snap = await getDoc(doc(db, "products", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

export const addProduct = async (data) => {
  return await addDoc(collection(db, "products"), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

export const updateProduct = async (id, data) => {
  await updateDoc(doc(db, "products", id), data);
};

export const deleteProduct = async (id) => {
  await deleteDoc(doc(db, "products", id));
};
