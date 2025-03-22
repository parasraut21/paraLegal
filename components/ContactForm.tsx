import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from "sonner"


// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string(),
  company_name: z.string(),
  website: z.string(),
  subject: z.string(),
});

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data:any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        reset();
        setIsOpen(false);
        toast("Your response has submitted successfully.")
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // You could add an error toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="rounded-sm">
          Contact Us
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold mb-2">Contact Us</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mb-4">
          Fill out the form below and we&apos;ll get back to you shortly.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                  Name*
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Name"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">{errors.name.message?.toString()}</span>
                )}
              </div>
              <div>
                <Label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                  Email*
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="Email"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email.message?.toString()}</span>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-700">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  placeholder="Phone"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.phone && (
                  <span className="text-red-500 text-sm">{errors.phone.message?.toString()}</span>
                )}
              </div>
              <div>
                <Label htmlFor="company_name" className="block mb-1 text-sm font-medium text-gray-700">
                  Company Name
                </Label>
                <Input
                  id="company_name"
                  {...register('company_name')}
                  placeholder="Company Name"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.company_name && (
                  <span className="text-red-500 text-sm">{errors.company_name.message?.toString()}</span>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website" className="block mb-1 text-sm font-medium text-gray-700">
                  Website
                </Label>
                <Input
                  id="website"
                  {...register('website')}
                  placeholder="Website"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.website && (
                  <span className="text-red-500 text-sm">{errors.website.message?.toString()}</span>
                )}
              </div>
              <div>
                <Label htmlFor="subject" className="block mb-1 text-sm font-medium text-gray-700">
                  Subject
                </Label>
                <textarea
                  id="subject"
                  {...register('subject')}
                  placeholder="Subject"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              {errors.subject && (
                  <span className="text-red-500 text-sm">{errors.subject.message?.toString()}</span>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-100 hover:text-black hover:border-2"
            >
              {isSubmitting ? 'Sending...' : 'Submit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactForm;