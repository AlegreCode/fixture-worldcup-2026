import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-10 w-full">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-primary)] dark:border-[var(--color-secondary)]"></div>
    </div>
  );
};

export default Loader;
