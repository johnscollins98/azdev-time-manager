import { PropsWithChildren } from 'react';

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="p-2">
      <h1 className="text-3xl font-bold mb-3">Time Manager</h1>
      {children}
    </div>
  );
};
