import { AppUser, CreateUserPayload, UserRole } from '../types/rbac';
import { apiService } from './api';

/**
 * Service de gestion des utilisateurs synchronisé avec le backend MongoDB.
 */

export async function syncUsersWithBackend(onUpdate: (users: AppUser[]) => void): Promise<() => void> {
  const fetchUsers = async () => {
    try {
      const users = await apiService.users.getAll();
      onUpdate(users);
    } catch (e) {
      console.error("Erreur de synchronisation des utilisateurs:", e);
    }
  };

  fetchUsers();
  const interval = setInterval(fetchUsers, 30000); // Polling toutes les 30s
  return () => clearInterval(interval);
}

export async function createNewUser(payload: CreateUserPayload): Promise<AppUser> {
  const now = new Date().toISOString();
  const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  
  const isOfficePersonnel = payload.userType === 'Personnel' && payload.personnelCategory === 'Office';
  const hasAppAccess = payload.hasAppAccess !== undefined ? payload.hasAppAccess : !isOfficePersonnel;
  
  let role: UserRole = 'Personnel';
  if (payload.userType === 'Avocat') role = 'Avocat';

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
  await apiService.users.update(userId, { ...updates, updatedAt: new Date().toISOString() });
}

export async function softDeleteUser(userId: string): Promise<void> {
  await apiService.users.update(userId, {
    isDeleted: true,
    status: 'Archivé',
    updatedAt: new Date().toISOString()
  });
}
