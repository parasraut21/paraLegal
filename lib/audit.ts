export const saveAuditLog = async (
    userId: string,
    featureName: string,
    responseData: object | null,
    errorData: object | null,
    api_status: number
  ) => {
    try {
      // console.log('saveAuditLog',api_status)
      const res = await fetch('/api/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          feature_name: featureName,
          response: responseData,
          error: errorData,
          api_status:api_status
        }),
      });
  
      if (!res.ok) {
        console.error('Failed to save audit log');
      }
    } catch (err) {
      console.error('Audit log request error', err);
    }
  };
  