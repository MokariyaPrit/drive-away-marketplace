import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/users/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.message || 'Invalid OTP');
        setIsLoading(false);
        return;
      }
      toast.success('Email verified! You can now log in.');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    try {
      const response = await fetch('http://localhost:3000/api/users/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.message || 'Failed to resend OTP');
      } else {
        toast.success('OTP resent to your email!');
      }
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Verify OTP</CardTitle>
            </CardHeader>
            <form onSubmit={handleVerify}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter the OTP sent to your email</Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="6-digit OTP"
                    maxLength={6}
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendOtp}
                    disabled={resending}
                  >
                    {resending ? 'Resending...' : 'Resend OTP'}
                  </Button>
                </div>
              </CardContent>
              <div className="flex flex-col space-y-4 px-6 pb-6">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Verifying...' : 'Verify'}
                </Button>
                <div className="text-center text-sm">
                  <Link to="/login" className="text-blue-600 hover:text-blue-800">
                    Back to Login
                  </Link>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VerifyOtp;
