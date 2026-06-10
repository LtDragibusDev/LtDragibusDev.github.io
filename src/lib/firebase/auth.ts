import {
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	type User
} from 'firebase/auth';

import { auth } from './firebase';

export async function login(email: string, password: string): Promise<User> {
	if (!auth) throw new Error('Firebase not ready');
	const cred = await signInWithEmailAndPassword(auth, email, password);
	return cred.user;
}

export async function logout(): Promise<void> {
	if (!auth) return;
	await signOut(auth);
}

export function subscribeToAuth(callback: (user: User | null) => void): () => void {
	if (!auth) return () => {};
	return onAuthStateChanged(auth, callback);
}

export function getCurrentUser(): Promise<User | null> {
	if (!auth) return Promise.resolve(null);

	return new Promise((resolve) => {
		const unsub = onAuthStateChanged(auth, (user) => {
			unsub();
			resolve(user);
		});
	});
}