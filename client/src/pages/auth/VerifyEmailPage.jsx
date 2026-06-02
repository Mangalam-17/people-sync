import { useParams, Link } from 'react-router-dom';
import { useVerifyEmailQuery } from '@/features/auth/authApi';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const { isLoading, isSuccess, isError, error } = useVerifyEmailQuery(token);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        className="w-full max-w-sm text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {isLoading && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-muted-foreground">Verifying your email...</p>
          </div>
        )}

        {isSuccess && (
          <div>
            <div className="mx-auto w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mb-5">
              <CheckCircle className="h-7 w-7 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight mb-2">
              Email verified!
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Your email has been verified successfully. You can now sign in to your account.
            </p>
            <Link to="/login">
              <Button className="w-full" size="lg">
                Sign in to PeopleSync
              </Button>
            </Link>
          </div>
        )}

        {isError && (
          <div>
            <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-5">
              <XCircle className="h-7 w-7 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight mb-2">
              Verification failed
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              {error?.data?.error?.message || 'The verification link is invalid or has expired.'}
            </p>
            <Link to="/login">
              <Button variant="outline" className="w-full">
                Back to sign in
              </Button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
