// Demo authentication system for testing
import { UserProfile } from '@/types';

const DEMO_USERS: { [email: string]: { password: string; profile: UserProfile } } = {
  'admin@demo.com': {
    password: 'admin123',
    profile: {
      uid: 'admin-demo-123',
      email: 'admin@demo.com',
      role: 'admin',
      name: 'Demo Admin',
      createdAt: new Date('2024-01-01'),
    }
  },
  'cashier@demo.com': {
    password: 'cashier123',
    profile: {
      uid: 'cashier-demo-456',
      email: 'cashier@demo.com',
      role: 'cashier',
      name: 'Demo Cashier',
      createdAt: new Date('2024-01-01'),
    }
  },
  'partner@demo.com': {
    password: 'partner123',
    profile: {
      uid: 'partner-demo-789',
      email: 'partner@demo.com',
      role: 'partner',
      name: 'Demo Partner',
      createdAt: new Date('2024-01-01'),
    }
  }
};

export interface DemoUser {
  uid: string;
  email: string;
  displayName?: string;
}

class DemoAuthService {
  private currentUser: DemoUser | null = null;
  private listeners: ((user: DemoUser | null) => void)[] = [];
  
  constructor() {
    // Check for existing session
    const savedUser = localStorage.getItem('demo-auth-user');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  onAuthStateChanged(callback: (user: DemoUser | null) => void) {
    this.listeners.push(callback);
    callback(this.currentUser);
    
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    const demoUser = DEMO_USERS[email];
    if (!demoUser || demoUser.password !== password) {
      throw new Error('Invalid credentials');
    }

    this.currentUser = {
      uid: demoUser.profile.uid,
      email: demoUser.profile.email,
      displayName: demoUser.profile.name
    };

    localStorage.setItem('demo-auth-user', JSON.stringify(this.currentUser));
    this.notifyListeners();
    
    return { user: this.currentUser };
  }

  async createUserWithEmailAndPassword(email: string, password: string) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    if (DEMO_USERS[email]) {
      throw new Error('User already exists');
    }

    const uid = `demo-${Date.now()}`;
    this.currentUser = {
      uid,
      email,
      displayName: email.split('@')[0]
    };

    localStorage.setItem('demo-auth-user', JSON.stringify(this.currentUser));
    this.notifyListeners();
    
    return { user: this.currentUser };
  }

  async signOut() {
    this.currentUser = null;
    localStorage.removeItem('demo-auth-user');
    localStorage.removeItem('demo-user-profile');
    this.notifyListeners();
  }

  getCurrentUser() {
    return this.currentUser;
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }
}

class DemoFirestore {
  async getDoc(docRef: any) {
    const userId = docRef.path.split('/')[1];
    const demoUser = Object.values(DEMO_USERS).find(user => user.profile.uid === userId);
    
    return {
      exists: () => !!demoUser,
      data: () => demoUser?.profile
    };
  }

  async setDoc(docRef: any, data: any) {
    // Simulate saving to firestore
    localStorage.setItem('demo-user-profile', JSON.stringify(data));
    return Promise.resolve();
  }
}

// Mock Firebase objects
export const demoAuth = new DemoAuthService();
export const demoDb = new DemoFirestore();

export const doc = (db: any, collection: string, id: string) => ({
  path: `${collection}/${id}`
});
export const getDoc = (docRef: any) => demoDb.getDoc(docRef);
export const setDoc = (docRef: any, data: any) => demoDb.setDoc(docRef, data);