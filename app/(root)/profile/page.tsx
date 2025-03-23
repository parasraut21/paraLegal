'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserProfile } from '@/actions/user';
import { EducationLevel, Gender, IncomeRange, MaritalStatus, ResidenceType } from '@prisma/client';

interface UserProfile {
  age?: string;
  gender?: string;
  maritalStatus?: string;
  occupation?: string;
  income?: string;
  education?: string;
  hasChildren?: boolean;
  residenceType?: string;
  location?: string;
}

export type paramsType = Promise<{ existingProfile: UserProfile }>;

/**
 * UserProfileForm component
 *
 * This component is used to render a form for a user to update their profile information.
 * It renders a form with fields for the user's age, gender, marital status, occupation, income range, education level, whether they have children, residence type, and location.
 * The form data is stored in state using the useState hook and is updated whenever the user changes a field.
 * The form data is then sent to the updateUserProfile action when the user submits the form.
 * If the update is successful, the user is redirected to the /profile page, otherwise an error message is displayed.
 * @param {object} params - Contains the user's existing profile information promise
 * @returns {JSX.Element} - The UserProfileForm component
 */
export default function UserProfileForm({ params }: { params: paramsType }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    maritalStatus: '',
    occupation: '',
    income: '',
    education: '',
    hasChildren: '',
    residenceType: '',
    location: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params
      .then((data) => {
        const profile = data.existingProfile;
        setFormData({
          age: profile?.age?.toString() || '',
          gender: profile?.gender || '',
          maritalStatus: profile?.maritalStatus || '',
          occupation: profile?.occupation || '',
          income: profile?.income || '',
          education: profile?.education || '',
          hasChildren:
            profile?.hasChildren === true
              ? 'true'
              : profile?.hasChildren === false
              ? 'false'
              : '',
          residenceType: profile?.residenceType || '',
          location: profile?.location || '',
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading profile data:', error);
        setLoading(false);
      });
  }, [params]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const formattedData = {
        ...formData,
        age: formData.age || undefined,
        hasChildren:
          formData.hasChildren === 'true'
            ? 'true'
            : formData.hasChildren === 'false'
            ? 'false'
            : undefined,
        gender: formData.gender as Gender || undefined,
        maritalStatus: formData.maritalStatus as MaritalStatus || undefined,
        occupation: formData.occupation || undefined,
        income: formData.income as IncomeRange || undefined,
        education: formData.education as EducationLevel || undefined,
        residenceType: formData.residenceType as ResidenceType || undefined,
        location: formData.location || undefined,
      };
      const result = await updateUserProfile(formattedData);

      if (result.success) {
        setMessage('Profile updated successfully!');
        router.refresh();
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-300">
        Loading profile data...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-[#0a0a12]/90 backdrop-blur-sm border border-primary/20 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.15)] p-8 my-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mb-6 text-center">
          Update Your Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age Field */}
            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#131320] border border-primary/30 rounded-md focus:outline-none focus:ring-primary focus:border-primary placeholder:text-gray-500 text-gray-100"
                min="18"
                max="120"
              />
            </div>

            {/* Gender Field */}
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#131320] border border-primary/30 rounded-md focus:outline-none focus:ring-primary focus:border-primary text-gray-100"
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="NON_BINARY">Non-binary</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>

            {/* Marital Status Field */}
            <div>
              <label
                htmlFor="maritalStatus"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Marital Status
              </label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#131320] border border-primary/30 rounded-md focus:outline-none focus:ring-primary focus:border-primary text-gray-100"
              >
                <option value="">Select marital status</option>
                <option value="SINGLE">Single</option>
                <option value="MARRIED">Married</option>
                <option value="DIVORCED">Divorced</option>
                <option value="SEPARATED">Separated</option>
                <option value="WIDOWED">Widowed</option>
                <option value="DOMESTIC_PARTNERSHIP">Domestic Partnership</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>

            {/* Occupation Field */}
            <div>
              <label
                htmlFor="occupation"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Occupation
              </label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#131320] border border-primary/30 rounded-md focus:outline-none focus:ring-primary focus:border-primary placeholder:text-gray-500 text-gray-100"
              />
            </div>

            {/* Income Range Field */}
            <div>
              <label
                htmlFor="income"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Income Range
              </label>
              <select
                id="income"
                name="income"
                value={formData.income}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#131320] border border-primary/30 rounded-md focus:outline-none focus:ring-primary focus:border-primary text-gray-100"
              >
                <option value="">Select income range</option>
                <option value="UNDER_25K">Under $25,000</option>
                <option value="BETWEEN_25K_50K">$25,000 - $50,000</option>
                <option value="BETWEEN_50K_75K">$50,000 - $75,000</option>
                <option value="BETWEEN_75K_100K">$75,000 - $100,000</option>
                <option value="OVER_100K">Over $100,000</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>

            {/* Education Level Field */}
            <div>
              <label
                htmlFor="education"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Education Level
              </label>
              <select
                id="education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#131320] border border-primary/30 rounded-md focus:outline-none focus:ring-primary focus:border-primary text-gray-100"
              >
                <option value="">Select education level</option>
                <option value="HIGH_SCHOOL">High School</option>
                <option value="ASSOCIATES_DEGREE">Associate's Degree</option>
                <option value="BACHELORS_DEGREE">Bachelor's Degree</option>
                <option value="MASTERS_DEGREE">Master's Degree</option>
                <option value="DOCTORAL_DEGREE">Doctoral Degree</option>
                <option value="PROFESSIONAL_DEGREE">Professional Degree</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>

            {/* Has Children Field */}
            <div>
              <label
                htmlFor="hasChildren"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Do you have children?
              </label>
              <select
                id="hasChildren"
                name="hasChildren"
                value={formData.hasChildren}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#131320] border border-primary/30 rounded-md focus:outline-none focus:ring-primary focus:border-primary text-gray-100"
              >
                <option value="">Select option</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
                <option value="">Prefer not to say</option>
              </select>
            </div>

            {/* Residence Type Field */}
            <div>
              <label
                htmlFor="residenceType"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Residence Type
              </label>
              <select
                id="residenceType"
                name="residenceType"
                value={formData.residenceType}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#131320] border border-primary/30 rounded-md focus:outline-none focus:ring-primary focus:border-primary text-gray-100"
              >
                <option value="">Select residence type</option>
                <option value="OWNED">Owned</option>
                <option value="RENTED">Rented</option>
                <option value="LIVING_WITH_FAMILY">Living with Family</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>

            {/* Location Field */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Location (City/State)
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#131320] border border-primary/30 rounded-md focus:outline-none focus:ring-primary focus:border-primary placeholder:text-gray-500 text-gray-100"
                placeholder="e.g., New York, NY"
              />
            </div>
          </div>

          {message && (
            <div
              className={`mt-4 p-3 rounded-md ${
                message.includes('Error')
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary text-[#0a0a12] font-medium rounded-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
