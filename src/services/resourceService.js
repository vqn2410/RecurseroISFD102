import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, orderBy, where, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";

// References
const resourcesCollection = collection(db, "recursos");

// Create
export const createResource = async (resourceData, file) => {
    try {
        let fileUrl = "";
        if (file) {
            const uniqueFileName = `${Date.now()}_${file.name}`;
            const storageRef = ref(storage, `resources/${uniqueFileName}`);
            const snapshot = await uploadBytes(storageRef, file);
            fileUrl = await getDownloadURL(snapshot.ref);
        }

        const docRef = await addDoc(resourcesCollection, {
            ...resourceData,
            fileUrl: resourceData.type !== "enlace" ? fileUrl : resourceData.fileUrl,
            createdAt: serverTimestamp(),
            fechaSubida: serverTimestamp(),
        });

        return docRef.id;
    } catch (error) {
        console.error("Error creating resource: ", error);
        throw error;
    }
};

// Read specific limit or filters
export const getResources = async (categoryFilter = null, userId = null) => {
    try {
        let q;
        if (categoryFilter) {
            // First fetch by categories
            q = query(resourcesCollection, where("categories", "array-contains", categoryFilter));
        } else if (userId) {
            q = query(resourcesCollection, where("createdBy", "==", userId));
        } else {
            q = query(resourcesCollection, orderBy("createdAt", "desc"));
        }

        const querySnapshot = await getDocs(q);
        let resources = [];
        querySnapshot.forEach((doc) => {
            resources.push({ id: doc.id, ...doc.data() });
        });

        // Manual sorting if we used array-contains or where (because orderBy requires composite index)
        if (categoryFilter || userId) {
            resources.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
        }

        return resources;
    } catch (error) {
        console.error("Error fetching resources: ", error);
        throw error;
    }
};

// Update
export const updateResource = async (id, updatedData, newFile = null) => {
    try {
        const resourceRef = doc(db, "recursos", id);
        let finalData = { ...updatedData };

        if (newFile) {
            const uniqueFileName = `${Date.now()}_${newFile.name}`;
            const storageRef = ref(storage, `resources/${uniqueFileName}`);
            const snapshot = await uploadBytes(storageRef, newFile);
            finalData.fileUrl = await getDownloadURL(snapshot.ref);
        }

        await updateDoc(resourceRef, finalData);
    } catch (error) {
        console.error("Error updating resource: ", error);
        throw error;
    }
};

// Delete
export const deleteResource = async (id, fileUrl) => {
    try {
        // Also delete file from storage if it exists
        if (fileUrl && fileUrl.includes("firebasestorage.googleapis.com")) {
            // Decode URL to extract the path correctly
            const decodedUrl = decodeURIComponent(fileUrl);
            const start = decodedUrl.indexOf("/o/") + 3;
            const end = decodedUrl.indexOf("?alt=media");
            if (start !== -1 && end !== -1) {
                const filePath = decodedUrl.substring(start, end);
                const fileRef = ref(storage, filePath);
                try {
                    await deleteObject(fileRef);
                } catch (storageError) {
                    console.error("Error deleting file from storage (continuing with document deletion):", storageError);
                }
            }
        }

        await deleteDoc(doc(db, "recursos", id));
    } catch (error) {
        console.error("Error deleting resource: ", error);
        throw error;
    }
};
