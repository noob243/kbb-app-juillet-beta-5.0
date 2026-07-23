import { AppUser, CreateUserPayload, UserRole } from '../types/rbac';
import { apiService } from './api';

export const INITIAL_USERS: AppUser[] = [
  // ... Keep them for reference or initial seed if needed
];

export async function syncUsersWithFirestore(onUpdate: (users: AppUser[]) => void): Promise<() => void> {
  // Adaptation for MongoDB API: Polling or one-time fetch (since we don't have WebSockets yet)
  const fetchUsers = async () => {
    try {
      const users = await apiService.users.getAll();
      onUpdate(users);
    } catch (e) {
      console.error("Failed to fetch users from API:", e);
    }
  };

  fetchUsers();
  const interval = setInterval(fetchUsers, 30000); // Poll every 30s as a fallback for real-time

  return () => clearInterval(interval);
}

export async function createNewUser(payload: CreateUserPayload): Promise<AppUser> {
  const now = new Date().toISOString();
  const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  
  const isOfficePersonnel = payload.userType === 'Personnel' && payload.personnelCategory === 'Office';
  const hasAppAccess = payload.hasAppAccess !== undefined ? payload.hasAppAccess : !isOfficePersonnel;
  
  let role: UserRole = 'Personnel';
  if (payload.userType === 'Avocat') {
    role = 'Avocat';
  } else if (payload.userType === 'Personnel') {
    role = 'Personnel';
  }

  const newUser: AppUser = {
    id: newId,
    email: payload.email.trim().toLowerCase(),
    fullName: payload.fullName.trim(),
    role: role,
    userType: payload.userType,
    personnelCategory: payload.userType === 'Personnel' ? (payload.personnelCategory || 'Administratif') : undefined,
    functionRole: payload.functionRole || '',
    hasAppAccess: hasAppAccess,
    permissions: hasAppAccess ? (payload.permissions || []) : [],
    status: 'Actif',
    isDeleted: false,
    phone: payload.phone || '',
    linkedEntityId: payload.linkedEntityId || '',
    createdAt: now,
    updatedAt: now
  };

  return await apiService.users.create(newUser);
}

export async function updateAppUser(userId: string, updates: Partial<AppUser>): Promise<void> {
  await apiService.users.update(userId, updates);
}

export async function softDeleteUser(userId: string): Promise<void> {
  await apiService.users.update(userId, {
    isDeleted: true,
    status: 'Archivé',
    updatedAt: new Date().toISOString()
  });
}

export async function restoreUser(userId: string): Promise<void> {
  await apiService.users.update(userId, {
    isDeleted: false,
    status: 'Actif',
    updatedAt: new Date().toISOString()
  });
}
