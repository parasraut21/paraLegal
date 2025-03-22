// components/ProtectedLayout.jsx
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/utils/supabaseClient';

const ProtectedLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  const checkUserSession = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  useEffect(() => {
    checkUserSession();

    const handlePageShow = (event) => {
      if (event.persisted) {
        checkUserSession();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session Expired</DialogTitle>
            <DialogDescription>
              Your session has expired. Please log in again to continue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => (window.location.href = '/login')}>
              Go to Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div>{children}</div>
    </>
  );
};

export default ProtectedLayout;
