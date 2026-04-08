import { collection, addDoc, getDocs, getDoc, doc, deleteDoc, updateDoc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";

// References
const newsCollection = collection(db, "noticias");

export const createNews = async (newsData) => {
    try {
        const docRef = await addDoc(newsCollection, {
            title: newsData.title,
            subtitle: newsData.subtitle || "",
            mainImage: newsData.mainImage || "",
            blocks: newsData.blocks || [],
            createdBy: newsData.createdBy || "Admin",
            createdAt: serverTimestamp(),
            publishDate: newsData.publishDate || serverTimestamp(),
        });

        return docRef.id;
    } catch (error) {
        console.error("Error creating news: ", error);
        throw error;
    }
};

export const getNews = async () => {
    try {
        const q = query(newsCollection, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        let news = [];
        querySnapshot.forEach((doc) => {
            news.push({ id: doc.id, ...doc.data() });
        });
        return news;
    } catch (error) {
        console.error("Error fetching news: ", error);
        throw error;
    }
};

export const deleteNews = async (id, blocks, mainImage) => {
    try {
        // Delete main image if exists
        if (mainImage && mainImage.includes("firebasestorage.googleapis.com")) {
            try {
                const decodedUrl = decodeURIComponent(mainImage);
                const start = decodedUrl.indexOf("/o/") + 3;
                const end = decodedUrl.indexOf("?alt=media");
                if (start !== -1 && end !== -1) {
                    const filePath = decodedUrl.substring(start, end);
                    await deleteObject(ref(storage, filePath));
                }
            } catch (err) {
                console.error("Error deleting main image:", err);
            }
        }

        // Delete block images
        if (blocks && Array.isArray(blocks)) {
            for (const block of blocks) {
                if (block.type === 'imagen' && block.value && block.value.includes("firebasestorage.googleapis.com")) {
                    try {
                        const decodedUrl = decodeURIComponent(block.value);
                        const start = decodedUrl.indexOf("/o/") + 3;
                        const end = decodedUrl.indexOf("?alt=media");
                        if (start !== -1 && end !== -1) {
                            const filePath = decodedUrl.substring(start, end);
                            await deleteObject(ref(storage, filePath));
                        }
                    } catch (err) {
                        console.error("Error deleting block image:", err);
                    }
                }
            }
        }

        await deleteDoc(doc(db, "noticias", id));
    } catch (error) {
        console.error("Error deleting news: ", error);
        throw error;
    }
};
