import Head from 'next/head';
import { PropsWithChildren } from 'react';
import Breadcrumb from './breadcrumb';

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="p-2 h-screen flex flex-col overflow-hidden">
        <h1 className="text-3xl font-bold mb-3">Time Manager</h1>
        <Breadcrumb />
        <div className="flex flex-col flex-1 overflow-auto pr-2">{children}</div>
      </div>
    </>
  );
};
