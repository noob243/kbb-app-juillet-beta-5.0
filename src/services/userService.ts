import { AppUser, CreateUserPayload, ModuleKey, UserRole, PersonnelCategory } from '../types/rbac';
import { DEFAULT_ROLE_PERMISSIONS } from './rbacService';
import { db } from '../firebase';
import { collection, doc, getDocs, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';

const LOCAL_STORAGE_KEY = 'kbb_users_db_v2';

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'user_admin_1',
    email: 'jeremieshusu4@gmail.com',
    fullName: 'Jérémie Shusu',
    role: 'Admin',
    userType: 'Avocat',
    functionRole: 'Associé Directeur',
    hasAppAccess: true,
    permissions: DEFAULT_ROLE_PERMISSIONS.Admin,
    status: 'Actif',
    isDeleted: false,
    phone: '+243 810 000 001',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'user_admin_2',
    email: 'hervemich@icloud.com',
    fullName: 'Hervé Mich',
    role: 'Admin',
    userType: 'Avocat',
    functionRole: 'Associé Gérant',
    hasAppAccess: true,
    permissions: DEFAULT_ROLE_PERMISSIONS.Admin,
    status: 'Actif',
    isDeleted: false,
    phone: '+243 810 000 002',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'user_admin_3',
    email: 'admin@cabinet.com',
    fullName: 'Administrateur Cabinet',
    role: 'Admin',
    userType: 'Personnel',
    personnelCategory: 'Administratif',
    functionRole: 'Gestionnaire Cabinet',
    hasAppAccess: true,
    permissions: DEFAULT_ROLE_PERMISSIONS.Admin,
    status: 'Actif',
    isDeleted: false,
    phone: '+243 810 000 003',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'user_avocat_1',
    email: 'jl.tshisekedi@cabinet.com',
    fullName: 'Jean-Luc Tshisekedi',
    role: 'Avocat',
    userType: 'Avocat',
    functionRole: 'Senior',
    hasAppAccess: true,
    permissions: DEFAULT_ROLE_PERMISSIONS.Avocat,
    status: 'Actif',
    isDeleted: false,
    phone: '+243 810 111 222',
    createdAt: '2025-01-05T00:00:00.000Z',
    updatedAt: '2025-01-05T00:00:00.000Z'
  },
  {
    id: 'user_avocat_2',
    email: 'mc.mobutu@cabinet.com',
    fullName: 'Marie-Claire Mobutu',
    role: 'Avocat',
    userType: 'Avocat',
    functionRole: 'Associé',
    hasAppAccess: true,
    permissions: DEFAULT_ROLE_PERMISSIONS.Avocat,
    status: 'Actif',
    isDeleted: false,
    phone: '+243 810 333 444',
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'user_avocat_3',
    email: 'p.lumumba@cabinet.com',
    fullName: 'Patrice Lumumba',
    role: 'Avocat',
    userType: 'Avocat',
    functionRole: 'Junior',
    hasAppAccess: true,
    permissions: DEFAULT_ROLE_PERMISSIONS.Avocat,
    status: 'Actif',
    isDeleted: false,
    phone: '+243 810 555 666',
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-01T00:00:00.000Z'
  },
  {
    id: 'user_staff_1',
    email: 'f.kanku@cabinet.com',
    fullName: 'Francine Kanku',
    role: 'Personnel',
    userType: 'Personnel',
    personnelCategory: 'Administratif',
    functionRole: 'Secrétaire de Direction',
    hasAppAccess: true,
    permissions: DEFAULT_ROLE_PERMISSIONS.Personnel,
    status: 'Actif',
    isDeleted: false,
    phone: '+243 810 777 888',
    createdAt: '2025-02-10T00:00:00.000Z',
    updatedAt: '2025-02-10T00:00:00.000Z'
  },
  {
    id: 'user_staff_2',
    email: 'd.mbenga@cabinet.com',
    fullName: 'David Mbenga',
    role: 'Personnel',
    userType: 'Personnel',
    personnelCategory: 'Office',
    functionRole: 'Agent de courtoisie & Chauffeur',
    hasAppAccess: false,
    permissions: [],
    status: 'Actif',
    isDeleted: false,
    phone: '+243 810 999 000',
    createdAt: '2025-02-15T00:00:00.000Z',
    updatedAt: '2025-02-15T00:00:00.000Z'
  }
];

export function getLocalUsers(): AppUser[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return INITIAL_USERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_USERS;
  } catch (err) {
    console.error("Error reading users from local storage:", err);
    return INITIAL_USERS;
  }
}

export function saveLocalUsers(users: AppUser[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error("Error saving users to local storage:", err);
  }
}

export async function syncUsersWithFirestore(onUpdate: (users: AppUser[]) => void): Promise<() => void> {
  const usersRef = collection(db, 'users');
  
  // First check if collection is empty, seed if so
  try {
    const snap = await getDocs(usersRef);
    if (snap.empty) {
      console.log("Seeding Firestore users collection...");
      for (const user of INITIAL_USERS) {
        await setDoc(doc(db, 'users', user.id), user);
      }
    }
  } catch (e) {
    console.warn("Firestore user check failed, falling back to local storage:", e);
  }

  // Subscribe to real-time changes
  const unsub = onSnapshot(usersRef, (snapshot) => {
    if (!snapshot.empty) {
      const remoteUsers: AppUser[] = [];
      snapshot.forEach(docSnap => {
        remoteUsers.push(docSnap.data() as AppUser);
      });
      saveLocalUsers(remoteUsers);
      onUpdate(remoteUsers);
    } else {
      const local = getLocalUsers();
      onUpdate(local);
    }
  }, (error) => {
    console.warn("Real-time users subscription error, using local state:", error);
    onUpdate(getLocalUsers());
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

  // 1. Save locally
  const current = getLocalUsers();
  const updated = [newUser, ...current];
  saveLocalUsers(updated);

  // 2. Save to Firestore
  try {
    await setDoc(doc(db, 'users', newUser.id), newUser);
  } catch (err) {
    console.warn("Failed to write new user to Firestore:", err);
  }

  return newUser;
}

export async function updateAppUser(userId: string, updates: Partial<AppUser>): Promise<void> {
  const current = getLocalUsers();
  const now = new Date().toISOString();

  const updatedUsers = current.map(u => {
    if (u.id === userId) {
      const isOfficePersonnel = (updates.userType || u.userType) === 'Personnel' && 
                                (updates.personnelCategory || u.personnelCategory) === 'Office';
      const hasAppAccess = !isOfficePersonnel;

      return {
        ...u,
        ...updates,
        hasAppAccess,
        permissions: hasAppAccess ? (updates.permissions || u.permissions) : [],
        updatedAt: now
      };
    }
    return u;
  });

  saveLocalUsers(updatedUsers);

  try {
    const targetDoc = updatedUsers.find(u => u.id === userId);
    if (targetDoc) {
      await setDoc(doc(db, 'users', userId), targetDoc, { merge: true });
    }
  } catch (err) {
    console.warn("Failed to update user in Firestore:", err);
  }
}

export async function softDeleteUser(userId: string): Promise<void> {
  const current = getLocalUsers();
  const now = new Date().toISOString();

  const updatedUsers = current.map(u => {
    if (u.id === userId) {
      return {
        ...u,
        isDeleted: true,
        status: 'Archivé' as const,
        updatedAt: now
      };
    }
    return u;
  });

  saveLocalUsers(updatedUsers);

  try {
    await updateDoc(doc(db, 'users', userId), {
      isDeleted: true,
      status: 'Archivé',
      updatedAt: now
    });
  } catch (err) {
    console.warn("Failed to soft delete user in Firestore:", err);
  }
}

export async function restoreUser(userId: string): Promise<void> {
  const current = getLocalUsers();
  const now = new Date().toISOString();

  const updatedUsers = current.map(u => {
    if (u.id === userId) {
      return {
        ...u,
        isDeleted: false,
        status: 'Actif' as const,
        updatedAt: now
      };
    }
    return u;
  });

  saveLocalUsers(updatedUsers);

  try {
    await updateDoc(doc(db, 'users', userId), {
      isDeleted: false,
      status: 'Actif',
      updatedAt: now
    });
  } catch (err) {
    console.warn("Failed to restore user in Firestore:", err);
  }
}
