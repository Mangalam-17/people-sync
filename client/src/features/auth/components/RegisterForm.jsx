import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, ArrowRight, CheckCircle, Ticket } from 'lucide-react';
import { useRegisterMutation } from '@/features/auth/authApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/v1';

const registerSchema = z
  .object({
    invitationCode: z.string().min(5, 'Invitation code is required'),
    companyName: z.string().min(2, 'Company name must be at least 2 characters').max(100),
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    email: z.string().email('Please enter a valid email'),
    password: z
      .string()
      .min(8, 'Must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[a-z]/, 'Must contain a lowercase letter')
      .regex(/[0-9]/, 'Must contain a number')
      .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const RegisterForm = () => {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [inviteData, setInviteData] = useState(null);
  const [validatingInvite, setValidatingInvite] = useState(false);
  const [registerMutation, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      invitationCode: searchParams.get('invite') || '',
      companyName: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password', '');
  const invitationCode = watch('invitationCode', '');

  // Validate invitation code when it changes
  useEffect(() => {
    const validateInvite = async () => {
      if (!invitationCode || invitationCode.length < 5) {
        setInviteData(null);
        return;
      }

      setValidatingInvite(true);
      try {
        const response = await axios.get(`${API_URL}/invitations/validate/${invitationCode}`);
        const invitation = response.data.data.invitation;
        
        setInviteData(invitation);
        
        // Pre-fill form with invitation data
        if (invitation.companyName) setValue('companyName', invitation.companyName);
        if (invitation.email) setValue('email', invitation.email);
        if (invitation.firstName) setValue('firstName', invitation.firstName);
        if (invitation.lastName) setValue('lastName', invitation.lastName);
        
        toast.success('Invitation valid! Form pre-filled.');
      } catch (error) {
        setInviteData(null);
        if (error.response?.data?.error?.code === 'INVITATION_NOT_FOUND') {
          toast.error('Invalid invitation code');
        } else if (error.response?.data?.error?.code === 'INVITATION_ALREADY_USED') {
          toast.error('This invitation has already been used');
        } else if (error.response?.data?.error?.code === 'INVITATION_EXPIRED') {
          toast.error('This invitation has expired');
        }
      } finally {
        setValidatingInvite(false);
      }
    };

    const debounce = setTimeout(validateInvite, 500);
    return () => clearTimeout(debounce);
  }, [invitationCode, setValue]);

  const passwordChecks = [
    { label: '8+ characters', met: password.length >= 8 },
    { label: 'Uppercase', met: /[A-Z]/.test(password) },
    { label: 'Lowercase', met: /[a-z]/.test(password) },
    { label: 'Number', met: /[0-9]/.test(password) },
    { label: 'Special char', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const onSubmit = async (data) => {
    const registerPromise = registerMutation(data).unwrap();

    toast.promise(registerPromise, {
      loading: 'Creating workspace...',
      success: 'Workspace created successfully!',
      error: (err) => err?.data?.error?.message || 'Registration failed. Please try again.',
    });

    try {
      await registerPromise;
      setIsSuccess(true);
    } catch (error) {
      // Error handled by toast.promise
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-4">
          <CheckCircle className="h-6 w-6 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight mb-2">Check your email</h2>
        <p className="text-muted-foreground text-sm mb-6">
          We&apos;ve sent a verification link to your email address.
          Please verify your email before signing in.
        </p>
        <Link to="/login">
          <Button variant="outline" className="w-full">
            Go to Sign in
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Create your workspace</h2>
        <p className="text-muted-foreground text-sm mt-1.5">
          Set up your company and admin account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        {/* Invitation Code Field */}
        <div className="space-y-1.5">
          <Label htmlFor="invitationCode" className="flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            Invitation Code
          </Label>
          <Input
            id="invitationCode"
            placeholder="INV-XXXXX-XXXXX"
            className="font-mono uppercase"
            {...register('invitationCode')}
          />
          {validatingInvite && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Validating invitation...
            </p>
          )}
          {inviteData && (
            <p className="text-xs text-success flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Valid invitation for {inviteData.companyName}
            </p>
          )}
          {errors.invitationCode && (
            <p className="text-xs text-destructive">{errors.invitationCode.message}</p>
          )}
        </div>

        {/* Company Name */}
        <div className="space-y-1.5">
          <Label htmlFor="companyName">Company name</Label>
          <Input
            id="companyName"
            placeholder="Acme Inc"
            {...register('companyName')}
            readOnly={inviteData?.companyName}
          />
          {errors.companyName && (
            <p className="text-xs text-destructive">{errors.companyName.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" placeholder="John" {...register('firstName')} />
            {errors.firstName && (
              <p className="text-xs text-destructive">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" placeholder="Doe" {...register('lastName')} />
            {errors.lastName && (
              <p className="text-xs text-destructive">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reg-email">Work email</Label>
          <Input
            id="reg-email"
            type="email"
            placeholder="john@acme.com"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reg-password">Password</Label>
          <div className="relative">
            <Input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              autoComplete="new-password"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {password && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {passwordChecks.map((check) => (
                <span
                  key={check.label}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                    check.met
                      ? 'bg-success/10 text-success'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {check.label}
                </span>
              ))}
            </div>
          )}
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            autoComplete="new-password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Create workspace
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
