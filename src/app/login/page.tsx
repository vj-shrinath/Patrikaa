'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAuth, useUser } from '@/firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  AuthError,
  UserCredential,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name is required.' }),
  phone: z.string().min(10, { message: 'Phone number is required.' }),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // State for missing details modal
  const [showProfileComplete, setShowProfileComplete] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', phone: '' },
  });

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    const checkUserProfile = async () => {
      if (!isUserLoading && user) {
        // If we are already handling a pending user, don't interfere
        if (showProfileComplete) return;

        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          let isMissingInfo = false;
          let existingData: any = {};

          if (userDocSnap.exists()) {
            existingData = userDocSnap.data();
            if (!existingData['name'] || !existingData['phone']) {
              isMissingInfo = true;
            }
          } else {
            isMissingInfo = true;
          }

          if (isMissingInfo) {
            // Profile incomplete - show dialog
            profileForm.setValue('name', existingData['name'] || user.displayName || '');
            profileForm.setValue('phone', existingData['phone'] || user.phoneNumber || '');
            setPendingUser(user);
            setShowProfileComplete(true);
          } else {
            // Profile complete - redirect
            router.push('/dashboard');
          }
        } catch (error) {
          console.error("Profile check failed", error);
          // Fallback to dashboard? Or stay here?
          // router.push('/dashboard');
        }
      }
    };

    checkUserProfile();

  }, [user, isUserLoading, router, db, showProfileComplete, profileForm]);


  const handleAuthSuccess = async (userCredential: UserCredential) => {
    const firebaseUser = userCredential.user;

    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      let isMissingInfo = false;
      let existingData: any = {};

      if (userDocSnap.exists()) {
        existingData = userDocSnap.data();
        // Check for missing compulsory fields
        if (!existingData['name'] || !existingData['phone']) {
          isMissingInfo = true;
        }
      } else {
        isMissingInfo = true;
      }

      if (isMissingInfo) {
        // Pre-fill what we have
        profileForm.setValue('name', existingData['name'] || firebaseUser.displayName || '');
        profileForm.setValue('phone', existingData['phone'] || firebaseUser.phoneNumber || '');

        setPendingUser(firebaseUser);
        setShowProfileComplete(true);
        // Don't redirect yet
        return;
      }

      toast({
        title: 'Welcome Back!',
        description: "You're successfully logged in."
      });
      router.push('/dashboard');

    } catch (dbError) {
      console.error('Error checking user profile:', dbError);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not verify user profile. Please try again.',
      });
    }
  };

  const handleProfileSubmit = async (data: ProfileFormValues) => {
    if (!pendingUser) return;
    setIsLoading(true);
    try {
      const userDocRef = doc(db, 'users', pendingUser.uid);
      await setDoc(userDocRef, {
        uid: pendingUser.uid,
        email: pendingUser.email,
        name: data.name,
        phone: data.phone,
        walletBalance: 0,
      }, { merge: true });

      toast({
        title: 'Profile Updated',
        description: 'Your information has been saved.'
      });
      setShowProfileComplete(false);
      setPendingUser(null);
      router.push('/dashboard');
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Could not save your details. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      // Check if trying to login as admin via customer portal
      if (data.email.toLowerCase() === 'admin@vijay.com') {
        toast({
          variant: 'destructive',
          title: 'Access Restricted',
          description: 'Admin users must log in via the Admin Portal.',
        });
        setIsLoading(false);
        return;
      }

      const result = await signInWithEmailAndPassword(auth, data.email, data.password);
      await handleAuthSuccess(result);
    } catch (error) {
      handleAuthError(error as AuthError);
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Strict check: Admin cannot use this login method
      if (result.user.email === 'admin@vijay.com') {
        await auth.signOut();
        toast({
          variant: 'destructive',
          title: 'Access Restricted',
          description: 'Admin users must log in via the Admin Portal.',
        });
        setIsLoading(false);
        return;
      }

      await handleAuthSuccess(result);
    } catch (error) {
      handleAuthError(error as AuthError);
      setIsLoading(false);
    }
    // Note: If modal shows, we need to handle spinner. 
    // Effect checks showProfileComplete
  };


  const handleAuthError = (error: AuthError) => {
    console.error('Firebase Auth Error:', error);
    let description = 'An unexpected error occurred. Please try again.';
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        description = 'Invalid email or password. Please try again.';
        break;
      case 'auth/email-already-in-use':
        description =
          'This email is already in use. Please try logging in instead.';
        break;
      case 'auth/weak-password':
        description = 'The password is too weak. Please use at least 6 characters.';
        break;
      case 'auth/invalid-email':
        description = 'The email address is not valid.';
        break;
      case 'auth/popup-closed-by-user':
        description = 'Sign in was cancelled.';
        break;
      case 'auth/operation-not-allowed':
        description = 'This sign-in method is not enabled. Please initiate contact with support.';
        break;
    }
    toast({
      variant: 'destructive',
      title: 'Authentication Failed',
      description,
    });
  };

  // Monitor when dialog opens to stop loading spinner of the main form
  useEffect(() => {
    if (showProfileComplete) setIsLoading(false);
  }, [showProfileComplete]);

  if (isUserLoading && !pendingUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Sign in to access your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={loginForm.handleSubmit(handleEmailLogin)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                {...loginForm.register('email')}
                disabled={isLoading}
              />
              {loginForm.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...loginForm.register('password')}
                disabled={isLoading}
              />
              {loginForm.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In with Email'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button variant="outline" type="button" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Google
          </Button>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            <a href="/admin/login" className="hover:underline">Admin Access</a>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showProfileComplete} onOpenChange={(open) => {
        // Prevent closing by clicking outside if needed, or update state
        if (!open) {
          setShowProfileComplete(false);
          setPendingUser(null);
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Your Profile</DialogTitle>
            <DialogDescription>
              Please provide the following details to complete your registration. These are required for payments.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...profileForm.register('name')}
                disabled={isLoading}
              />
              {profileForm.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {profileForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+91 9876543210"
                {...profileForm.register('phone')}
                disabled={isLoading}
              />
              {profileForm.formState.errors.phone && (
                <p className="text-sm text-destructive">
                  {profileForm.formState.errors.phone.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>Save & Continue</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
