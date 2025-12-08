'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, QrCode, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslate';
import axios from 'axios';
import { LOGIN } from '@/services/apiEndPoint';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const { t } = useTranslation();
  const authTranslations: any = t('auth' as any);
  const commonTranslations: any = t('common');

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');

    // Check if user is already logged in as admin
    if (authStatus === 'true' && userRole === 'admin') {
      toast.error('You need to logout first to login as user');
      router.push('/admin/dashboard');
      return;
    }

    // If already logged in as regular user, redirect to dashboard
    if (authStatus === 'true' && userRole && userRole !== 'admin') {
      setIsAuthenticated(true);
      router.replace('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    console.log(
      process.env.NEXT_PUBLIC_BASE_URL,
      'process.env.NEXT_PUBLIC_BASE_URL'
    );
    e.preventDefault();

    // Check for existing admin session
    const existingAuth = localStorage.getItem('isAuthenticated');
    const existingRole = localStorage.getItem('userRole');

    if (existingAuth === 'true' && existingRole === 'admin') {
      toast.error('You need to logout first to login as user');
      router.push('/admin/dashboard');
      return;
    }

    setIsLoading(true);
    const body = {
      email,
      password,
    };
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}${LOGIN}`,
        body
      );
      console.log('🚀 ~ handleLogin ~ response:', response);

      const { status, message, token, user } = response?.data || {};

      const userDataToStore = {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        userType: user.userType,
      };

      if (status) {
        localStorage.setItem('loginData', JSON.stringify(userDataToStore));

        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', user?.userType || '');
        localStorage.setItem('isAuthenticated', 'true');
        toast.success(message || 'Login successful!');
        if (user?.userType === 'admin' || user?.userType === 'manager') {
          router.push('/admin');
        } else if (user?.userType === 'underwriter') {
          router.push('/dashboard');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error: any) {
      console.log('🚀 ~ handleLogin ~ error:', error);
      if (error?.response?.status === 400 || error?.response?.status === 401) {
        toast.error(error?.response?.data?.message || 'Invalid credentials');
      } else if (error?.response?.status === 404) {
        toast.error('Something went wrong. Please try again.');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setError('');
    }
  };

  return (
    <div className="flex justify-center items-center bg-[#ecefdc] p-4 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="flex justify-center items-center space-x-3 my-4"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#243b31] p-2 rounded-xl"
            >
              <QrCode className="w-5 h-5 text-white" />{' '}
            </motion.div>
            <span className="font-bold text-[#243b31] text-2xl">QRIP.ge</span>
          </Link>
          <h1 className="font-bold text-gray-900 text-2xl">
            {authTranslations.login.welcomeBack}
          </h1>
          <p className="mt-2 text-gray-600">
            {authTranslations.login.subtitle}
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">
              {authTranslations.login.title}
            </CardTitle>
            <CardDescription className="text-center">
              {authTranslations.login.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{commonTranslations.email}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={authTranslations.login.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{commonTranslations.password}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={authTranslations.login.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-12 h-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="top-0 right-0 absolute hover:bg-transparent px-3 h-12"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Link
                  href="/forgot-password"
                  className="text-[#243b31] text-sm hover:underline"
                >
                  {authTranslations.login.forgotPassword}
                </Link>
              </div>

              <Button
                type="submit"
                className="bg-[#547455] hover:bg-[#243b31] shadow-lg w-full"
                disabled={isLoading}
              >
                {isLoading
                  ? authTranslations.login.signingIn
                  : authTranslations.login.signIn}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                {authTranslations.login.noAccount}{' '}
                <Link
                  href="/signup"
                  className="font-medium text-[#243b31] hover:underline"
                >
                  {authTranslations.login.signUp}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
