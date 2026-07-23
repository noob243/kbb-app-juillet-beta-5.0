
import { AppUser, CreateUserPayload, UserRole, PersonnelCategory } from '../types/rbac';
import { DEFAULT_ROLE_PERMISSIONS } from './rbacService';
import { db } from '../firebase';
import { collection, doc, getDocs, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';

export async function syncUsersWithFirestore(onUpdate: (users: AppUser[]) => void): Promise<() => void> {
  const usersRef = collection(db, 'users');

  const unsub = onSnapshot(usersRef, (snapshot) => {
    const remoteUsers: AppUser[] = [];
    snapshot.forEach(docSnap => {
      remoteUsers.push(docSnap.data() as AppUser);
    });
    onUpdate(remoteUsers);
  }, (error) => {
    console.error("Real-time users subscription error:", error);
    onUpdate([]);
  });

  return unsub;
}

export async function createNewUser(payload: CreateUserPayload): Promise<AppUser> {
  const now = new Date().toISOString();
  const newId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  
  const isOfficePersonnel = payload.userType === 'Personnel' && payload.personnelCategory === 'Office';
  const hasAppAccess = !isOfficePersonnel;
  
  let role: UserRole = 'Personnel';
  if (payload.userType === 'Avocat') {
    role = 'Avocat';
  } else if (payload.userType === 'Personnel') {
    if (payload.personnelCategory === 'Administratif') {
      role = 'Personnel';
    } else {
      role = 'Personnel';
    }
  }

  const newUser: AppUser = {
    id: newId,
    email: payload.email.trim().toLowerCase(),
    fullName: payload.fullName.trim(),
    role: role,
    userType: payload.userType,
    personnelCategory: payload.userType === 'Personnel' ? payload.personnelCategory || 'Administratif' : undefined,
    functionRole: payload.functionRole,
    hasAppAccess: hasAppAccess,
    permissions: hasAppAccess ? payload.permissions : [],
    status: 'Actif',
    isDeleted: false,
    phone: payload.phone || '',
    linkedEntityId: payload.linkedEntityId,
    createdAt: now,
    updatedAt: now
  };

  await setDoc(doc(db, 'users', newUser.id), newUser);

  return newUser;
}

export async function updateAppUser(userId: string, updates: Partial<AppUser>): Promise<void> {
  const now = new Date().toISOString();

  const isOfficePersonnel = (updates.userType) === 'Personnel' && (updates.personnelCategory) === 'Office';
  const hasAppAccess = !isOfficePersonnel;

  const finalUpdates = {
    ...updates,
    hasAppAccess,
    permissions: hasAppAccess ? (updates.permissions) : [],
    updatedAt: now
  };

  await setDoc(doc(db, 'users', userId), finalUpdates, { merge: true });
}

export async function softDeleteUser(userId: string): Promise<void> {
  const now = new Date().toISOString();
  await updateDoc(doc(db, 'users', userId), {
    isDeleted: true,
    status: 'Archivé',
    updatedAt: now
  });
}

export async function restoreUser(userId: string): Promise<void> {
  const now = new Date().toISOString();
  await updateDoc(doc(db, 'users', userId), {
    isDeleted: false,
    status: 'Actif',
    updatedAt: now
  });
}
