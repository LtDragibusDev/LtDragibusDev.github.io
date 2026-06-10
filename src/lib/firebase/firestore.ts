import { browser } from '$app/environment';

import {
	collection,
	doc,
	addDoc,
	getDocs,
	query,
	orderBy,
	serverTimestamp,
	updateDoc,
	deleteDoc,
	where,
	type DocumentData
} from 'firebase/firestore';

import { db } from './firebase';

/* ---------------- TYPES ---------------- */

export interface ImageMeta {
	width: number;
	height: number;
}

export interface BlogPost {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	coverImage: string | null;
	imageMeta?: Record<string, ImageMeta>;
	createdAt: Date | null;
}

const COLLECTION = 'blogs';

/* ---------------- BLOG POSTS ---------------- */

export async function getPosts(): Promise<BlogPost[]> {
	if (!browser || !db) return [];

	const q = query(
		collection(db, COLLECTION),
		orderBy('createdAt', 'desc')
	);

	const snapshot = await getDocs(q);

	return snapshot.docs.map((d) => docToPost(d.id, d.data()));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
	if (!browser || !db) return null;

	const q = query(
		collection(db, COLLECTION),
		where('slug', '==', slug)
	);

	const snapshot = await getDocs(q);

	if (snapshot.empty) return null;

	const d = snapshot.docs[0];

	return docToPost(d.id, d.data());
}

export async function createPost(
	data: Omit<BlogPost, 'id' | 'createdAt'>
): Promise<string> {
	if (!browser || !db) throw new Error('Firestore not available');

	const ref = await addDoc(collection(db, COLLECTION), {
		...data,
		createdAt: serverTimestamp()
	});

	return ref.id;
}

export async function updatePost(
	id: string,
	data: Partial<BlogPost>
): Promise<void> {
	if (!browser || !db) return;

	const postRef = doc(db, COLLECTION, id);
	await updateDoc(postRef, data);
}

export async function deletePost(id: string): Promise<void> {
	if (!browser || !db) return;

	const postRef = doc(db, COLLECTION, id);
	await deleteDoc(postRef);
}

/* ---------------- MAPPING ---------------- */

function docToPost(id: string, data: DocumentData): BlogPost {
	return {
		id,
		title: data.title ?? '',
		slug: data.slug ?? '',
		excerpt: data.excerpt ?? '',
		content: data.content ?? '',
		coverImage: data.coverImage ?? null,
		imageMeta: data.imageMeta ?? {},
		createdAt: data.createdAt?.toDate?.() ?? null
	};
}

/* ---------------- MEDIA ---------------- */

export interface MediaItem {
	id: string;
	url: string;
	name: string;
	uploadedAt: Date | null;
	width?: number;
	height?: number;
}

const MEDIA_COLLECTION = 'media_gallery';

export async function getMediaItems(): Promise<MediaItem[]> {
	if (!browser || !db) return [];

	const q = query(
		collection(db, MEDIA_COLLECTION),
		orderBy('uploadedAt', 'desc')
	);

	const snapshot = await getDocs(q);

	return snapshot.docs.map((d) => docToMediaItem(d.id, d.data()));
}

export async function addMediaItem(data: {
	url: string;
	name: string;
	width?: number;
	height?: number;
}): Promise<string> {
	if (!browser || !db) throw new Error('Firestore not available');

	const ref = await addDoc(collection(db, MEDIA_COLLECTION), {
		...data,
		uploadedAt: serverTimestamp()
	});

	return ref.id;
}

export async function deleteMediaItem(id: string): Promise<void> {
	if (!browser || !db) return;

	const mediaRef = doc(db, MEDIA_COLLECTION, id);
	await deleteDoc(mediaRef);
}

/* ---------------- MEDIA MAPPING ---------------- */

function docToMediaItem(id: string, data: DocumentData): MediaItem {
	return {
		id,
		url: data.url ?? '',
		name: data.name ?? '',
		uploadedAt: data.uploadedAt?.toDate?.() ?? null,
		width: data.width,
		height: data.height
	};
}