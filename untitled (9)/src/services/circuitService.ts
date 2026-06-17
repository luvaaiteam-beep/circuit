import { collection, doc, setDoc, getDoc, getDocs, query, orderBy, limit, deleteDoc, serverTimestamp, Timestamp, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { ComponentData, WireData } from '../store';
import { v4 as uuidv4 } from 'uuid';

export interface SavedCircuit {
  id: string;
  name: string;
  components: ComponentData[];
  wires: WireData[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isPublic: boolean;
  componentCount: number;
  thumbnailDesc: string;
}

export interface GalleryItem {
  id: string;
  uid: string;
  name: string;
  componentCount: number;
  thumbnailDesc: string;
  createdAt: Timestamp;
  circuitId: string;
  views?: number;
}

function generateThumbnailDesc(components: ComponentData[]): string {
  const counts: Record<string, number> = {};
  components.forEach(c => {
    counts[c.type] = (counts[c.type] || 0) + 1;
  });
  const parts = Object.entries(counts).map(([type, count]) => `${count} ${type}${count > 1 ? 's' : ''}`);
  return parts.join(', ') || 'Empty circuit';
}

export async function saveCircuit(uid: string, name: string, components: ComponentData[], wires: WireData[]): Promise<string> {
  const circuitId = uuidv4();
  const docRef = doc(db, `users/${uid}/circuits/${circuitId}`);
  
  await setDoc(docRef, {
    name,
    components,
    wires,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    isPublic: false,
    componentCount: components.length,
    thumbnailDesc: generateThumbnailDesc(components)
  });
  
  return circuitId;
}

export async function updateCircuit(uid: string, circuitId: string, components: ComponentData[], wires: WireData[]): Promise<void> {
  const docRef = doc(db, `users/${uid}/circuits/${circuitId}`);
  await setDoc(docRef, {
    components,
    wires,
    updatedAt: serverTimestamp(),
    componentCount: components.length,
    thumbnailDesc: generateThumbnailDesc(components)
  }, { merge: true });
}

export async function loadUserCircuits(uid: string): Promise<SavedCircuit[]> {
  const q = query(collection(db, `users/${uid}/circuits`), orderBy('updatedAt', 'desc'), limit(50));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedCircuit));
}

export async function deleteCircuit(uid: string, circuitId: string): Promise<void> {
  await deleteDoc(doc(db, `users/${uid}/circuits/${circuitId}`));
  // Also try to delete from publicCircuits just in case
  await deleteDoc(doc(db, `publicCircuits/${circuitId}`));
}

export async function shareCircuit(uid: string, circuitId: string): Promise<string> {
  const circuitRef = doc(db, `users/${uid}/circuits/${circuitId}`);
  const circuitSnap = await getDoc(circuitRef);
  
  if (!circuitSnap.exists()) {
    throw new Error("Circuit not found");
  }
  
  const data = circuitSnap.data();
  
  // Set isPublic: true on the circuit doc
  await setDoc(circuitRef, { isPublic: true }, { merge: true });
  
  // Write to top-level collection: publicCircuits/{circuitId}
  await setDoc(doc(db, `publicCircuits/${circuitId}`), {
    uid,
    name: data.name,
    componentCount: data.componentCount,
    thumbnailDesc: data.thumbnailDesc,
    createdAt: data.createdAt || serverTimestamp(),
    circuitId,
    views: 0
  });
  
  return `${window.location.origin}/shared/${circuitId}`;
}

export async function loadPublicCircuit(circuitId: string): Promise<{ components: ComponentData[], wires: WireData[], name: string } | null> {
  const publicRef = doc(db, `publicCircuits/${circuitId}`);
  const publicSnap = await getDoc(publicRef);
  
  if (!publicSnap.exists()) {
    return null;
  }
  
  const ownerUid = publicSnap.data().uid;
  
  const circuitRef = doc(db, `users/${ownerUid}/circuits/${circuitId}`);
  const circuitSnap = await getDoc(circuitRef);
  
  if (!circuitSnap.exists()) {
    return null;
  }
  
  const data = circuitSnap.data();
  if (!data.isPublic) {
    return null;
  }
  
  // Track open!
  try {
    await updateDoc(publicRef, { views: increment(1) });
  } catch (e) {
    // Ignore errors for anonymous or unauthenticated users reading
    console.error("Could not increment views", e);
  }
  
  return {
    components: data.components,
    wires: data.wires,
    name: data.name
  };
}

export async function loadPublicGallery(limitCount = 20): Promise<GalleryItem[]> {
  const q = query(collection(db, 'publicCircuits'), orderBy('createdAt', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem));
}
