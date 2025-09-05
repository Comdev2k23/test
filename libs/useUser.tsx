import { useState } from 'react';

export function useUser() {
  const [user, setUser] = useState<{ id: string; email: string } | null>({
    id: '12081982',
    email: 'Consolacion@example.com',
  });

  return { user, setUser };
}
