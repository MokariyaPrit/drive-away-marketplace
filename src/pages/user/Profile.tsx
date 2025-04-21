import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/data/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle } from 'lucide-react';
import { userService } from '@/services/api/userService';

const Profile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    avatar: currentUser?.avatar || '',
    phone: currentUser?.phone || '',
    location: currentUser?.location || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSaving(true);

    try {
      // Update profile via API call
      // Expecting updated to be of type User or null
      const updated = await userService.updateProfile(currentUser.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        avatar: formData.avatar,
      });
      
      // Only update profile if we have a valid user object
      if (updated && typeof updated === 'object') {
        updateUserProfile(updated);
      }
      
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentUser) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Profile</CardTitle>
                    <CardDescription>Manage your account information</CardDescription>
                  </div>
                  {!isEditing && (
                    <Button onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avatar">Avatar URL</Label>
                      <Input
                        id="avatar"
                        name="avatar"
                        value={formData.avatar}
                        onChange={handleChange}
                      />
                    </div>
                    <CardFooter className="px-0 pt-4">
                      <Button type="button" variant="outline" className="mr-2" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </CardFooter>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                        <AvatarFallback className="text-lg">
                          <UserCircle className="h-12 w-12" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-semibold">{currentUser.name}</h3>
                        <p className="text-gray-500">{currentUser.email}</p>
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {currentUser.role}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                      {currentUser.phone && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                          <p>{currentUser.phone}</p>
                        </div>
                      )}
                      {currentUser.location && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Location</h4>
                          <p>{currentUser.location}</p>
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Member Since</h4>
                        <p>{new Date(currentUser.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
