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
import { useAuth, useUser } from '@/firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updatePassword,
    AuthError,
    UserCredential,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

const adminLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, { message: 'Password is required' }),
});

type AdminLoginValues = z.infer<typeof adminLoginSchema>;

const ADMIN_EMAIL = 'admin@vijay.com';
const ADMIN_PASSWORD = '92269315';

export default function AdminLoginPage() {
    const auth = useAuth();
    const db = useFirestore();
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<AdminLoginValues>({
        resolver: zodResolver(adminLoginSchema),
        defaultValues: { email: '', password: '' },
    });

    useEffect(() => {
        if (!isUserLoading && user) {
            // If already logged in, check if it's the admin?
            // Since we are using Firebase Auth, 'user' is the current user.
            // If they are logged in as admin@vijay.com, redirect.
            if (user.email === ADMIN_EMAIL) {
                router.push('/dashboard');
            }
        }
    }, [user, isUserLoading, router]);

    const onSubmit = async (data: AdminLoginValues) => {
        const email = data.email.trim().toLowerCase();
        const password = data.password.trim();

        console.log('Admin Login Attempt:', { email, passwordReceived: password }); // Debugging

        // strict check against hardcoded credentials
        if (email !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
            console.error('Credentials mismatch');
            toast({
                variant: 'destructive',
                title: 'Access Denied',
                description: 'Invalid admin credentials. Please check for typos.',
            });
            return;
        }

        setIsLoading(true);
        try {
            // Try to sign in
            try {
                await signInWithEmailAndPassword(auth, data.email, data.password);
                toast({
                    title: 'Admin Login Successful',
                    description: 'Welcome back, Admin.',
                });
                router.push('/dashboard');
            } catch (error: any) {
                // Check for user-not-found OR invalid-credential (which is returned if email enumeration protection is on)
                if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                    // Try to Create the admin user if not exists or if we got a generic credential error implying checking failed
                    try {
                        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);

                        // Set admin user doc
                        await setDoc(doc(db, 'users', userCredential.user.uid), {
                            uid: userCredential.user.uid,
                            email: userCredential.user.email,
                            role: 'admin',
                            name: 'Admin',
                            walletBalance: 0
                        });

                        toast({
                            title: 'Admin Account Created',
                            description: 'Admin account initialized and logged in.',
                        });
                        router.push('/dashboard');
                    } catch (createError: any) {
                        // If creation fails because email in use, it means the user DOES exist, so the original invalid-credential WAS a wrong password
                        if (createError.code === 'auth/email-already-in-use') {
                            // AUTOMATED FIX: Try to login with the OLD password and update it to the NEW one
                            try {
                                console.log("Attempting migration with old password...");
                                const oldPasswordCredential = await signInWithEmailAndPassword(auth, data.email, '8668439274');
                                await updatePassword(oldPasswordCredential.user, data.password);

                                // Update Firestore just in case
                                await setDoc(doc(db, 'users', oldPasswordCredential.user.uid), {
                                    uid: oldPasswordCredential.user.uid,
                                    email: oldPasswordCredential.user.email,
                                    role: 'admin',
                                    name: 'Admin',
                                    walletBalance: 0
                                }, { merge: true });

                                toast({
                                    title: 'Password Updated',
                                    description: 'Admin password has been automatically updated to the new one.',
                                });
                                router.push('/dashboard');
                            } catch (migrationError) {
                                // If old password also fails, then we are truly stuck (or user manually changed it to something else)
                                console.error("Migration failed:", migrationError);
                                toast({
                                    variant: 'destructive',
                                    title: 'Login Failed',
                                    description: 'Admin account exists but password does not match Firebase records. Please check Firebase Auth or reset password.',
                                });
                            }
                        } else {
                            throw createError;
                        }
                    }
                } else {
                    throw error;
                }
            }
        } catch (error: any) {
            console.error('Admin Login Error:', error);
            let description = 'Could not log in as admin. Please try again.';
            if (error.code === 'auth/operation-not-allowed') {
                description = 'Email/Password sign-in is not enabled in Firebase Console. Please enable it.';
            }
            toast({
                variant: 'destructive',
                title: 'Authentication Error',
                description,
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isUserLoading && user?.email === ADMIN_EMAIL) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-sm border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-2xl text-destructive">Admin Login</CardTitle>
                    <CardDescription>
                        Restricted access. Please enter admin credentials.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                {...form.register('email')}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                {...form.register('password')}
                                disabled={isLoading}
                            />
                        </div>
                        <Button type="submit" variant="destructive" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Verifying...' : 'Admin Login'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
