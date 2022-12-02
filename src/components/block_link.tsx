import Link from 'next/link';

const BlockLink = ({ className, ...props }: React.ComponentProps<typeof Link>) => {
  return (
    <Link
    className={`p-3 rounded border dark:border-0 hover:bg-gray-100  dark:bg-gray-900 dark:hover:bg-gray-700 my-1 transition-colors ease-in-out duration-75 ${className}`}
    {...props}
    />
  );
};

export default BlockLink;
